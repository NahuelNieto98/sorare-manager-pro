export function mapPurchaseToTransaction(purchase: any) {
  const slug =
    purchase.receiverSide?.anyCards?.[0]?.slug ?? "";

  const rarityMatch =
    slug.match(/-(limited|rare|super_rare|unique)-/);

  const rarity =
    rarityMatch?.[1] ?? "";

  let playerSlug =
    rarityMatch
      ? slug.slice(0, rarityMatch.index)
      : slug;

  playerSlug = playerSlug
    .replace(/-\d{4}-\d{2}-\d{2}-\d{4}$/, "")
    .replace(/-\d{4}$/, "");

  let playerName =
    playerSlug
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  playerName = playerName
    .split(" ")
    .map((part: string) =>
      part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  return {
    id: `sorare-${purchase.id}`,
    type: "BUY",
    playerName,
    rarity,
    price:
      (purchase.senderSide?.amounts?.eurCents ?? 0) / 100,
    date: purchase.transactionDate,
    source: "SORARE",
  };
}
