import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { saveCards } from "@/lib/syncCards";
import { fetchUserCards } from "@/lib/fetchUserCards";

import { calculateGalleryValue } from "@/lib/gallery";
import { saveSnapshot } from "@/lib/saveSnapshot";

export async function POST() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      sorareAccount: true,
      transactions: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  if (!user.sorareAccount) {
    return NextResponse.json(
      { error: "Cuenta Sorare no conectada" },
      { status: 400 },
    );
  }

  const cards = await fetchUserCards(user.sorareAccount.slug);

  await saveCards(user.id, cards);

  const gallery = await prisma.card.findMany({
    where: {
      ownerId: user.id,
    },
  });

  const galleryValue = calculateGalleryValue(gallery);

  const bought = user.transactions
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.price, 0);

  const sold = user.transactions
    .filter((t) => t.type === "SELL")
    .reduce((sum, t) => sum + t.price, 0);

  const profit = galleryValue + sold - bought;

  const roi = bought === 0 ? 0 : (profit / bought) * 100;

  await saveSnapshot({
    userId: user.id,
    galleryValue,
    roi,
    profit,
  });

  return NextResponse.json({
    success: true,
    imported: cards.length,
  });
}
