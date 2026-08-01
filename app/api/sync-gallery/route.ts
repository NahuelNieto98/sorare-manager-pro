import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveCards } from "@/lib/syncCards";

export async function POST() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  // De momento guardamos una carta de prueba.
  // Después sustituiremos esto por la API oficial de Sorare.
  await saveCards(user.id, [
    {
      id: "1",
      slug: "test-card",
      assetId: "1",
      playerName: "Kylian Mbappé",
      club: "Real Madrid",
      position: "Forward",
      pictureUrl: null,
      season: 2026,
      scarcity: "limited",
      averageScore: 73,
      marketValue: 185,
    },
  ]);

  return NextResponse.json({
    success: true,
  });
}
