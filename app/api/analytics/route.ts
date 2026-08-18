import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import {
  calculateGalleryValue,
  countScarcity,
} from "@/lib/gallery";

import {
  getUserTransactions,
} from "@/lib/transactions/getUserTransactions";

import {
  isDateInSeason,
} from "@/lib/transactions/seasons";

import {
  getSeasonSnapshot,
} from "@/lib/transactions/seasonSnapshot";

import {
  getSeasonPerformance,
} from "@/lib/transactions/seasonPerformance";


export async function GET(
  req: NextRequest
) {
  const session =
    await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        error: "No autorizado",
      },
      {
        status: 401,
      }
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        cards: true,
      },
    });

  if (!user) {
    return NextResponse.json(
      {
        error: "Usuario no encontrado",
      },
      {
        status: 404,
      }
    );
  }

  const searchParams =
    req.nextUrl.searchParams;

  const season =
    searchParams.get("season") ?? "all";

  /*
   * ============================================================
   * TRANSACCIONES
   * ============================================================
   *
   * Analytics utiliza el historial REAL de inversión.
   *
   * No filtramos las compras/ventas por temporada porque las
   * cartas compradas en temporadas anteriores siguen formando
   * parte de la cartera actual.
   */
  const allTransactions =
    await getUserTransactions(
      user.id
    );

  const combinedTransactions =
    season === "all"
      ? allTransactions
      : allTransactions.filter(
          (transaction) =>
            isDateInSeason(
              transaction.date,
              season
            )
        );


  /*
   * ============================================================
   * VALOR ACTUAL DE LA GALERÍA
   * ============================================================
   */

  const galleryValue =
    calculateGalleryValue(
      season === "all"
        ? user.cards
        : user.cards.filter(
            (card) =>
              card.season ===
              Number(
                season.split("-")[0]
              )
          )
    );


  /*
   * ============================================================
   * SNAPSHOT DE INICIO
   * ============================================================
   */

  const seasonSnapshot =
    season === "all"
      ? null
      : await getSeasonSnapshot(
          user.id,
          season
        );

  const trackingStartedAt =
    seasonSnapshot?.createdAt
      ?? null;

  const startingGalleryValue =
    seasonSnapshot?.galleryValue
      ?? null;


  /*
   * ============================================================
   * CARTAS PARA SCARCITY
   * ============================================================
   */

  const analyticsCards =
    season === "all"
      ? user.cards
      : user.cards.filter(
          (card) =>
            card.season ===
            Number(
              season.split("-")[0]
            )
        );

  const scarcity =
    countScarcity(
      analyticsCards
    );


  /*
   * ============================================================
   * COMPRAS Y VENTAS REALES
   * ============================================================
   */

  const totalBought =
    combinedTransactions
      .filter(
        (transaction) =>
          transaction.type === "BUY"
      )
      .reduce(
        (sum, transaction) =>
          sum +
          (transaction.price ?? 0),
        0
      );

  const totalSold =
    combinedTransactions
      .filter(
        (transaction) =>
          transaction.type === "SELL"
      )
      .reduce(
        (sum, transaction) =>
          sum +
          (transaction.price ?? 0),
        0
      );


  /*
   * ============================================================
   * PERFORMANCE
   * ============================================================
   */

  const seasonPerformance =
    season === "all"
      ? null
      : await getSeasonPerformance(
          user.id,
          season,
          galleryValue
        );

  const finalTotalBought =
    seasonPerformance?.totalBought
      ?? totalBought;

  const finalTotalSold =
    seasonPerformance?.totalSold
      ?? totalSold;


  /*
   * ============================================================
   * BENEFICIO
   * ============================================================
   *
   * Beneficio real de la cartera:
   *
   * valor actual
   * + ventas realizadas
   * - compras realizadas
   */

  const profit =
    galleryValue +
    finalTotalSold -
    finalTotalBought;


  /*
   * ============================================================
   * ROI
   * ============================================================
   */

  const roi =
    finalTotalBought === 0
      ? 0
      : (
          profit /
          finalTotalBought
        ) * 100;


  /*
   * ============================================================
   * CAPITAL RECUPERADO
   * ============================================================
   */

  const recoveredCapital =
    finalTotalBought === 0
      ? 0
      : (
          finalTotalSold /
          finalTotalBought
        ) * 100;


  /*
   * ============================================================
   * COMPRAS / VENTAS PARA EL GRÁFICO
   * ============================================================
   */

  const buySellData = [
    {
      name: "Compras",
      value: finalTotalBought,
    },
    {
      name: "Ventas",
      value: finalTotalSold,
    },
  ];


  /*
   * ============================================================
   * HISTORIAL DE TRANSACCIONES
   * ============================================================
   */

  const transactionsHistory =
    combinedTransactions
      .filter(
        (transaction) =>
          transaction.date &&
          typeof transaction.price === "number"
      )
      .map(
        (transaction) => ({
          date:
            new Date(
              transaction.date
            )
              .toISOString()
              .slice(5, 10),

          bought:
            transaction.type === "BUY"
              ? transaction.price ?? 0
              : 0,

          sold:
            transaction.type === "SELL"
              ? transaction.price ?? 0
              : 0,
        })
      );


  /*
   * ============================================================
   * HISTORIAL DEL ROI
   * ============================================================
   */

  const snapshots =
    await prisma.portfolioSnapshot.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "asc",
      },

      select: {
        createdAt: true,
        galleryValue: true,
        roi: true,
        profit: true,
      },
    });


  const portfolioHistory =
    snapshots
      .filter((snapshot) => {
        if (season === "all") {
          return true;
        }

        return isDateInSeason(
          snapshot.createdAt,
          season
        );
      })
      .map((snapshot) => ({
        date:
          snapshot.createdAt,

        roi:
          snapshot.roi,

        galleryValue:
          snapshot.galleryValue,

        profit:
          snapshot.profit,
      }));


  /*
   * ============================================================
   * PUNTO ACTUAL
   * ============================================================
   */

  const lastSnapshot =
    portfolioHistory[
      portfolioHistory.length - 1
    ];

  const currentRoiPoint = {
    date: new Date(),
    roi,
    galleryValue,
    profit,
  };

  if (
    !lastSnapshot ||
    new Date(lastSnapshot.date).getTime() <
      new Date(
        currentRoiPoint.date
      ).getTime()
  ) {
    portfolioHistory.push(
      currentRoiPoint
    );
  }


  /*
   * ============================================================
   * RESPONSE
   * ============================================================
   */

  return NextResponse.json({
    season,

    galleryValue,

    trackingStartedAt,

    startingGalleryValue,

    roi,

    profit,

    totalBought:
      finalTotalBought,

    totalSold:
      finalTotalSold,

    recoveredCapital,

    scarcity,

    buySellData,

    transactionsHistory,

    portfolioHistory,
  });
}
