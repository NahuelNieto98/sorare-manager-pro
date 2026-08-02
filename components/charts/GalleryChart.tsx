"use client";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Snapshot = {
  id: string;
  galleryValue: number;
  roi: number;
  profit: number;
  createdAt: string;
};

export default function GalleryChart() {
  const [history, setHistory] = useState<Snapshot[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const res = await fetch("/api/portfolio-history");

    const data = await res.json();

    const formatted = data.map((item: Snapshot) => ({
      ...item,
      day: new Date(item.createdAt).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      }),
    }));

    setHistory(formatted);
  }

  return (
    <div className="rounded-3xl border border-violet-700/30 bg-gradient-to-br from-[#181530] via-[#221B45] to-[#141127] p-6">
      <h2 className="text-2xl font-bold text-white">Evolución del Portfolio</h2>

      <p className="mt-2 text-zinc-400">Valor histórico de tu colección.</p>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <XAxis dataKey="day" stroke="#888" />

            <YAxis stroke="#888" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="galleryValue"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.25}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
