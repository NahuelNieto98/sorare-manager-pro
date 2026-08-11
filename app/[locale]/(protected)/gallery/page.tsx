"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useGallery } from "@/hooks/useGallery";

import GalleryStats from "@/components/gallery/GalleryStats";
import GalleryFilters from "@/components/gallery/GalleryFilters";
import CardItem from "@/components/gallery/CardItem";
import CollectionDistribution from "@/components/gallery/CollectionDistribution";
import GalleryEmpty from "@/components/gallery/GalleryEmpty";

export default function GalleryPage() {
  const t = useTranslations("gallery");

  const {
    cards,
    loading,
    error,
  } = useGallery();

  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");
  const [position, setPosition] = useState("all");
  const [sort, setSort] = useState("value");

  function resetFilters() {
    setSearch("");
    setRarity("all");
    setPosition("all");
    setSort("value");
  }

  const currentSeason =
    cards.length > 0
      ? Math.max(...cards.map((c) => c.season))
      : 0;

  const galleryValue = cards.reduce(
    (sum, card) =>
      sum + (card.marketValue ?? 0),
    0
  );

  const inSeasonCards = cards.filter(
    (card) => card.season === currentSeason
  );

  const classicCards = cards.filter(
    (card) => card.season !== currentSeason
  );

  const inSeasonValue = inSeasonCards.reduce(
    (sum, card) =>
      sum + (card.marketValue ?? 0),
    0
  );

  const classicValue = classicCards.reduce(
    (sum, card) =>
      sum + (card.marketValue ?? 0),
    0
  );

  const filteredCards = useMemo(() => {
    const q = search.toLowerCase();

    return [...cards]
      .filter(
        (card) =>
          (
            card.playerName
              .toLowerCase()
              .includes(q) ||
            (card.club ?? "")
              .toLowerCase()
              .includes(q)
          ) &&
          (
            rarity === "all" ||
            card.scarcity === rarity
          ) &&
          (
            position === "all" ||
            card.position === position
          )
      )
      .sort((a, b) => {
        switch (sort) {
          case "value":
            return (
              (b.marketValue ?? 0) -
              (a.marketValue ?? 0)
            );

          case "lowValue":
            return (
              (a.marketValue ?? 0) -
              (b.marketValue ?? 0)
            );

          case "aa":
            return (
              (b.averageScore ?? 0) -
              (a.averageScore ?? 0)
            );

          case "lowAA":
            return (
              (a.averageScore ?? 0) -
              (b.averageScore ?? 0)
            );

          case "l10":
            return (
              (b.l10Score ?? 0) -
              (a.l10Score ?? 0)
            );

          case "l40":
            return (
              (b.l40Score ?? 0) -
              (a.l40Score ?? 0)
            );

          case "name":
            return a.playerName.localeCompare(
              b.playerName
            );

          default:
            return 0;
        }
      });
  }, [
    cards,
    search,
    rarity,
    position,
    sort,
  ]);

  if (error) {
    return (
      <div className="text-red-400">
        {error}
      </div>
    );
  }

  if (!loading && cards.length === 0) {
    return <GalleryEmpty />;
  }

  return (
    <>
      <GalleryStats
        cards={cards}
        galleryValue={galleryValue}
        totalCards={cards.length}
        inSeasonCards={inSeasonCards.length}
        classicCards={classicCards.length}
        inSeasonValue={inSeasonValue}
        classicValue={classicValue}
      />

      <GalleryFilters
        search={search}
        setSearch={setSearch}
        rarity={rarity}
        setRarity={setRarity}
        position={position}
        setPosition={setPosition}
        sort={sort}
        setSort={setSort}
        onReset={resetFilters}
      />

      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >
        <p className="text-zinc-400">
          {t("showing")}

          <span className="mx-1 font-bold text-white">
            {filteredCards.length}
          </span>

          {t("of")}

          <span className="mx-1 font-bold text-white">
            {cards.length}
          </span>

          {t("cards")}
        </p>
      </div>

      {!loading && (
        <CollectionDistribution
          cards={cards}
        />
      )}

      {loading ? (
        <div className="text-zinc-400">
          {t("loading")}
        </div>
      ) : (
        <div
          className="
            grid
            gap-5
            md:grid-cols-3
            lg:grid-cols-4
            2xl:grid-cols-5
          "
        >
          {filteredCards.map((card) => (
            <CardItem
              key={card.id}
              {...card}
            />
          ))}
        </div>
      )}
    </>
  );
}