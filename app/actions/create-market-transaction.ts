"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createMarketTransaction(
  cardId: string,
  price: number
) {

  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }


  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });


  if (!user) {
    throw new Error("Usuario no encontrado");
  }


  const card = await prisma.card.findUnique({
    where: {
      id: cardId,
    },
  });


  if (!card) {
    throw new Error("Carta no encontrada");
  }



  // Buscar si ya existe una compra para esta carta
  const existingTransaction =
    await prisma.marketTransaction.findFirst({
      where: {
        cardId: card.id,
        type: "BUY",
      },
    });



  // Si existe actualizamos
  if (existingTransaction) {


    const updated =
      await prisma.marketTransaction.update({

        where:{
          id: existingTransaction.id,
        },

        data:{
          price,
          date:new Date(),
        },

      });


    return updated;

  }




  // Si no existe creamos
  const transaction =
    await prisma.marketTransaction.create({

      data:{

        playerName: card.playerName,

        rarity: card.scarcity,

        price,

        type:"BUY",

        cardId:card.id,

        userId:user.id,

        date:new Date(),

      },

    });



  return transaction;

}