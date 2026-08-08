import { sorareRequest } from "../sorare";


const GET_ASSET_LAST_SALE = `
query GetAssetLastSale($assetId:String!) {

  anyCards(
    assetIds:[
      $assetId
    ]
  ) {

    assetId

    lastSale {

      price {

        eurCents

      }

    }

  }

}
`;




export async function getAssetLastSalePrice(
  assetId:string
) {


  try {


    console.log(
      "🔎 BUSCANDO ÚLTIMA VENTA:",
      assetId
    );



    const data =
      await sorareRequest(
        GET_ASSET_LAST_SALE,
        {
          assetId,
        }
      );




    const card =
      data.data?.anyCards?.[0];



    const cents =
      card?.lastSale?.price?.eurCents;



    if(!cents){

      console.log(
        "❌ SIN ÚLTIMA VENTA:",
        assetId
      );

      return null;

    }




    const value =
      Number(
        (cents / 100)
        .toFixed(2)
      );



    console.log(
      "✅ ÚLTIMA VENTA ENCONTRADA:",
      value
    );



    return value;



  } catch(error) {


    console.error(
      "❌ ERROR LAST SALE:",
      error
    );


    return null;

  }

}