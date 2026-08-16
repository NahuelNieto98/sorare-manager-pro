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
      cards: {
        where: {
          sealed: false,
        },
        orderBy: {
          playerName: "asc",
        },
        include: {
          MarketTransaction: {
            where: {
              type: {
                in: ["BUY", "PURCHASE", "AUCTION"],
              },
            },
            orderBy: {
              date: "asc",
            },
          },
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

  const cards = user.cards.map((card) => {
    const purchase =
      card.MarketTransaction[0] ?? null;

    return {
      ...card,

      purchasePrice:
        purchase?.price ?? null,

      purchaseDate:
        purchase?.date ?? null,
    };
  });

  return NextResponse.json(cards);
}