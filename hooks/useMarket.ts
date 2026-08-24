"use client";

import { useEffect, useState } from "react";

import {
  calculateMarketScore,
} from "@/lib/market-score";

export type MarketCard = {
  id: string;

  playerName: string;

  club: string | null;

  scarcity: string;

  marketValue: number | null;

  pictureUrl: string | null;
};

export type MarketItem = {
  id: string;

  price: number;

  type:
    | "BUY"
    | "SINGLE_SALE_OFFER"
    | "AUCTION";

  auctionId?: string;

  endDate?: string;

  lotValue?: number;

  lotCards?: MarketCard[];

  Card: MarketCard;
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

function rarityPriority(
  rarity: string | null | undefined
) {
  switch (
    normalizeRarity(rarity)
  ) {
    case "limited":
      return 4;

    case "rare":
      return 3;

    case "super rare":
      return 2;

    case "unique":
      return 1;

    default:
      return 0;
  }
}

export function useMarket() {
  const [cards, setCards] =
    useState<MarketItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function refresh() {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "🔄 Cargando mercado..."
      );

      const res =
        await fetch(
          "/api/market",
          {
            cache: "no-store",
          }
        );

      const text =
        await res.text();

      let data: any = null;

      try {
        data =
          text
            ? JSON.parse(text)
            : null;
      } catch {
        console.error(
          "❌ La API devolvió una respuesta que no es JSON:",
          text
        );

        throw new Error(
          `Market API devolvió una respuesta inválida (${res.status})`
        );
      }

      if (!res.ok) {
        console.error(
          "❌ Market API error:",
          {
            status: res.status,
            data,
          }
        );

        const apiError =
          data?.error ??
          data?.message ??
          `Error HTTP ${res.status}`;

        throw new Error(
          `Market API: ${apiError}`
        );
      }

      if (!Array.isArray(data)) {
        console.error(
          "❌ Market API no devolvió un array:",
          data
        );

        throw new Error(
          "La API del mercado no devolvió una lista de cartas"
        );
      }

      console.log(
        "✅ Mercado recibido:",
        data.length,
        "elementos"
      );

      const validCards =
        data.filter(
          (item: MarketItem) =>
            item &&
            item.Card
        );

      console.log(
        "📊 Cartas válidas:",
        validCards.length
      );

      const rarityCounts: Record<
        string,
        number
      > = {};

      for (
        const item of validCards
      ) {
        const rarity =
          normalizeRarity(
            item.Card?.scarcity
          ) || "unknown";

        rarityCounts[
          rarity
        ] =
          (
            rarityCounts[
              rarity
            ] ?? 0
          ) + 1;
      }

      console.log(
        "📊 Rarezas recibidas:",
        rarityCounts
      );

      const sorted =
        validCards.sort(
          (
            a: MarketItem,
            b: MarketItem
          ) => {
            /*
             * ==========================================
             * PRIORIDAD DE RAREZA
             * ==========================================
             *
             * Limited
             * Rare
             * Super Rare
             * Unique
             */

            const rarityA =
              rarityPriority(
                a.Card.scarcity
              );

            const rarityB =
              rarityPriority(
                b.Card.scarcity
              );

            /*
             * Primero rareza.
             */

            if (
              rarityA !== rarityB
            ) {
              return (
                rarityB -
                rarityA
              );
            }

            /*
             * ==========================================
             * DENTRO DE LA MISMA RAREZA
             * ==========================================
             *
             * Market Score.
             */

            const scoreA =
              getMarketScore(a);

            const scoreB =
              getMarketScore(b);

            return (
              scoreB -
              scoreA
            );
          }
        );

      setCards(
        sorted
      );

    } catch (error) {
      console.error(
        "❌ ERROR CARGANDO MARKET:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Error desconocido cargando el mercado";

      setError(
        message
      );

      setCards([]);

    } finally {
      setLoading(false);
    }
  }

  function getMarketScore(
    item: MarketItem
  ) {
    return calculateMarketScore(
      item.Card,
      item.price,
      item.type === "AUCTION"
        ? {
            lotValue:
              item.lotValue,

            lotCards:
              item.lotCards,
          }
        : undefined
    );
  }

  function getOpportunity(
    item: MarketItem
  ) {
    const value =
      item.type === "AUCTION" &&
      item.lotValue !== undefined
        ? item.lotValue
        : item.Card.marketValue;

    if (
      !value ||
      !item.price
    ) {
      return 0;
    }

    /*
     * En subastas mostramos el DESCUENTO respecto
     * al valor estimado del lote.
     *
     * Ejemplo:
     * Precio: €2.58
     * Valor:  €67.26
     *
     * Resultado:
     * (67.26 - 2.58) / 67.26 = 96.2%
     *
     * Evitamos así cifras absurdas como +2507%.
     */

    if (item.type === "AUCTION") {
      return (
        (
          (value - item.price) /
          value
        ) * 100
      );
    }

    /*
     * Para cartas individuales mantenemos
     * el cálculo anterior.
     */

    return (
      (
        (value - item.price) /
        item.price
      ) * 100
    );
  }

  function getScore(
    item: MarketItem
  ) {
    return getMarketScore(
      item
    );
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    cards,
    loading,
    error,
    refresh,
    getOpportunity,
    getScore,
  };
}
