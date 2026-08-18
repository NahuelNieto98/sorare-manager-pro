import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import {
  getUserTransactions,
} from "@/lib/transactions/getUserTransactions";

import {
  getSeason,
} from "@/lib/transactions/seasons";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json([], {
      status: 401,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json([]);
  }

  const snapshots =
    await prisma.portfolioSnapshot.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  if (snapshots.length === 0) {
    return NextResponse.json([]);
  }

  const transactions =
    await getUserTransactions(user.id);

  const season =
    getSeason("2026-27");

  const seasonStart =
    season
      ? new Date(season.start).getTime()
      : null;

  const seasonEnd =
    season
      ? new Date(season.end).getTime()
      : null;

  const seasonSnapshots =
    snapshots.filter((snapshot) => {
      const time =
        new Date(snapshot.createdAt).getTime();

      if (
        seasonStart === null ||
        seasonEnd === null
      ) {
        return true;
      }

      return (
        time >= seasonStart &&
        time < seasonEnd
      );
    });

  if (seasonSnapshots.length === 0) {
    return NextResponse.json([]);
  }

  const firstSnapshot =
    seasonSnapshots[0];

  const startingGalleryValue =
    firstSnapshot.galleryValue;

  const trackingStartedAt =
    new Date(
      firstSnapshot.createdAt
    ).getTime();

  const history =
    seasonSnapshots.map((snapshot) => {
      const snapshotTime =
        new Date(
          snapshot.createdAt
        ).getTime();

      const seasonTransactions =
        transactions.filter(
          (transaction) => {
            const transactionTime =
              new Date(
                transaction.date
              ).getTime();

            return (
              transactionTime >=
                trackingStartedAt &&
              transactionTime <=
                snapshotTime
            );
          }
        );

      const totalBought =
        seasonTransactions
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
        seasonTransactions
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

      const profit =
        snapshot.galleryValue -
        startingGalleryValue -
        totalBought +
        totalSold;

      const capitalReference =
        startingGalleryValue +
        totalBought;

      const roi =
        capitalReference === 0
          ? 0
          : (profit / capitalReference) * 100;

      return {
        date: snapshot.createdAt,
        galleryValue:
          snapshot.galleryValue,
        roi,
        profit,
      };
    });

  return NextResponse.json(history);
}
