export type MarketScoreOptions = {
  lotValue?: number | null;
  lotCards?: {
    marketValue?: number | null;
    scarcity?: string | null;
  }[];
};

function normalizeRarity(
  rarity: string | null | undefined
) {
  return String(rarity ?? "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

export function calculateMarketScore(
  card: any,
  price: number,
  options?: MarketScoreOptions
) {
  if (!card || !price || price <= 0) {
    return 0;
  }

  const isAuction =
    options?.lotValue !== undefined &&
    options?.lotValue !== null;

  const estimatedValue = isAuction
    ? Number(options?.lotValue ?? 0)
    : Number(card.marketValue ?? 0);

  if (
    !estimatedValue ||
    estimatedValue <= 0
  ) {
    return 0;
  }

  /*
   * Para cartas individuales:
   *
   * oportunidad =
   * (valor - precio) / precio
   *
   * Para subastas:
   *
   * descuento =
   * (valor - precio) / valor
   *
   * Esto evita que una puja inicial de €5
   * frente a una carta valorada en €200
   * genere oportunidades absurdas como +3900%.
   */

  const opportunity = isAuction
    ? (
        (estimatedValue - price) /
        estimatedValue
      ) * 100
    : (
        (estimatedValue - price) /
        price
      ) * 100;

  let score = 50;

  /*
   * =====================================================
   * 1. OPORTUNIDAD / DESCUENTO
   * =====================================================
   */

  if (isAuction) {
    /*
     * En subastas utilizamos descuento sobre
     * el valor estimado.
     */

    if (opportunity >= 90) {
      score += 40;
    } else if (opportunity >= 80) {
      score += 38;
    } else if (opportunity >= 70) {
      score += 35;
    } else if (opportunity >= 60) {
      score += 31;
    } else if (opportunity >= 50) {
      score += 27;
    } else if (opportunity >= 40) {
      score += 23;
    } else if (opportunity >= 30) {
      score += 20;
    } else if (opportunity >= 25) {
      score += 17;
    } else if (opportunity >= 20) {
      score += 14;
    } else if (opportunity >= 15) {
      score += 11;
    } else if (opportunity >= 10) {
      score += 8;
    } else if (opportunity >= 5) {
      score += 5;
    } else if (opportunity >= 0) {
      score += 2;
    } else if (opportunity >= -10) {
      score -= 10;
    } else if (opportunity >= -20) {
      score -= 20;
    } else if (opportunity >= -30) {
      score -= 30;
    } else {
      score -= 40;
    }
  } else {
    /*
     * ===================================================
     * CARTAS INDIVIDUALES
     * ===================================================
     */

    if (opportunity >= 40) {
      score += 35;
    } else if (opportunity >= 30) {
      score += 30;
    } else if (opportunity >= 20) {
      score += 22;
    } else if (opportunity >= 10) {
      score += 15;
    } else if (opportunity >= 0) {
      score += 8;
    } else if (opportunity >= -10) {
      score -= 10;
    } else if (opportunity >= -20) {
      score -= 22;
    } else if (opportunity >= -30) {
      score -= 35;
    } else {
      score -= 45;
    }
  }

  /*
   * =====================================================
   * 2. CALIDAD DEL LOTE
   * =====================================================
   */

  if (isAuction) {
    const lotCards =
      options?.lotCards ?? [];

    const validCards =
      lotCards.filter(
        (lotCard) =>
          lotCard.marketValue !== null &&
          lotCard.marketValue !== undefined &&
          Number(lotCard.marketValue) > 0
      );

    if (validCards.length >= 3) {
      score += 5;
    } else if (
      validCards.length === 2
    ) {
      score += 3;
    } else if (
      validCards.length === 1
    ) {
      score += 1;
    }

    const superRareCards =
      validCards.filter(
        (lotCard) =>
          normalizeRarity(
            lotCard.scarcity
          ) === "super rare"
      ).length;

    const rareCards =
      validCards.filter(
        (lotCard) =>
          normalizeRarity(
            lotCard.scarcity
          ) === "rare"
      ).length;

    if (superRareCards >= 3) {
      score += 5;
    } else if (
      superRareCards === 2
    ) {
      score += 4;
    } else if (
      superRareCards === 1
    ) {
      score += 3;
    } else if (rareCards >= 2) {
      score += 2;
    } else if (
      rareCards === 1
    ) {
      score += 1;
    }
  } else {
    /*
     * ===================================================
     * 2. RENDIMIENTO
     * ===================================================
     */

    const scores = [
      card.l5Score,
      card.l10Score,
      card.l15Score,
      card.l40Score,
    ].filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        typeof value === "number"
    );

    if (scores.length > 0) {
      const average =
        scores.reduce(
          (
            total: number,
            value: number
          ) =>
            total + value,
          0
        ) / scores.length;

      if (average >= 60) {
        score += 10;
      } else if (
        average >= 50
      ) {
        score += 7;
      } else if (
        average >= 40
      ) {
        score += 4;
      } else if (
        average < 30
      ) {
        score -= 5;
      }
    }
  }

  /*
   * =====================================================
   * 3. RAREZA
   * =====================================================
   */

  if (!isAuction) {
    switch (
      normalizeRarity(
        card.scarcity
      )
    ) {
      case "limited":
        score += 3;
        break;

      case "rare":
        score += 4;
        break;

      case "super rare":
        score += 5;
        break;

      case "unique":
        score += 5;
        break;
    }
  }

  /*
   * =====================================================
   * 4. LIMITES
   * =====================================================
   */

  score = Math.max(
    0,
    Math.min(100, score)
  );

  return Math.round(score);
}
