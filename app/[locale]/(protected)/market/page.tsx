"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useMarket } from "@/hooks/useMarket";

import MarketStats from "@/components/market/MarketStats";
import MarketList from "@/components/market/MarketList";
import MarketTable from "@/components/market/MarketTable";
import MarketEmpty from "@/components/market/MarketEmpty";
import MarketFilters from "./MarketFilters";

export default function MarketPage() {
  const t = useTranslations("market");

  const {
    cards,
    loading,
    error,
    getOpportunity,
    getScore,
  } = useMarket();

  const [filteredCards, setFilteredCards] =
    useState<typeof cards>([]);

  const [filtersReady, setFiltersReady] =
    useState(false);

  const handleFilteredChange = useCallback(
    (items: typeof cards) => {
      setFilteredCards(items);
      setFiltersReady(true);
    },
    []
  );

  if (loading) {
    return (
      <div className="text-center text-zinc-400">
        {t("loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white">
        {error}
      </div>
    );
  }

  if (cards.length === 0) {
    return <MarketEmpty />;
  }

  const activeCards = filtersReady
    ? filteredCards
    : cards;

  /*
   * =====================================================
   * PRIORIDAD DE RAREZA
   * =====================================================
   *
   * Cuando mostramos "Todas las rarezas":
   *
   * Limited
   * Rare
   * Super Rare
   * Unique
   *
   * Y dentro de cada rareza:
   * mayor oportunidad primero.
   */

  const rarityPriority = (
    rarity: string
  ) => {
    switch (rarity) {
      case "limited":
        return 4;

      case "rare":
        return 3;

      case "super_rare":
        return 2;

      case "unique":
        return 1;

      default:
        return 0;
    }
  };

  const opportunities = activeCards
    .filter(
      (item) =>
        getOpportunity(item) > 0
    )
    .sort(
      (a, b) => {
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
         * Después oportunidad.
         */

        return (
          getOpportunity(b) -
          getOpportunity(a)
        );
      }
    );

  const bestScore = opportunities.length
    ? Math.max(
        ...opportunities.map(
          (item) =>
            getScore(item)
        )
      )
    : 0;

  const tableCards =
    activeCards.map(
      (item) => ({
        ...item,
        score:
          getScore(item),
      })
    );

  return (
    <div className="space-y-8">
      <section
        className="
          rounded-3xl
          border
          border-white/10
          bg-[#17112F]
          p-8
        "
      >
        <span
          className="
            rounded-full
            border
            border-violet-500/30
            bg-violet-500/10
            px-4
            py-2
            text-xs
            font-bold
            uppercase
            tracking-widest
            text-violet-300
          "
        >
          {t("intelligence")}
        </span>

        <h1
          className="
            mt-6
            text-5xl
            font-black
            text-white
          "
        >
          {t("title")}
        </h1>

        <p
          className="
            mt-3
            text-lg
            text-zinc-400
          "
        >
          {t("subtitle")}
        </p>
      </section>

      <MarketStats
        analyzed={
          activeCards.length
        }
        opportunities={
          opportunities.length
        }
        bestScore={
          bestScore
        }
      />

      <MarketFilters
        cards={cards}
        onFilteredChange={
          handleFilteredChange
        }
      />

      <MarketList
        cards={opportunities}
      />

      <MarketTable
        cards={tableCards}
      />
    </div>
  );
}