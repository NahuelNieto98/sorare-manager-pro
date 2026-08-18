import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { syncSorareTransactions } from "@/lib/transactions/syncSorareTransactions";


export async function POST() {

  const session =
    await auth();


  if (!session?.user?.email) {

    return NextResponse.json(
      {
        error: "No autorizado",
      },
      {
        status: 401,
      }
    );

  }


  const user =
    await prisma.user.findUnique({

      where: {
        email: session.user.email,
      },

    });


  if (!user) {

    return NextResponse.json(
      {
        error: "Usuario no encontrado",
      },
      {
        status: 404,
      }
    );

  }


  const result =
    await syncSorareTransactions(
      user.id
    );


  return NextResponse.json({

    success: true,

    ...result,

  });

}
