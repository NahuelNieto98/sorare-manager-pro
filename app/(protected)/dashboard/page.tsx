"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import StatCard from "@/components/dashboard/StatCard";
import GalleryChart from "@/components/charts/GalleryChart";

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
};

export default function DashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const res = await fetch("/api/dashboard");
    const json = await res.json();
    setData(json);
  }

  async function syncGallery() {
    setSyncing(true);

    try {
      const res = await fetch("/api/sync-gallery", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Error al sincronizar");
        return;
      }

      await loadDashboard();

      router.refresh();

      alert("Galería sincronizada");
    } finally {
      setSyncing(false);
    }
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-2xl text-white">
        Cargando Dashboard...
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>

          <p className="mt-2 text-zinc-400">Resumen de tu cuenta Sorare.</p>
        </div>

        <button
          onClick={syncGallery}
          disabled={syncing}
          className="rounded-xl bg-purple-600 px-6 py-3 font-bold text-white hover:bg-purple-500 disabled:opacity-50"
        >
          {syncing ? "Sincronizando..." : "Sincronizar galería"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Valor galería"
          value={`€${data.galleryValue.toFixed(2)}`}
          subtitle={`${data.totalCards} cartas`}
        />

        <StatCard
          title="Comprado"
          value={`€${data.totalBought.toFixed(2)}`}
          subtitle="Invertido"
        />

        <StatCard
          title="Vendido"
          value={`€${data.totalSold.toFixed(2)}`}
          subtitle="Recuperado"
        />

        <StatCard
          title="Beneficio"
          value={`€${data.profit.toFixed(2)}`}
          subtitle={data.profit >= 0 ? "En positivo" : "En negativo"}
        />

        <StatCard
          title="ROI"
          value={`${data.roi.toFixed(2)}%`}
          subtitle="Rentabilidad"
        />

        <StatCard
          title="Media AA"
          value={String(data.average)}
          subtitle="Últimos partidos"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <GalleryChart />
        </div>

        <div className="rounded-2xl border border-purple-900 bg-[#17112F] p-6">
          <h2 className="mb-6 text-xl font-bold text-white">
            Distribución de la galería
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total cartas</span>
              <span>{data.totalCards}</span>
            </div>

            <div className="flex justify-between">
              <span>Limited</span>
              <span>{data.scarcity.limited}</span>
            </div>

            <div className="flex justify-between">
              <span>Rare</span>
              <span>{data.scarcity.rare}</span>
            </div>

            <div className="flex justify-between">
              <span>Super Rare</span>
              <span>{data.scarcity.superRare}</span>
            </div>

            <div className="flex justify-between">
              <span>Unique</span>
              <span>{data.scarcity.unique}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
