import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { getUserCards } from "@/lib/sorare/getUserCards";
import { importGallery } from "@/lib/sorare/importGallery";

import { calculateGalleryValue } from "@/lib/gallery";
import { savePortfolioSnapshot } from "@/lib/portfolio";

export async function POST() {
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
      transactions: true,
      sorareAccount: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  if (!user.sorareAccount) {
    return NextResponse.json(
      { error: "No hay una cuenta de Sorare conectada." },
      { status: 400 }
    );
  }

  const slug = user.sorareAccount.slug;

  console.log("Sincronizando usuario:", slug);

  const cards = await getUserCards(slug);

  await importGallery(user.id, cards);

  const dbCards = await prisma.card.findMany({
    where: {
      ownerId: user.id,
    },
  });

  const galleryValue = calculateGalleryValue(dbCards);

  const totalBought = user.transactions
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.price, 0);

  const totalSold = user.transactions
    .filter((t) => t.type === "SELL")
    .reduce((sum, t) => sum + t.price, 0);

  const profit = galleryValue + totalSold - totalBought;

  const roi =
    totalBought === 0 ? 0 : (profit / totalBought) * 100;

  await savePortfolioSnapshot(
    user.id,
    galleryValue,
    roi,
    profit
  );

  return NextResponse.json({
    success: true,
    importedCards: dbCards.length,
    slug,
    galleryValue,
    roi,
    profit,
  });
}