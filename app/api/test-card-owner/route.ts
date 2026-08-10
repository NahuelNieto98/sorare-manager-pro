import { NextResponse } from "next/server";
import { sorareRequest } from "@/lib/sorare";


export async function GET() {


  try {


    const assetId =
      "0x0400f2f911965148ce8c2e7d7add45dd48a34cd9db628a48b67ef06b0ad41061";



    const query = `

    query GetCardOwner($assetId:String!) {


      anyCards(
        assetIds:[$assetId]
      ) {


        assetId

        slug

        displayRarity

        seasonYear


        tokenOwner {

          id

          transferType

          amounts {

            eurCents

          }

        }


        anyPlayer {

          displayName

          slug

        }


        anyTeam {

          name

        }


      }


    }

    `;



    const result =
      await sorareRequest(
        query,
        {
          assetId,
        }
      );



    console.log(
      "CARD OWNER DEBUG:",
      JSON.stringify(
        result,
        null,
        2
      )
    );



    return NextResponse.json(result);



  } catch(error:any) {


    console.error(
      "ERROR CARD OWNER:",
      error
    );


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );


  }


}