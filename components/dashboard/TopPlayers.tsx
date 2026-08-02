"use client";

import { useEffect, useState } from "react";

type Card = {
  id: string;
  playerName: string;
  club: string | null;
  pictureUrl: string | null;
  averageScore: number | null;
  marketValue: number | null;
};

export default function TopPlayers() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {
        data.sort(
          (a: Card, b: Card) => (b.marketValue ?? 0) - (a.marketValue ?? 0),
        );

        setCards(data.slice(0, 5));
      });
  }, []);

  return (
    <div className="rounded-3xl border border-purple-900 bg-[#17112F] p-8">
      <h2 className="text-2xl font-bold text-white">Top cartas</h2>

      <div className="mt-8 space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between rounded-xl bg-[#221A40] p-4"
          >
            <div className="flex items-center gap-4">
              {card.pictureUrl ? (
                <img
                  src={card.pictureUrl}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-zinc-700" />
              )}

              <div>
                <p className="font-bold text-white">{card.playerName}</p>

                <p className="text-sm text-zinc-400">{card.club}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-green-400">
                €{card.marketValue?.toFixed(0)}
              </p>

              <p className="text-sm text-purple-400">AA {card.averageScore}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
