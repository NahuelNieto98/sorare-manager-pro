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

      const res =
        await fetch("/api/market");

      if (!res.ok) {
        throw new Error(
          "Market request failed"
        );
      }

      const data =
        await res.json();

      const sorted =
        data
          .filter(
            (item: MarketItem) =>
              item.Card
          )
          .sort(
            (
              a: MarketItem,
              b: MarketItem
            ) => {
              const scoreA =
                getMarketScore(a);

              const scoreB =
                getMarketScore(b);

              return scoreB - scoreA;
            }
          );

      setCards(sorted);
    } catch (error) {
      console.error(error);

      setError(
        "Error loading market"
      );
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

    if (!value || !item.price) {
      return 0;
    }

    return (
      ((value - item.price) /
        item.price) *
      100
    );
  }

  function getScore(
    item: MarketItem
  ) {
    return getMarketScore(item);
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