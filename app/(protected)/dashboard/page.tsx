"use client";

import { useEffect, useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import PortfolioCard from "@/components/dashboard/PortfolioCard";
import GalleryChart from "@/components/charts/GalleryChart";
import QuickStats from "@/components/dashboard/QuickStats";
import TopCards from "@/components/dashboard/TopCards";
import MarketSummary from "@/components/dashboard/MarketSummary";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ScoutCard from "@/components/dashboard/ScoutCard";

type DashboardData = {
  galleryValue: number;
  average: number;
  totalCards: number;

  totalBought: number;
  totalSold: number;
  profit: number;
  roi: number;

  scarcity: {
    limited: number;
    rare: number;
    superRare: number;
    unique: number;
  };

  topCards: {
    playerName: string;
    marketValue: number | null;
  }[];

  recentTransactions: {
    id: string;
    type: string;
    playerName: string;
    rarity: string;
    price: number;
  }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-2xl text-white">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-extrabold text-white">Dashboard</h1>

        <p className="mt-3 text-lg text-zinc-400">
          Bienvenido a Sorare Manager Pro.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <StatCard
          title="Valor galería"
          value={`€${data.galleryValue.toFixed(2)}`}
          subtitle={`${data.totalCards} cartas`}
        />

        <StatCard
          title="ROI"
          value={`${data.roi.toFixed(2)}%`}
          subtitle="Rentabilidad"
        />

        <StatCard
          title="Premios"
          value={`€${data.totalSold.toFixed(2)}`}
          subtitle="Ventas"
        />

        <StatCard
          title="Essence"
          value={data.average.toFixed(1)}
          subtitle="AA Medio"
        />
      </div>

      <PortfolioCard
        galleryValue={data.galleryValue}
        profit={data.profit}
        roi={data.roi}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <GalleryChart />
        </div>

        <QuickStats totalCards={data.totalCards} average={data.average} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TopCards cards={data.topCards} />

        <MarketSummary bought={data.totalBought} sold={data.totalSold} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentTransactions transactions={data.recentTransactions} />

        <ScoutCard />
      </div>
    </div>
  );
}
