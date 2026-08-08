import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
      transactions: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  const cards = user.cards;

  const undervalued = cards
    .filter(
      (card) =>
        (card.averageScore ?? 0) >= 65 &&
        (card.marketValue ?? 0) <= 20
    )
    .slice(0, 5);

  const overvalued = cards
    .filter(
      (card) =>
        (card.averageScore ?? 0) <= 40 &&
        (card.marketValue ?? 0) >= 40
    )
    .slice(0, 5);

  const bestCard =
    [...cards].sort(
      (a, b) =>
        (b.marketValue ?? 0) -
        (a.marketValue ?? 0)
    )[0] ?? null;

  const averageAA =
    cards.length === 0
      ? 0
      : cards.reduce(
          (sum, c) =>
            sum + (c.averageScore ?? 0),
          0
        ) / cards.length;

  const totalValue =
    cards.reduce(
      (sum, c) =>
        sum + (c.marketValue ?? 0),
      0
    );

  return NextResponse.json({
    summary: {
      cards: cards.length,
      averageAA,
      totalValue,
    },

    bestCard,

    undervalued,

    overvalued,

    recommendations: [
      {
        type: "buy",
        title: "Oportunidades",
        count: undervalued.length,
      },
      {
        type: "sell",
        title: "Ventas recomendadas",
        count: overvalued.length,
      },
    ],
  });
}