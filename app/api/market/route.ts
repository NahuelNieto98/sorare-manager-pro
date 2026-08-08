import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";


export async function GET() {

  try {

    const session = await auth();


    if (!session?.user?.email) {

      return NextResponse.json(
        {
          error:"No autenticado"
        },
        {
          status:401
        }
      );

    }


    const transactions =
      await prisma.marketTransaction.findMany({

        include:{
          Card:true
        },

        orderBy:{
          createdAt:"desc"
        }

      });



    return NextResponse.json(transactions);



  } catch(error:any) {


    console.error(error);


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
