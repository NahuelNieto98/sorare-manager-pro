import { getUserTransactions } from "@/lib/transactions/getUserTransactions";
import { getSeasonSnapshot } from "@/lib/transactions/seasonSnapshot";
import { isDateInSeason } from "@/lib/transactions/seasons";

export async function getSeasonPerformance(
  userId: string,
  seasonId: string,
  currentGalleryValue: number,
) {
  const snapshot = await getSeasonSnapshot(
    userId,
    seasonId
  );

  const transactions = await getUserTransactions(
    userId
  );

  const seasonTransactions =
    transactions.filter(
      (transaction) =>
        isDateInSeason(
          transaction.date,
          seasonId
        )
    );

  const totalBought = seasonTransactions
    .filter(
      (transaction) =>
        transaction.type === "BUY"
    )
    .reduce(
      (sum, transaction) =>
        sum + (transaction.price ?? 0),
      0
    );

  const totalSold = seasonTransactions
    .filter(
      (transaction) =>
        transaction.type === "SELL"
    )
    .reduce(
      (sum, transaction) =>
        sum + (transaction.price ?? 0),
      0
    );

  const startingGalleryValue =
    snapshot?.galleryValue ?? null;

  const trackingStartedAt =
    snapshot?.createdAt ?? null;

  const profit =
    currentGalleryValue +
    totalSold -
    totalBought;

  const roi =
    totalBought === 0
      ? 0
      : (profit / totalBought) * 100;

  const recoveredCapital =
    totalBought === 0
      ? 0
      : (totalSold / totalBought) * 100;

  return {
    startingGalleryValue,
    currentGalleryValue,
    trackingStartedAt,
    totalBought,
    totalSold,
    profit,
    roi,
    recoveredCapital,
    transactionCount:
      seasonTransactions.length,
  };
}
