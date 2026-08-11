"use client";

import { useTranslations } from "next-intl";

type Card = {
  scarcity: string;
  marketValue: number | null;
};

export default function CollectionDistribution({
  cards,
}: {
  cards: Card[];
}) {
  const t = useTranslations("gallery");

  const rarities = [
    {
      key: "limited",
    },
    {
      key: "rare",
    },
    {
      key: "superRare",
      scarcity: "super_rare",
    },
    {
      key: "unique",
    },
  ];

  return (
    <div
      className="
        mb-8
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-6
      "
    >
      <h2
        className="
          mb-6
          text-2xl
          font-black
          text-white
        "
      >
        📊 {t("distribution")}
      </h2>

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {rarities.map((rarity) => {
          const rarityValue =
            rarity.scarcity ?? rarity.key;

          const rarityCards = cards.filter(
            (card) =>
              card.scarcity === rarityValue
          );

          const value = rarityCards.reduce(
            (sum, card) =>
              sum + (card.marketValue ?? 0),
            0
          );

          return (
            <div
              key={rarity.key}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
              "
            >
              <p className="text-zinc-400">
                {t(rarity.key)}
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-black
                  text-white
                "
              >
                {rarityCards.length}
              </h3>

              <p
                className="
                  mt-2
                  font-bold
                  text-green-400
                "
              >
                {value.toFixed(2)}€
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}