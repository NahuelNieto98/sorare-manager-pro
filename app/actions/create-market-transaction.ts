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
    include: {
      MarketTransaction: true,
    },
  });


  if (!card) {
    throw new Error("Carta no encontrada");
  }


  // Evitar duplicar compras de la misma carta
  const existingPurchase =
    card.MarketTransaction.find(
      (tx) =>
        tx.type === "BUY"
    );


  if (existingPurchase) {
    throw new Error(
      "Esta carta ya tiene una compra registrada"
    );
  }


  const transaction =
    await prisma.marketTransaction.create({

      data: {

        playerName: card.playerName,

        rarity: card.scarcity,

        price: Number(price),

        type: "BUY",

        cardId: card.id,

        userId: user.id,

        date: new Date(),

      },

    });


  return transaction;
}