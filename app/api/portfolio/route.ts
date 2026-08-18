import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateGalleryValue,
  calculateAverage,
  countScarcity,
} from "@/lib/gallery";
import { getUserPurchases } from "@/lib/sorare/getUserPurchases";
import { mapPurchaseToTransaction } from "@/lib/sorare/mapPurchaseToTransaction";
import { getUserSales } from "@/lib/sorare/getUserSales";
import { mapSaleToTransaction } from "@/lib/sorare/mapSaleToTransaction";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
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
      { status: 404 }
    );
  }

  let purchases: any[] = [];
  let sales: any[] = [];

  try {
    purchases = await getUserPurchases(user.id);
  } catch (error) {
    console.error(
      "Error obteniendo compras de Sorare para portfolio:",
      error
    );
  }

  try {
    sales = await getUserSales(user.id);
  } catch (error) {
    console.error(
      "Error obteniendo ventas de Sorare para portfolio:",
      error
    );
  }

  const sorarePurchaseTransactions =
    purchases.map(mapPurchaseToTransaction);

  const sorareSaleTransactions =
    sales.map(mapSaleToTransaction);

  const combinedTransactions = [
    ...user.transactions,
    ...sorarePurchaseTransactions,
    ...sorareSaleTransactions,
  ];

  const galleryValue =
    calculateGalleryValue(user.cards);

  const average =
    calculateAverage(user.cards);

  const scarcity =
    countScarcity(user.cards);

  const totalBought =
    combinedTransactions
      .filter((t) => t.type === "BUY")
      .reduce((sum, t) => sum + (t.price ?? 0), 0);

  const totalSold =
    combinedTransactions
      .filter((t) => t.type === "SELL")
      .reduce((sum, t) => sum + (t.price ?? 0), 0);

  const profit =
    galleryValue +
    totalSold -
    totalBought;

  const roi =
    totalBought === 0
      ? 0
      : (profit / totalBought) * 100;

  const recoveredCapital =
    totalBought === 0
      ? 0
      : (totalSold / totalBought) * 100;

  const portfolioHealth =
    roi >= 25
      ? "excellent"
      : roi >= 10
      ? "good"
      : roi >= 0
      ? "stable"
      : "danger";

  const investmentStatus =
    galleryValue + totalSold >= totalBought
      ? "growing"
      : "recovering";

  const topCards = [...user.cards]
    .sort(
      (a, b) =>
        (b.marketValue ?? 0) -
        (a.marketValue ?? 0)
    )
    .slice(0, 10)
    .map((card) => ({
      id: card.id,
      playerName: card.playerName,
      club: card.club,
      rarity: card.scarcity,
      marketValue: card.marketValue,
      averageScore: card.averageScore,
      pictureUrl: card.pictureUrl,
    }));

  const recentTransactions =
    combinedTransactions
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, 10)
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


totalBought,

totalSold,


profit,

roi,


recoveredCapital,

portfolioHealth,

investmentStatus,


scarcity,


topCards,


recentTransactions,

});
}