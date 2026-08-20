"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { calculateMarketScore } from "@/lib/market-score";
import type { MarketItem } from "@/hooks/useMarket";

type Props = {
  cards: MarketItem[];
  onFilteredChange: (cards: MarketItem[]) => void;
};

export default function MarketFilters({
  cards,
  onFilteredChange,
}: Props) {
  const t = useTranslations("marketFilters");

  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("opportunity");

  const filtered = useMemo(() => {
    let result = [...cards];

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((item) =>
        [
          item.Card.playerName,
          item.Card.club ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (rarity !== "all") {
      result = result.filter(
        (item) => item.Card.scarcity === rarity
      );
    }

    if (price === "cheap") {
      result = result.filter(
        (item) => item.price < 10
      );
    }

    if (price === "medium") {
      result = result.filter(
        (item) =>
          item.price >= 10 &&
          item.price <= 50
      );
    }

    if (price === "expensive") {
      result = result.filter(
        (item) => item.price > 50
      );
    }

    const opportunity = (item: MarketItem) =>
      item.Card.marketValue
        ? ((item.Card.marketValue - item.price) /
            item.price) *
          100
        : 0;

    if (sort === "opportunity") {
      result.sort(
        (a, b) =>
          opportunity(b) - opportunity(a)
      );
    }

    if (sort === "score") {
      result.sort(
        (a, b) =>
          calculateMarketScore(
            b.Card,
            b.price
          ) -
          calculateMarketScore(
            a.Card,
            a.price
          )
      );
    }

    if (sort === "low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "recent") {
      result.reverse();
    }

    return result;
  }, [
    cards,
    search,
    rarity,
    price,
    sort,
  ]);

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered, onFilteredChange]);

  return (
    <section
      className="
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-5
        md:p-6
      "
    >
      <div className="mb-5">
        <h2 className="text-xl font-black text-white">
          🔎 Filtros del mercado
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Encuentra rápidamente las cartas que más te interesan.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          className="
            rounded-xl
            border
            border-white/10
            bg-black/20
            px-4
            py-3
            text-sm
            text-white
            outline-none
            transition
            placeholder:text-zinc-500
            focus:border-violet-500/50
          "
          placeholder={t("search")}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="
            rounded-xl
            border
            border-white/10
            bg-[#211941]
            px-4
            py-3
            text-sm
            text-white
            outline-none
          "
          value={rarity}
          onChange={(e) =>
            setRarity(e.target.value)
          }
        >
          <option value="all">
            {t("allRarities")}
          </option>

          <option value="limited">
            Limitada
          </option>

          <option value="rare">
            Rara
          </option>

          <option value="super_rare">
            Super Rara
          </option>

          <option value="unique">
            Única
          </option>
        </select>

        <select
          className="
            rounded-xl
            border
            border-white/10
            bg-[#211941]
            px-4
            py-3
            text-sm
            text-white
            outline-none
          "
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        >
          <option value="all">
            {t("price")}
          </option>

          <option value="cheap">
            {t("cheap")}
          </option>

          <option value="medium">
            {t("medium")}
          </option>

          <option value="expensive">
            {t("expensive")}
          </option>
        </select>

        <select
          className="
            rounded-xl
            border
            border-white/10
            bg-[#211941]
            px-4
            py-3
            text-sm
            text-white
            outline-none
          "
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="opportunity">
            Mayor oportunidad
          </option>

          <option value="score">
            Mayor puntuación
          </option>

          <option value="low">
            {t("lowest")}
          </option>

          <option value="high">
            {t("highest")}
          </option>

          <option value="recent">
            {t("recent")}
          </option>
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          {filtered.length} resultados
        </p>

        {(search ||
          rarity !== "all" ||
          price !== "all" ||
          sort !== "opportunity") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setRarity("all");
              setPrice("all");
              setSort("opportunity");
            }}
            className="
              rounded-lg
              px-3
              py-1.5
              text-xs
              font-bold
              text-violet-300
              transition
              hover:bg-violet-500/10
            "
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}
