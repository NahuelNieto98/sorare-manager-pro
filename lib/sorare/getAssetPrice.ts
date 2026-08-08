import { sorareRequest } from "../sorare";


const GET_ASSET_PRICE = `
query GetAssetPrice($assetIds:[String!]) {

  anyCards(
    assetIds:$assetIds
  ) {

    assetId

    slug

    seasonYear

    displayRarity


    anyPlayer {

      displayName

    }


    recentSales {

      price {

        eurCents

      }

      createdAt

    }


  }

}
`;



export async function getAssetPrice(
  assetId:string
) {


  try {


    const data =
      await sorareRequest(
        GET_ASSET_PRICE,
        {
          assetIds:[
            assetId
          ],
        }
      );



    console.log(
      "RESPUESTA RECENT SALES:",
      JSON.stringify(
        data,
        null,
        2
      )
    );



    return data;



  } catch(error) {


    console.error(
      "❌ ERROR RECENT SALES:",
      error
    );


    return null;

  }


}