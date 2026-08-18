"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useTranslations } from "next-intl";

type PortfolioPoint = {
  date: string;
  roi: number;
};

type Props = {
  transactionsHistory: any[];
  buySellData: {
    name: string;
    value: number;
  }[];
  portfolioHistory?: PortfolioPoint[];
};

export default function AnalyticsCharts({
  portfolioHistory = [],
}: Props) {
  const t = useTranslations("analytics");

  const data = portfolioHistory.map((item) => {
    const date = new Date(item.date);

    return {
      date: date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      }),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fullDate: date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      roi: Number(item.roi.toFixed(2)),
    };
  });

  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-8
      "
    >
      <div>
        <h2 className="text-2xl font-black text-white">
          {t("roiEvolution")}
        </h2>

        <p className="mt-2 text-zinc-400">
          {t("sinceStart")}
        </p>
      </div>

      <div className="mt-8 h-[380px] w-full">
        {data.length < 2 ? (
          <div className="flex h-full items-center justify-center text-center text-zinc-500">
            <p>
              Todavía no hay suficientes datos para mostrar la evolución.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{
                  fill: "#a1a1aa",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#a1a1aa",
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                contentStyle={{
                  background: "#17112F",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                labelFormatter={(_, payload) => {
                  const point = payload?.[0]?.payload;

                  return point?.fullDate ?? "";
                }}
                formatter={(_, __, item) => [
                  `${Number(item?.payload?.roi ?? 0).toFixed(2)}%`,
                  "ROI",
                ]}
              />

              <Line
                type="monotone"
                dataKey="roi"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#a855f7",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
