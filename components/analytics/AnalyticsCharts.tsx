"use client";

import { useTranslations } from "next-intl";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  transactionsHistory: {
    date: string;
    bought: number;
    sold: number;
  }[];

  buySellData: {
    name: string;
    value: number;
  }[];
};

export default function AnalyticsCharts({
  transactionsHistory,
  buySellData,
}: Props) {
  const t = useTranslations("analytics");

  return (
    <div className="grid gap-8 xl:grid-cols-2">

      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-8
        "
      >

        <h2 className="text-2xl font-black text-white">
          {t("roiEvolution")}
        </h2>

        <p className="mt-2 text-zinc-400">
          {t("sinceStart")}
        </p>

        <div className="mt-8 h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart data={transactionsHistory}>

              <CartesianGrid
                stroke="#27272a"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="date"
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
                dataKey="bought"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.2}
              />

              <Area
                type="monotone"
                dataKey="sold"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>


      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-8
        "
      >

        <h2 className="text-2xl font-black text-white">
          {t("buySell")}
        </h2>

        <p className="mt-2 text-zinc-400">
          {t("subtitle")}
        </p>

        <div className="mt-8 h-[320px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={buySellData}>

              <CartesianGrid
                stroke="#27272a"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="name"
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

              <Bar
                dataKey="value"
                fill="#8b5cf6"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}