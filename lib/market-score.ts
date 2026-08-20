export type MarketScoreOptions = {
  lotValue?: number | null;
  lotCards?: {
    marketValue?: number | null;
    scarcity?: string | null;
  }[];
};

export function calculateMarketScore(
  card: any,
  price: number,
  options?: MarketScoreOptions
) {
  if (!card || !price || price <= 0) {
    return 0;
  }

  /*
   * =====================================================
   * SUBASTAS
   * =====================================================
   *
   * Cuando recibimos un lote utilizamos el valor total
   * del lote en lugar del marketValue de una sola carta.
   */

  const isAuction =
    options?.lotValue !== undefined &&
    options?.lotValue !== null;

  const estimatedValue = isAuction
    ? Number(options?.lotValue ?? 0)
    : Number(card.marketValue ?? 0);

  if (!estimatedValue || estimatedValue <= 0) {
    return 0;
  }

  const opportunity =
    ((estimatedValue - price) / price) * 100;

  /*
   * =====================================================
   * 1. OPORTUNIDAD
   * =====================================================
   *
   * Cuanto mayor sea la diferencia entre precio y valor,
   * mayor será la puntuación.
   *
   * En subastas usamos una escala más amplia porque
   * los lotes pueden presentar oportunidades enormes.
   */

  let score = 50;

  if (isAuction) {
    if (opportunity >= 1000) {
      score += 40;
    } else if (opportunity >= 750) {
      score += 38;
    } else if (opportunity >= 500) {
      score += 35;
    } else if (opportunity >= 300) {
      score += 31;
    } else if (opportunity >= 200) {
      score += 27;
    } else if (opportunity >= 150) {
      score += 23;
    } else if (opportunity >= 100) {
      score += 20;
    } else if (opportunity >= 75) {
      score += 17;
    } else if (opportunity >= 50) {
      score += 14;
    } else if (opportunity >= 30) {
      score += 11;
    } else if (opportunity >= 20) {
      score += 8;
    } else if (opportunity >= 10) {
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
     *
     * Mantenemos prácticamente el comportamiento anterior
     * para no alterar el funcionamiento que ya tenemos.
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
   *
   * Para subastas tenemos información de todas las cartas.
   *
   * Un lote con varias cartas valiosas recibe una pequeña
   * bonificación, pero la oportunidad económica sigue siendo
   * el factor principal.
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
    } else if (validCards.length === 2) {
      score += 3;
    } else if (validCards.length === 1) {
      score += 1;
    }

    /*
     * Bonificación por rareza predominante del lote.
     */

    const superRareCards =
      validCards.filter(
        (lotCard) =>
          lotCard.scarcity === "super_rare"
      ).length;

    const rareCards =
      validCards.filter(
        (lotCard) =>
          lotCard.scarcity === "rare"
      ).length;

    if (superRareCards >= 3) {
      score += 5;
    } else if (superRareCards === 2) {
      score += 4;
    } else if (superRareCards === 1) {
      score += 3;
    } else if (rareCards >= 2) {
      score += 2;
    } else if (rareCards === 1) {
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
          (total: number, value: number) =>
            total + value,
          0
        ) / scores.length;

      if (average >= 60) {
        score += 10;
      } else if (average >= 50) {
        score += 7;
      } else if (average >= 40) {
        score += 4;
      } else if (average < 30) {
        score -= 5;
      }
    }
  }

  /*
   * =====================================================
   * 3. RAREZA
   * =====================================================
   *
   * Para cartas normales mantenemos la bonificación.
   *
   * En subastas la rareza ya se valora dentro del lote,
   * por lo que no añadimos nuevamente la rareza de la
   * carta principal.
   */

  if (!isAuction) {
    switch (card.scarcity) {
      case "limited":
        score += 3;
        break;

      case "rare":
        score += 4;
        break;

      case "super_rare":
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