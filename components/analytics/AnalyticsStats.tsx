"use client";

import { useTranslations } from "next-intl";

type Props = {
  roi: number;
  profit: number;
  totalBought: number;
  totalSold: number;
  recoveredCapital: number;
};

export default function AnalyticsStats({
  roi,
  profit,
  totalBought,
  totalSold,
  recoveredCapital,
}: Props) {
  const t = useTranslations("analytics");

  return (
    <div
      className="
      grid
      grid-cols-1
      gap-5
      md:grid-cols-3
      xl:grid-cols-5
      "
    >
      <Card
        title={t("roi")}
        value={`${roi.toFixed(2)}%`}
        color={
          roi >= 0
            ? "text-green-400"
            : "text-red-400"
        }
      />

      <Card
        title={t("profit")}
        value={`€${profit.toFixed(2)}`}
        color={
          profit >= 0
            ? "text-green-400"
            : "text-red-400"
        }
      />

      <Card
        title={t("bought")}
        value={`€${totalBought.toFixed(2)}`}
        color="text-red-400"
      />

      <Card
        title={t("sold")}
        value={`€${totalSold.toFixed(2)}`}
        color="text-green-400"
      />

      <Card
        title={t("recovered")}
        value={`${recoveredCapital.toFixed(1)}%`}
        color="text-cyan-400"
      />
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-6
      "
    >
      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h3
        className={`
        mt-3
        text-3xl
        font-black
        ${color}
        `}
      >
        {value}
      </h3>
    </div>
  );
}