"use client";

import { useEffect, useMemo, useState } from "react";
import CardItem from "@/components/gallery/CardItem";

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

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setLoading(false);
      });
  }, []);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        card.playerName.toLowerCase().includes(search.toLowerCase()) ||
        (card.club ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesRarity = rarity === "all" || card.scarcity === rarity;

      return matchesSearch && matchesRarity;
    });
  }, [cards, search, rarity]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">Gallery</h1>

        <p className="mt-2 text-zinc-400">
          Gestiona toda tu colección de Sorare.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row">
        <input
          placeholder="Buscar jugador o club..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-purple-900 bg-[#17112F] px-5 py-3 text-white outline-none"
        />

        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className="rounded-xl border border-purple-900 bg-[#17112F] px-5 py-3 text-white"
        >
          <option value="all">Todas</option>
          <option value="limited">Limited</option>
          <option value="rare">Rare</option>
          <option value="super_rare">Super Rare</option>
          <option value="unique">Unique</option>
        </select>
      </div>

      {loading ? (
        <div className="text-white text-xl">Cargando cartas...</div>
      ) : filteredCards.length === 0 ? (
        <div className="rounded-2xl border border-purple-900 bg-[#17112F] p-12 text-center">
          <h2 className="text-2xl font-bold text-white">No hay cartas</h2>

          <p className="mt-3 text-zinc-400">
            Conecta tu cuenta de Sorare para importar tu galería.
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
