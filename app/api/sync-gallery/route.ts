import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { getCurrentUser } from "@/lib/sorare/getCurrentUser";
import { getUserCards } from "@/lib/sorare/getUserCards";
import { importGallery } from "@/lib/sorare/importGallery";

import { calculateGalleryValue } from "@/lib/gallery";
import { savePortfolioSnapshot } from "@/lib/portfolio";

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
      transactions: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  const currentUser = await getCurrentUser();

  await prisma.sorareAccount.upsert({
    where: {
      userId: user.id,
    },
    update: {
      slug: currentUser.slug,
    },
    create: {
      userId: user.id,
      slug: currentUser.slug,
    },
  });

  const cards = await getUserCards(currentUser.slug);

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

  const profit = totalSold - totalBought;

  const roi = totalBought === 0 ? 0 : (profit / totalBought) * 100;

  await savePortfolioSnapshot(user.id, galleryValue, roi, profit);

  return NextResponse.json({
    success: true,
    cards: dbCards.length,
  });
}
