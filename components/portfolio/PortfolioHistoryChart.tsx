"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  currentValue: number;
};

export default function PortfolioHistoryChart({
  currentValue,
}: Props) {
  const data = [
    { day: "Lun", value: currentValue * 0.91 },
    { day: "Mar", value: currentValue * 0.93 },
    { day: "Mié", value: currentValue * 0.95 },
    { day: "Jue", value: currentValue * 0.97 },
    { day: "Vie", value: currentValue * 0.99 },
    { day: "Hoy", value: currentValue },
  ];

  return (
    <section
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-8
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">
            Evolución del Portfolio
          </h2>

          <p className="mt-2 text-zinc-400">
            Histórico del valor estimado de tu colección.
          </p>
        </div>

        <div
          className="
          rounded-xl
          bg-green-500/10
          px-4
          py-2
          text-sm
          font-bold
          text-green-400
          "
        >
          €{currentValue.toFixed(2)}
        </div>
      </div>

      <div className="mt-8 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="portfolioGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#8b5cf6"
                  stopOpacity={0.8}
                />

                <stop
                  offset="100%"
                  stopColor="#8b5cf6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#27272a"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="day"
              stroke="#71717a"
            />

            <YAxis
              stroke="#71717a"
            />

            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 12,
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div
        className="
        mt-6
        flex
        items-center
        justify-between
        rounded-2xl
        bg-white/5
        p-5
        "
      >
        <div>
          <p className="text-sm text-zinc-400">
            Tendencia
          </p>

          <p className="mt-1 text-xl font-black text-green-400">
            Positiva
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-400">
            Variación semanal
          </p>

          <p className="mt-1 text-xl font-black text-cyan-400">
            +9%
          </p>
        </div>
      </div>
    </section>
  );
}