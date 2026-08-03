import { sorareRequest } from "../sorare";


const GET_USER_CARDS = `
query GetUserCards($slug: String!, $after: String) {
  user(slug: $slug) {
    cards(
      first: 25,
      after: $after,
      rarities: [limited, rare, super_rare, unique]
    ) {
      nodes {
        assetId
        slug
        pictureUrl
        displayRarity
        seasonYear

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
    "Error obteniendo cartas Sorare"
  );

}






export async function getUserCards(
  slug:string
) {


  console.log(
    "🔥 OBTENIENDO GALERÍA:",
    slug
  );



  let allCards:any[] = [];

  let after:string | null = null;

  let previousCursor:string | null = null;

  let page = 1;

  let hasNextPage = true;





  while(hasNextPage) {


    console.log(
      `🔥 Página ${page}`
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



    const cards =
      data.data.user.cards.nodes;



    allCards.push(
      ...cards
    );



    hasNextPage =
      data.data.user.cards.pageInfo.hasNextPage;



    after =
      data.data.user.cards.pageInfo.endCursor;




    if(after === previousCursor) {

      console.log(
        "⚠️ Cursor repetido"
      );

      break;

    }



    previousCursor = after;



    page++;



    if(hasNextPage) {

      await sleep(300);

    }


  }





  console.log(
    "🔥 TOTAL CARTAS:",
    allCards.length
  );





  return allCards.map(
    (card:any)=>({


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
        null,



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


    })
  );


}