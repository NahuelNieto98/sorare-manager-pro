import { NextResponse } from "next/server";
import { sorareRequest } from "@/lib/sorare";


const QUERY = `

query TestCard {

  anyCards(
    assetIds:[
      "0x0400c445e1125dd8425eaabb44ba29f562dee593749eb58cc3b5d8be485b37be"
    ]
  ){

    assetId

    slug

    seasonYear

    displayRarity


    anyPlayer {

      displayName

    }


    token {

      id

    }

  }

}

`;




export async function GET(){


  const data =
    await sorareRequest(
      QUERY,
      {}
    );



  return NextResponse.json(data);


}