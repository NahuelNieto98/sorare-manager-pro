"use client";

import { useTranslations } from "next-intl";
import MarketOpportunityCard from "./MarketOpportunityCard";

type AuctionCard = {
  id: string;
  playerName: string;
  club: string | null;
  scarcity: string;
  marketValue: number | null;
  pictureUrl: string | null;
};

type MarketItem = {
  id: string;
  price: number;
  type?: string;
  auctionId?: string;
  endDate?: string;
  lotValue?: number;
  lotCards?: AuctionCard[];
  Card: AuctionCard;
};

type Props = {
  cards: MarketItem[];
};

export default function MarketList({
  cards,
}: Props) {
  const t = useTranslations("market");

  if (cards.length === 0) {
    return (
      <section>
        <h2
          className="
            mb-5
            text-2xl
            font-black
            text-white
          "
        >
          🔥 {t("top")}
        </h2>

        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-[#17112F]
            p-8
            text-center
          "
        >
          <p className="text-zinc-400">
            No hay oportunidades interesantes ahora mismo.
          </p>
        </div>
      </section>
    );
  }

  const gridClass =
    cards.length === 1
      ? "grid grid-cols-1"
      : cards.length === 2
        ? "grid grid-cols-1 gap-5 md:grid-cols-2"
        : "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3";

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2
          className="
            text-2xl
            font-black
            text-white
          "
        >
          🔥 {t("top")}
        </h2>

        <span
          className="
            rounded-full
            border
            border-violet-500/20
            bg-violet-500/10
            px-3
            py-1
            text-xs
            font-bold
            text-violet-300
          "
        >
          {cards.length}
        </span>
      </div>

      <div className={gridClass}>
        {cards
          .slice(0, 5)
          .map((item) => (
            <div
              key={item.id}
              className={
                cards.length === 1
                  ? "mx-auto w-full max-w-3xl"
                  : "w-full"
              }
            >
              <MarketOpportunityCard
                item={item}
              />
            </div>
          ))}
      </div>
    </section>
  );
}