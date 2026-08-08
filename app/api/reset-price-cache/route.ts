import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(){

  await prisma.card.updateMany({

    data:{
      priceUpdatedAt:null,
    },

  });


  return NextResponse.json({
    success:true,
  });

}