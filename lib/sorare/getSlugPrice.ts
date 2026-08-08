import { sorareRequest } from "../sorare";


const GET_CARD_DATA = `
query GetCard($assetIds:[String!]) {

  anyCards(
    assetIds:$assetIds
  ) {

    assetId

    slug

    anyPlayer {
      displayName
    }

    cardPrice

  }

}
`;


export async function getSlugPrice(
  assetId:string
) {


  const data =
    await sorareRequest(
      GET_CARD_DATA,
      {
        assetIds:[
          assetId
        ],
      }
    );


  console.log(
    "CARD PRICE:",
    JSON.stringify(
      data,
      null,
      2
    )
  );


  return data;

}