import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserTransactions } from "@/lib/transactions/getUserTransactions";


export async function POST(req: NextRequest) {


  const session = await auth();


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



  const body = await req.json();



  /*
    Buscamos la carta relacionada
    para guardar cardId
  */

  const card =
    await prisma.card.findFirst({

      where: {

        ownerId: user.id,

        playerName: {
          contains: body.playerName,
          mode: "insensitive",
        },


        ...(body.rarity && {
          scarcity: body.rarity,
        }),

      },

    });



  const transaction =
    await prisma.transaction.create({

      data: {

        type: body.type,

        playerName: body.playerName,

        rarity: body.rarity,

        price: Number(body.price),

        date: new Date(),

        userId: user.id,


        cardId: card?.id ?? null,

      },

    });



  return NextResponse.json(transaction);

}





export async function GET() {

  const session = await auth();

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

  const transactions =
    await getUserTransactions(user.id);

  return NextResponse.json(
    transactions
  );
}
