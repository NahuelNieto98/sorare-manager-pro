import { sorareRequest } from "../sorare";


const GET_ASSET_MARKET = `
query GetAssetMarket($assetIds: [String!]) {

  anyCards(
    assetIds: $assetIds
  ) {

    assetId
    slug

    sellOffers(
      first: 5
    ) {

      nodes {

        price

        createdAt

      }

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
        GET_ASSET_MARKET,
        {
          assetIds:[
            assetId
          ],
        }
      );


    console.log(
      "💰 MARKET:",
      JSON.stringify(
        data,
        null,
        2
      )
    );


    return data;


  } catch(error) {

    console.error(
      "❌ ERROR MARKET:",
      error
    );

    return null;

  }

}