export function mapSaleToTransaction(sale: any) {
  const isDirectOffer =
    sale.type === "DIRECT_OFFER";

  const cardSlug =
    isDirectOffer
      ? sale.senderSide?.anyCards?.[0]?.slug ??
        sale.receiverSide?.anyCards?.[0]?.slug ??
        ""
      : sale.receiverSide?.anyCards?.[0]?.slug ??
        sale.senderSide?.anyCards?.[0]?.slug ??
        "";

  const parts = cardSlug.split("-");

  const rarityIndex = parts.findIndex((part: string) =>
    ["limited", "rare", "super_rare", "unique"].includes(part)
  );

  const rarity =
    rarityIndex >= 0
      ? parts[rarityIndex]
      : "";

  let playerName =
    rarityIndex >= 0
      ? parts.slice(0, rarityIndex).join(" ")
      : cardSlug;

  playerName = playerName
    .replace(/-?\d{4}-\d{2}-\d{2}$/g, "")
    .replace(/-?\d{4}$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  playerName = playerName
    .split(" ")
    .filter(Boolean)
    .map((part: string) =>
      part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  /*
   * Sorare puede colocar el precio en diferentes lados
   * dependiendo del tipo de transacción.
   *
   * Para una venta:
   * - SingleBuyOffer suele tener el importe en senderSide
   * - DirectOffer puede tenerlo en receiverSide
   *
   * Probamos ambas posiciones antes de asumir que no existe.
   */
  const primaryPrice =
    isDirectOffer
      ? sale.receiverSide?.amounts?.eurCents
      : sale.senderSide?.amounts?.eurCents;

  const fallbackPrice =
    isDirectOffer
      ? sale.senderSide?.amounts?.eurCents
      : sale.receiverSide?.amounts?.eurCents;

  const eurCents =
    typeof primaryPrice === "number" && primaryPrice > 0
      ? primaryPrice
      : typeof fallbackPrice === "number" && fallbackPrice > 0
      ? fallbackPrice
      : null;

  if (eurCents === null) {
    console.warn(
      "⚠️ VENTA SORARE SIN PRECIO:",
      JSON.stringify({
        id: sale.id,
        type: sale.type,
        transactionDate: sale.transactionDate,
        senderSide: sale.senderSide,
        receiverSide: sale.receiverSide,
      })
    );
  }

  return {
    id: `sorare-${sale.id}`,
    type: "SELL",
    playerName,
    rarity,
    price: eurCents !== null ? eurCents / 100 : null,
    date: sale.transactionDate,
    source: "SORARE",
  };
}