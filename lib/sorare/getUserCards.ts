import { sorareRequest } from "../sorare";


const GET_USER_CARDS = `
query GetUserCards($slug: String!, $after: String) {
  user(slug: $slug) {
    cards(
      first: 50,
      after: $after,
      rarities: [limited, rare, super_rare, unique]
    ) {
      nodes {
        assetId
        slug
        pictureUrl
        displayRarity
        seasonYear

        publicMinPrices {
          eurCents
        }

        anyPlayer {
          displayName
          slug
          cardPositions
        }

        anyTeam {
          name
        }
      }

      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`;



function sleep(ms:number) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}




async function requestWithRetry(
  slug:string,
  after:string | null
) {

  let attempts = 0;


  while(attempts < 3) {

    try {

      return await sorareRequest(
        GET_USER_CARDS,
        {
          slug,
          after,
        }
      );


    } catch(error:any) {


      attempts++;


      console.log(
        `⚠️ Error Sorare intento ${attempts}/3`,
        error.message
      );


      if(attempts >= 3) {
        throw error;
      }


      await sleep(
        attempts * 3000
      );


    }

  }


  throw new Error(
    "No se pudo obtener la galería de Sorare"
  );

}







export async function getUserCards(
  slug:string
) {


  console.log(
    "🔥 OBTENIENDO GALERÍA PRO:",
    slug
  );



  let allCards:any[] = [];

  let after:string | null = null;

  let previousCursor:string | null = null;

  let page = 1;

  let hasNextPage = true;






  while(hasNextPage) {



    console.log(
      `🔥 OBTENIENDO PÁGINA ${page}`
    );



    const data = await requestWithRetry(
      slug,
      after
    );



    if(data.errors) {


      console.error(
        data.errors
      );


      throw new Error(
        data.errors[0].message
      );


    }




    if(!data.data?.user) {

      throw new Error(
        `Usuario Sorare no encontrado: ${slug}`
      );

    }





    const cards =
      data.data.user.cards.nodes;



    console.log(
      `🔥 CARTAS PÁGINA ${page}:`,
      cards.length
    );



    allCards.push(
      ...cards
    );





    hasNextPage =
      data.data.user.cards.pageInfo.hasNextPage;



    after =
      data.data.user.cards.pageInfo.endCursor;





    if(after === previousCursor) {


      console.log(
        "⚠️ Cursor repetido, deteniendo sincronización"
      );


      break;


    }




    previousCursor = after;



    page++;




    if(hasNextPage) {

      await sleep(500);

    }



  }







  console.log(
    "🔥 TOTAL CARTAS GALERÍA:",
    allCards.length
  );







  return allCards.map(
    (card:any)=>{


      return {



        assetId:
          card.assetId,



        slug:
          card.slug,



        season:
          card.seasonYear,



        rarity:
          card.displayRarity?.toLowerCase()
          ??
          "limited",




        marketValue:
          card.publicMinPrices?.eurCents != null
            ? card.publicMinPrices.eurCents / 100
            : null,





        player:{



          displayName:
            card.anyPlayer?.displayName
            ??
            "Desconocido",



          slug:
            card.anyPlayer?.slug
            ??
            null,



          position:
            card.anyPlayer?.cardPositions?.[0]
            ??
            null,



          l5Score:
            null,



          l10Score:
            null,



          l15Score:
            null,



          l40Score:
            null,



          club:
            card.anyTeam?.name
            ??
            null,



          pictureUrl:
            card.pictureUrl
            ??
            null,


        },



        pictureUrl:
          card.pictureUrl
          ??
          null,


      };


    }
  );


}