import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {


  try {


    const transactions =
      await prisma.marketTransaction.findMany({

        include: {
          Card: true,
        },

        orderBy: {
          createdAt: "desc",
        },

      });



    return NextResponse.json(transactions);



  } catch (error) {


    console.error(error);


    return NextResponse.json(
      {
        error: "Error loading market transactions",
      },
      {
        status: 500,
      }
    );


  }


}