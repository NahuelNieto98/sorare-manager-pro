import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sorareRequest } from "@/lib/sorare";


export async function GET() {


  try {


    const session = await auth();


    if(!session?.user?.email){

      return NextResponse.json({
        error:"No auth"
      });

    }



    const user =
      await prisma.user.findUnique({

        where:{
          email:session.user.email
        },

        include:{
          sorareAccount:true
        }

      });



    if(!user?.sorareAccount?.accessToken){

      return NextResponse.json({
        error:"No token"
      });

    }



    const query = `

    query {


      currentUser {


        cards {


          nodes {


            ... on AnyCardInterface {


              assetId

              slug

              name


              tokenOwner {


                transferType


                amounts {


                  eurCents


                }


              }


            }


          }


        }


      }


    }

    `;



    const result =
      await sorareRequest(
        query,
        {},
        user.sorareAccount.accessToken
      );



    return NextResponse.json(result);



  } catch(error:any){


    return NextResponse.json({

      error:error.message

    },{
      status:500
    });


  }


}