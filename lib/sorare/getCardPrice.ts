import { sorareRequest } from "../sorare";


const GET_CARD_PRICE = `
query GetCardPrice($slug:String!) {

  anyCards(
    slugs:[$slug]
  ) {

    assetId

    slug

    displayRarity

    seasonYear


    publicMinPrices {
      eurCents
    }


    anyPlayer {
      displayName
    }

  }

}
`;



export async function getCardPrice(
  slug:string
) {


  try {


    const data =
      await sorareRequest(
        GET_CARD_PRICE,
        {
          slug,
        }
      );



    console.log(
      "💰 RESPUESTA PRECIO CARTA:",
      JSON.stringify(
        data,
        null,
        2
      )
    );



    return data;



  } catch(error) {


    console.error(
      "❌ ERROR PRECIO CARTA:",
      error
    );


    return null;


  }


}