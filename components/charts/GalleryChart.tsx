"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const data = [
  { day: "Lun", value: 2100 },
  { day: "Mar", value: 2140 },
  { day: "Mié", value: 2250 },
  { day: "Jue", value: 2210 },
  { day: "Vie", value: 2380 },
  { day: "Sáb", value: 2420 },
  { day: "Dom", value: 2510 },
];

export default function GalleryChart() {
  return (
    <div className="rounded-2xl border border-purple-900 bg-[#17112F] p-6">
      <h2 className="text-2xl font-bold text-white">Evolución de la galería</h2>

      <p className="mt-2 text-zinc-400">
        Valor estimado durante los últimos 7 días.
      </p>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="day" stroke="#777" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
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
