import { sorareRequest } from "../sorare";


const QUERY = `
query TestCardData($slug:String!) {

  user(slug:$slug) {

    cards(
      first:1
    ) {

      nodes {

        assetId
        slug
        displayRarity
        seasonYear

        anyPlayer {
          displayName
        }

        publicMinPrices {
          eurCents
        }

      }

    }

  }

}
`;



export async function testCardData(
  slug:string
) {

  const data = await sorareRequest(
    QUERY,
    {
      slug,
    }
  );


  console.log(
    "DATOS CARTA:",
    JSON.stringify(data,null,2)
  );


  return data;

}