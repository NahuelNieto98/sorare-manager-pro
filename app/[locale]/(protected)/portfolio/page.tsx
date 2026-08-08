"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  ShoppingCart,
  Trophy,
} from "lucide-react";

type PortfolioData = {
  galleryValue: number;
  average: number;
  totalCards: number;

  totalBought: number;
  totalSold: number;

  profit: number;
  roi: number;

  recoveredCapital: number;
  portfolioHealth: string;
  investmentStatus: string;

  scarcity: {
    limited: number;
    rare: number;
    superRare: number;
    unique: number;
  };

  topCards: {
    id: string;
    playerName: string;
    club: string | null;
    rarity: string;
    marketValue: number | null;
    averageScore: number | null;
    pictureUrl: string | null;
  }[];
};

export default function PortfolioPage() {
  const [data, setData] =
    useState<PortfolioData | null>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        Cargando Portfolio...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section
        className="
        rounded-3xl
        border
        border-white/10
        bg-gradient-to-br
        from-[#22194A]
        via-[#17132F]
        to-[#100C21]
        p-10
        "
      >
        <h1 className="text-5xl font-black text-white">
          Portfolio
        </h1>

        <p className="mt-3 text-zinc-400">
          Resumen completo de tu patrimonio en Sorare.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <Card
            icon={<Wallet size={22} />}
            title="Valor"
            value={`€${data.galleryValue.toFixed(2)}`}
          />

          <Card
            icon={<TrendingUp size={22} />}
            title="ROI"
            value={`${data.roi.toFixed(2)}%`}
          />

          <Card
            icon={<ShoppingCart size={22} />}
            title="Beneficio"
            value={`€${data.profit.toFixed(2)}`}
          />

          <Card
            icon={<Trophy size={22} />}
            title="Cartas"
            value={data.totalCards.toString()}
          />
        </div>
      </section>

      <section
        className="
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-8
        "
      >
        <h2 className="text-2xl font-black text-white">
          Top cartas
        </h2>

        <div className="mt-6 space-y-4">
          {data.topCards.map((card) => (
            <div
              key={card.id}
              className="
              flex
              items-center
              justify-between
              rounded-2xl
              bg-white/5
              p-4
              "
            >
              <div className="flex items-center gap-4">
                {card.pictureUrl ? (
                  <img
                    src={card.pictureUrl}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-white/10" />
                )}

                <div>
                  <p className="font-bold text-white">
                    {card.playerName}
                  </p>

                  <p className="text-sm text-zinc-400">
                    {card.club ?? "-"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-black text-green-400">
                  €{(card.marketValue ?? 0).toFixed(2)}
                </p>

                <p className="text-sm text-zinc-400">
                  AA {card.averageScore ?? "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-white/10
      bg-white/5
      p-6
      "
    >
      <div className="flex items-center gap-3 text-violet-300">
        {icon}

        <span className="text-sm text-zinc-400">
          {title}
        </span>
      </div>

      <h3 className="mt-5 text-3xl font-black text-white">
        {value}
      </h3>
    </div>
  );
}