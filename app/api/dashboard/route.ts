import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateGalleryValue,
  calculateAverage,
  countScarcity,
} from "@/lib/gallery";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      cards: true,
      transactions: {
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  const galleryValue = calculateGalleryValue(user.cards);

  const average = calculateAverage(user.cards);

  const scarcity = countScarcity(user.cards);

  const totalBought = user.transactions
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.price, 0);

  const totalSold = user.transactions
    .filter((t) => t.type === "SELL")
    .reduce((sum, t) => sum + t.price, 0);

  const profit = galleryValue + totalSold - totalBought;

  const roi = totalBought === 0 ? 0 : (profit / totalBought) * 100;

  const topCards = [...user.cards]
    .sort((a, b) => (b.marketValue ?? 0) - (a.marketValue ?? 0))
    .slice(0, 5)
    .map((card) => ({
      playerName: card.playerName,
      marketValue: card.marketValue,
    }));

  const recentTransactions = user.transactions
    .slice(0, 5)
    .map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      playerName: transaction.playerName,
      rarity: transaction.rarity,
      price: transaction.price,
    }));

  return NextResponse.json({
    galleryValue,
    average,
    totalCards: user.cards.length,

    scarcity,

    totalBought,
    totalSold,
    profit,
    roi,

    topCards,

    recentTransactions,
  });
}
