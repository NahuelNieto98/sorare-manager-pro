import { prisma } from "@/lib/prisma";
import { getSeason } from "@/lib/transactions/seasons";

export async function savePortfolioSnapshot(
  userId: string,
  galleryValue: number,
) {
  const now = new Date();

  const season = getCurrentSeason(now);

  if (!season) {
    return;
  }

  /*
   * El primer snapshot de la temporada es el
   * punto de partida y nunca se modifica.
   */
  const startingSnapshot =
    await prisma.portfolioSnapshot.findFirst({
      where: {
        userId,
        seasonId: season.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  /*
   * Si no existe punto de partida, creamos el snapshot inicial.
   */
  if (!startingSnapshot) {
    await prisma.portfolioSnapshot.create({
      data: {
        userId,
        seasonId: season.id,
        galleryValue,
        roi: 0,
        profit: 0,
      },
    });

    console.log(
      "📸 SNAPSHOT INICIAL CREADO:",
      season.id,
      galleryValue
    );

    return;
  }

  /*
   * Todas las operaciones posteriores al inicio
   * del seguimiento y pertenecientes a la temporada.
   */
  const transactions =
    await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gt: startingSnapshot.createdAt,
          gte: new Date(season.start),
          lt: new Date(season.end),
        },
      },
    });

  const totalBought =
    transactions
      .filter(
        (transaction) =>
          transaction.type === "BUY"
      )
      .reduce(
        (sum, transaction) =>
          sum + (transaction.price ?? 0),
        0
      );

  const totalSold =
    transactions
      .filter(
        (transaction) =>
          transaction.type === "SELL"
      )
      .reduce(
        (sum, transaction) =>
          sum + (transaction.price ?? 0),
        0
      );

  /*
   * Beneficio desde el comienzo del seguimiento.
   */
  const profit =
    galleryValue -
    startingSnapshot.galleryValue -
    totalBought +
    totalSold;

  /*
   * Capital inicial + compras posteriores.
   */
  const capitalReference =
    startingSnapshot.galleryValue +
    totalBought;

  const roi =
    capitalReference === 0
      ? 0
      : (
          profit /
          capitalReference
        ) * 100;

  /*
   * Cada actualización de precios genera
   * un nuevo punto histórico.
   */
  await prisma.portfolioSnapshot.create({
    data: {
      userId,
      seasonId: season.id,
      galleryValue,
      roi,
      profit,
    },
  });

  console.log(
    "📈 SNAPSHOT HISTÓRICO CREADO:",
    season.id,
    "| GALERÍA:",
    galleryValue,
    "| ROI:",
    roi,
    "| PROFIT:",
    profit
  );
}

function getCurrentSeason(date: Date) {
  const timestamp =
    date.getTime();

  return (
    [
      "2026-27",
      "2025-26",
      "2024-25",
      "2023-24",
    ]
      .map((id) =>
        getSeason(id)
      )
      .find((season) => {
        if (!season) {
          return false;
        }

        return (
          timestamp >=
            new Date(
              season.start
            ).getTime() &&
          timestamp <
            new Date(
              season.end
            ).getTime()
        );
      }) ?? null
  );
}
