import { sorareRequest } from "../sorare";


const GET_TOKEN_PRICES = `
query GetTokenPrices(
  $playerSlug: String!,
  $rarity: Rarity!
) {

  tokens {

    tokenPrices(
      first: 5,
      playerSlug: $playerSlug,
      rarity: $rarity
    ) {

      amounts {
        eurCents
      }

      date

    }

  }

}
`;



export async function getLastTokenPrice(
  playerSlug:string,
  rarity:string
) {


  try {


    const data = await sorareRequest(
      GET_TOKEN_PRICES,
      {
        playerSlug,
        rarity,
      }
    );



    if(data.errors) {

      console.error(
        data.errors
      );

      return null;

    }



    const prices =
      data.data.tokens.tokenPrices;



    if(
      !prices ||
      prices.length === 0
    ) {

      return null;

    }



    const latest =
      prices.sort(
        (a:any,b:any)=>
          new Date(b.date).getTime()
          -
          new Date(a.date).getTime()
      )[0];



    return latest.amounts?.eurCents
      ? latest.amounts.eurCents / 100
      : null;



  } catch(error) {


    console.error(
      "❌ Error obteniendo precio histórico:",
      error
    );


    return null;

  }

}