"use client";

import { useEffect, useMemo, useState } from "react";

import CardItem from "@/components/gallery/CardItem";
import GalleryHeader from "@/components/gallery/GalleryHeader";

type Card = {
  id: string;
  playerName: string;
  club: string | null;
  scarcity: string;
  averageScore: number | null;
  marketValue: number | null;
  pictureUrl: string | null;
};

export default function GalleryPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");
  const [sort, setSort] = useState("value");

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setLoading(false);
      });
  }, []);

  const filteredCards = useMemo(() => {
    const filtered = cards.filter((card) => {
      const matchesSearch =
        card.playerName.toLowerCase().includes(search.toLowerCase()) ||
        (card.club ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesRarity = rarity === "all" || card.scarcity === rarity;

      return matchesSearch && matchesRarity;
    });

    filtered.sort((a, b) => {
      switch (sort) {
        case "value":
          return (b.marketValue ?? 0) - (a.marketValue ?? 0);

        case "aa":
          return (b.averageScore ?? 0) - (a.averageScore ?? 0);

        case "name":
          return a.playerName.localeCompare(b.playerName);

        default:
          return 0;
      }
    });

    return filtered;
  }, [cards, search, rarity, sort]);

  const galleryValue = cards.reduce(
    (sum, card) => sum + (card.marketValue ?? 0),
    0,
  );

  const average =
    cards.length === 0
      ? 0
      : cards.reduce((sum, card) => sum + (card.averageScore ?? 0), 0) /
        cards.length;

  return (
    <>
      <GalleryHeader
        totalCards={cards.length}
        galleryValue={galleryValue}
        average={average}
      />

      <div className="mb-8 flex flex-col gap-4 lg:flex-row">
        <input
          placeholder="Buscar jugador o club..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-violet-700/30 bg-[#181530] px-5 py-3 text-white outline-none"
        />

        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className="rounded-xl border border-violet-700/30 bg-[#181530] px-5 py-3 text-white"
        >
          <option value="all">Todas</option>
          <option value="limited">Limited</option>
          <option value="rare">Rare</option>
          <option value="super_rare">Super Rare</option>
          <option value="unique">Unique</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-violet-700/30 bg-[#181530] px-5 py-3 text-white"
        >
          <option value="value">Mayor valor</option>
          <option value="aa">Mayor AA</option>
          <option value="name">Nombre</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-xl text-white">Cargando cartas...</div>
      ) : filteredCards.length === 0 ? (
        <div className="rounded-3xl border border-violet-700/30 bg-[#181530] p-12 text-center">
          <h2 className="text-2xl font-bold text-white">No hay cartas</h2>

          <p className="mt-3 text-zinc-400">
            Sincroniza tu cuenta de Sorare para empezar.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredCards.map((card) => (
            <CardItem
              key={card.id}
              playerName={card.playerName}
              club={card.club}
              pictureUrl={card.pictureUrl}
              scarcity={card.scarcity}
              marketValue={card.marketValue}
              averageScore={card.averageScore}
            />
          ))}
        </div>
      )}
    </>
  );
}
