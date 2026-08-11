"use client";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { useTranslations } from "next-intl";

import SortDropdown from "@/components/ui/SortDropdown";

const rarityKeys = [
  { key: "all", value: "all" },
  { key: "limited", value: "limited" },
  { key: "rare", value: "rare" },
  { key: "superRare", value: "super_rare" },
  { key: "unique", value: "unique" },
];

const positionKeys = [
  { key: "all", value: "all" },
  { key: "gk", value: "GK" },
  { key: "def", value: "DEF" },
  { key: "mid", value: "MID" },
  { key: "fw", value: "FW" },
];

type Props = {
  search: string;
  setSearch: (value: string) => void;

  rarity: string;
  setRarity: (value: string) => void;

  position: string;
  setPosition: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;

  onReset: () => void;
};

export default function GalleryFilters({
  search,
  setSearch,
  rarity,
  setRarity,
  position,
  setPosition,
  sort,
  setSort,
  onReset,
}: Props) {
  const t = useTranslations("gallery");

  const hasFilters =
    search !== "" ||
    rarity !== "all" ||
    position !== "all" ||
    sort !== "value";

  return (
    <div
      className="
        mb-6
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-4
        md:mb-8
        md:p-6
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal
            className="text-violet-300"
            size={20}
          />

          <span className="font-bold text-white">
            {t("filters")}
          </span>
        </div>

        {hasFilters && (
          <button
            onClick={onReset}
            className="
              rounded-xl
              bg-red-500/10
              px-3
              py-1.5
              text-xs
              font-bold
              text-red-300
              transition
              hover:bg-red-500/20
            "
          >
            {t("clear")}
          </button>
        )}
      </div>

      <div
        className="
          mt-4
          flex
          flex-col
          gap-3
          md:mt-6
          xl:flex-row
        "
      >
        <div className="relative w-full">
          <Search
            size={17}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-zinc-500
            "
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/5
              py-2.5
              pl-10
              pr-4
              text-sm
              text-white
              outline-none
              md:py-3
            "
          />
        </div>

        <SortDropdown
          value={sort}
          onChange={setSort}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold text-white/50">
          {t("position")}
        </p>

        <div className="flex flex-wrap gap-2">
          {positionKeys.map((p) => (
            <button
              key={p.value}
              onClick={() => setPosition(p.value)}
              className={
                position === p.value
                  ? "rounded-full bg-violet-600 px-4 py-1.5 text-sm text-white"
                  : "rounded-full bg-white/5 px-4 py-1.5 text-sm text-zinc-400"
              }
            >
              {t(`positions.${p.key}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold text-white/50">
          {t("rarity")}
        </p>

        <div className="flex flex-wrap gap-2">
          {rarityKeys.map((r) => (
            <button
              key={r.value}
              onClick={() => setRarity(r.value)}
              className={
                rarity === r.value
                  ? "rounded-full bg-violet-600 px-4 py-1.5 text-sm text-white"
                  : "rounded-full bg-white/5 px-4 py-1.5 text-sm text-zinc-400"
              }
            >
              {t(r.key)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}