"use client";

import StatCard from "@/components/dashboard/StatCard";
import GalleryChart from "@/components/charts/GalleryChart";

export default function AnalyticsPage() {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">Analytics</h1>

        <p className="mt-2 text-zinc-400">
          Analiza el rendimiento de tu galería y tus inversiones.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="ROI" value="+18.42%" subtitle="Rentabilidad" />

        <StatCard
          title="Beneficio"
          value="€356.90"
          subtitle="Desde el inicio"
        />

        <StatCard title="Comprado" value="€1,924" subtitle="Invertido" />

        <StatCard title="Vendido" value="€2,281" subtitle="Recuperado" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <GalleryChart />
        </div>

        <div className="rounded-3xl border border-violet-700/30 bg-gradient-to-br from-[#181530] via-[#221B45] to-[#141127] p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">Distribución</h2>

          <div className="space-y-5">
            <div className="flex justify-between">
              <span className="text-zinc-400">Limited</span>
              <span className="font-bold text-white">87</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Rare</span>
              <span className="font-bold text-white">32</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Super Rare</span>
              <span className="font-bold text-white">8</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Unique</span>
              <span className="font-bold text-white">1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-violet-700/30 bg-gradient-to-br from-[#181530] via-[#221B45] to-[#141127] p-8">
        <h2 className="text-2xl font-bold text-white">Próximamente</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/5 p-6">📈 Evolución del ROI</div>

          <div className="rounded-2xl bg-white/5 p-6">
            💰 Beneficio por jugador
          </div>

          <div className="rounded-2xl bg-white/5 p-6">🏆 Ranking de cartas</div>

          <div className="rounded-2xl bg-white/5 p-6">📊 Compras vs Ventas</div>
        </div>
      </div>
    </>
  );
}
