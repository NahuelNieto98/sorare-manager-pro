"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslations } from "next-intl";
import { calculateMarketScore } from "@/lib/market-score";
import type { MarketItem } from "@/hooks/useMarket";

type Props = {
  cards: MarketItem[];
  onFilteredChange: (
    cards: MarketItem[]
  ) => void;
};

function normalizeRarity(
  value: string | null | undefined
) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

export default function MarketFilters({
  cards,
  onFilteredChange,
}: Props) {
  const t =
    useTranslations(
      "marketFilters"
    );

  const [search, setSearch] =
    useState("");

  const [rarity, setRarity] =
    useState("all");

  const [price, setPrice] =
    useState("all");

  const [sort, setSort] =
    useState("opportunity");

  const filtered = useMemo(() => {
    let result = [...cards];

    /*
     * =====================================================
     * BUSCADOR
     * =====================================================
     */

    if (search.trim()) {
      const query =
        search
          .toLowerCase()
          .trim();

      result =
        result.filter(
          (item) =>
            [
              item.Card.playerName,
              item.Card.club ?? "",
            ]
              .join(" ")
              .toLowerCase()
              .includes(query)
        );
    }

    /*
     * =====================================================
     * RAREZA
     * =====================================================
     *
     * Normalizamos tanto el valor de la carta como
     * el valor seleccionado en el filtro.
     *
     * Ejemplos:
     *
     * rare       -> rare
     * RARE       -> rare
     * Rare       -> rare
     * rare_      -> rare
     * super_rare -> super rare
     * super-rare -> super rare
     */

    if (rarity !== "all") {
      const normalizedFilter =
        normalizeRarity(
          rarity
        );

      result =
        result.filter(
          (item) => {
            const cardRarity =
              normalizeRarity(
                item.Card?.scarcity
              );

            return (
              cardRarity ===
              normalizedFilter
            );
          }
        );
    }

    /*
     * =====================================================
     * PRECIO
     * =====================================================
     */

    if (price === "cheap") {
      result =
        result.filter(
          (item) =>
            item.price < 10
        );
    }

    if (price === "medium") {
      result =
        result.filter(
          (item) =>
            item.price >= 10 &&
            item.price <= 50
        );
    }

    if (price === "expensive") {
      result =
        result.filter(
          (item) =>
            item.price > 50
        );
    }

    /*
     * =====================================================
     * HELPERS
     * =====================================================
     */

    const opportunity = (
      item: MarketItem
    ) => {
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

      return (
        (
          (value -
            item.price) /
          item.price
        ) * 100
      );
    };

    const rarityPriority = (
      rarityValue: string
    ) => {
      switch (
        normalizeRarity(
          rarityValue
        )
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
    };

    /*
     * =====================================================
     * ORDEN: MAYOR OPORTUNIDAD
     * =====================================================
     *
     * Todas las rarezas:
     *
     * Limited
     * Rare
     * Super Rare
     * Unique
     *
     * Dentro de cada rareza:
     * mayor oportunidad primero.
     */

    if (
      sort === "opportunity"
    ) {
      result.sort(
        (a, b) => {
          const rarityA =
            rarityPriority(
              a.Card.scarcity
            );

          const rarityB =
            rarityPriority(
              b.Card.scarcity
            );

          if (
            rarityA !== rarityB
          ) {
            return (
              rarityB -
              rarityA
            );
          }

          return (
            opportunity(b) -
            opportunity(a)
          );
        }
      );
    }

    /*
     * =====================================================
     * ORDEN: SCORE
     * =====================================================
     */

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

    /*
     * =====================================================
     * ORDEN: PRECIO ASCENDENTE
     * =====================================================
     */

    if (sort === "low") {
      result.sort(
        (a, b) =>
          a.price -
          b.price
      );
    }

    /*
     * =====================================================
     * ORDEN: PRECIO DESCENDENTE
     * =====================================================
     */

    if (sort === "high") {
      result.sort(
        (a, b) =>
          b.price -
          a.price
      );
    }

    /*
     * =====================================================
     * ORDEN: MÁS RECIENTE
     * =====================================================
     */

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
    onFilteredChange(
      filtered
    );
  }, [
    filtered,
    onFilteredChange,
  ]);

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
            setSearch(
              e.target.value
            )
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
            setRarity(
              e.target.value
            )
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
            setPrice(
              e.target.value
            )
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
            setSort(
              e.target.value
            )
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
          sort !==
            "opportunity") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setRarity("all");
              setPrice("all");
              setSort(
                "opportunity"
              );
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