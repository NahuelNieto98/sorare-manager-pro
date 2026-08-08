import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";


export async function GET() {

  const session = await auth();


  if (!session?.user?.email) {

    return NextResponse.json(
      {
        connected:false,
      },
      {
        status:200,
      }
    );

  }



  const user = await prisma.user.findUnique({

    where:{
      email:session.user.email,
    },

    include:{
      sorareAccount:true,
    },

  });



  return NextResponse.json({

    connected:!!user?.sorareAccount,

    slug:user?.sorareAccount?.slug ?? null,

  });


}