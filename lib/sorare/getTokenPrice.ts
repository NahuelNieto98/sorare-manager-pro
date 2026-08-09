import { sorareRequest } from "../sorare";


const GET_TOKEN_PRICES = `

query GetTokenPrices(
  $playerSlug: String!,
  $rarity: Rarity!,
  $season: Int!
) {

  tokens {

    tokenPrices(
      first: 10,
      playerSlug: $playerSlug,
      rarity: $rarity,
      season: $season
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
  rarity:string,
  season:number,
) {


  try {


    console.log(
      "🔥 BUSCANDO PRECIO:",
      playerSlug,
      rarity,
      "TEMPORADA:",
      season
    );





    const data =
      await sorareRequest(

        GET_TOKEN_PRICES,

        {
          playerSlug,
          rarity,
          season,
        }

      );






    console.log(
      "💰 RESPUESTA TOKEN PRICE:",
      JSON.stringify(
        data,
        null,
        2
      )
    );







    if(data.errors){


      console.error(
        data.errors
      );


      return null;

    }







    const prices =
      data.data?.tokens?.tokenPrices;







    if(
      !prices ||
      prices.length === 0
    ){


      console.log(
        "❌ SIN PRECIO:",
        playerSlug,
        rarity,
        season
      );


      return null;

    }







    const latestPrice =
      prices
        .filter(
          (p:any)=>
            p.amounts?.eurCents
        )
        .sort(
          (a:any,b:any)=>

            new Date(b.date).getTime()
            -
            new Date(a.date).getTime()

        )[0];







    if(!latestPrice){

      return null;

    }








    const value =
      Number(

        (
          latestPrice.amounts.eurCents / 100
        )
        .toFixed(2)

      );







    console.log(
      "✅ ÚLTIMO PRECIO ENCONTRADO:",
      value,
      "TEMPORADA:",
      season
    );







    return value;





  } catch(error:any){



    console.error(
      "❌ ERROR TOKEN PRICE:",
      error
    );



    // IMPORTANTE:
    // No devolvemos null aquí.
    // Dejamos subir 403/429 para que update-prices
    // pueda parar el proceso correctamente.

    throw error;


  }


}