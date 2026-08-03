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

        publicMinPrices {
          eurCents
        }

        anyPlayer {
          displayName
          slug
          cardPositions

          l5Score: averageScore(
            teamMode: ALL,
            type: LAST_FIVE_SO5_AVERAGE_SCORE
          )

          l10Score: averageScore(
            teamMode: ALL,
            type: LAST_TEN_PLAYED_SO5_AVERAGE_SCORE
          )

          l15Score: averageScore(
            teamMode: ALL,
            type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
          )

          l40Score: averageScore(
            teamMode: ALL,
            type: LAST_FORTY_SO5_AVERAGE_SCORE
          )
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

  try {

    return await sorareRequest(
      GET_USER_CARDS,
      {
        slug,
        after,
      }
    );


  } catch(error:any) {


    if(
      error.message.includes("429")
    ) {

      console.log(
        "⏳ Sorare rate limit. Esperando 5 segundos..."
      );


      await sleep(5000);


      return await sorareRequest(
        GET_USER_CARDS,
        {
          slug,
          after,
        }
      );

    }


    throw error;

  }

}





export async function getUserCards(
  slug:string
) {


  console.log(
    "🔥 OBTENIENDO GALERÍA PRO"
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



    const cards =
      data.data.user.cards.nodes;



    console.log(
      `🔥 CARTAS PRO PÁGINA ${page}:`,
      cards.length
    );



    console.log(
      "💰 EJEMPLO PRECIO SORARE:",
      cards[0]?.anyPlayer?.displayName,
      cards[0]?.publicMinPrices
    );



    allCards.push(
      ...cards
    );



    hasNextPage =
      data.data.user.cards.pageInfo.hasNextPage;



    after =
      data.data.user.cards.pageInfo.endCursor;



    if(
      after === previousCursor
    ) {

      console.log(
        "⚠️ Cursor repetido, deteniendo sincronización"
      );

      break;

    }



    previousCursor = after;


    page++;



    if(hasNextPage) {

      await sleep(700);

    }


  }





  console.log(
    "🔥 TOTAL GALERÍA PRO:",
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
          card.publicMinPrices?.eurCents
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
            card.anyPlayer?.l5Score
            ??
            null,



          l10Score:
            card.anyPlayer?.l10Score
            ??
            null,



          l15Score:
            card.anyPlayer?.l15Score
            ??
            null,



          l40Score:
            card.anyPlayer?.l40Score
            ??
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