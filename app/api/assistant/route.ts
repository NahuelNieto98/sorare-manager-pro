import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        analysis: "No autorizado",
      },
      {
        status: 401,
      },
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
    return NextResponse.json({
      analysis: "Usuario no encontrado.",
    });
  }

  const totalCards = user.cards.length;

  const galleryValue = user.cards.reduce(
    (sum, card) => sum + (card.marketValue ?? 0),
    0,
  );

  const averageScore =
    totalCards === 0
      ? 0
      : user.cards.reduce((sum, card) => sum + (card.averageScore ?? 0), 0) /
        totalCards;

  const bought = user.transactions
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.price, 0);

  const sold = user.transactions
    .filter((t) => t.type === "SELL")
    .reduce((sum, t) => sum + t.price, 0);

  const profit = galleryValue + sold - bought;

  const roi = bought === 0 ? 0 : (profit / bought) * 100;

  const topCards = [...user.cards]
    .sort((a, b) => (b.marketValue ?? 0) - (a.marketValue ?? 0))
    .slice(0, 5);

  let analysis = "";

  analysis += "🤖 SCOUT IA - ANÁLISIS\n\n";

  analysis += `📦 Cartas: ${totalCards}\n`;
  analysis += `💰 Valor galería: €${galleryValue.toFixed(2)}\n`;
  analysis += `⭐ AA Media: ${averageScore.toFixed(1)}\n`;
  analysis += `📈 ROI: ${roi.toFixed(2)}%\n`;
  analysis += `💵 Beneficio: €${profit.toFixed(2)}\n\n`;

  analysis += "🏆 Top cartas:\n\n";

  topCards.forEach((card, index) => {
    analysis += `${index + 1}. ${card.playerName} (€${(
      card.marketValue ?? 0
    ).toFixed(2)})\n`;
  });

  analysis += "\n";

  if (averageScore >= 65) {
    analysis += "✅ Tu galería tiene un nivel competitivo.\n";
  } else {
    analysis +=
      "⚠️ Tu AA medio es bajo. Deberías reforzar tus mejores cartas.\n";
  }

  if (roi < 0) {
    analysis += "📉 Actualmente tu ROI es negativo.\n";
  } else {
    analysis += "📈 Tu inversión está siendo rentable.\n";
  }

  analysis +=
    "\n🚀 Próximamente el Scout IA dará recomendaciones automáticas de compra y venta.";

  return NextResponse.json({
    analysis,
  });
}
