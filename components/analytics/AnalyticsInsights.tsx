"use client";

import { useTranslations } from "next-intl";

import {
  TrendingUp,
  Wallet,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

type Props = {
  roi: number;
  profit: number;
  totalBought: number;
  totalSold: number;
  galleryValue: number;
};

export default function AnalyticsInsights({
  roi,
  profit,
  totalBought,
  totalSold,
  galleryValue,
}: Props) {
  const t = useTranslations("analytics");

  const recovered =
    totalBought === 0
      ? 0
      : (totalSold / totalBought) * 100;

  const roiColor =
    roi >= 20
      ? "text-green-400"
      : roi >= 0
        ? "text-yellow-400"
        : "text-red-400";

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

      <h2 className="text-2xl font-black text-white">
        {t("roiEvolution")}
      </h2>

      <p className="mt-2 text-zinc-400">
        {t("sinceStart")}
      </p>

      <div className="mt-8 space-y-5">

        <Insight
          icon={<TrendingUp size={22} />}
          color={roiColor}
          title={t("roi")}
          description={`${roi.toFixed(2)}%`}
        />

        <Insight
          icon={<Wallet size={22} />}
          color="text-cyan-400"
          title={t("recovered")}
          description={`${recovered.toFixed(1)}%`}
        />

        <Insight
          icon={<ShieldCheck size={22} />}
          color="text-green-400"
          title={t("profitability")}
          description={`€${galleryValue.toFixed(2)}`}
        />

        <Insight
          icon={<AlertTriangle size={22} />}
          color="text-yellow-400"
          title={t("distribution")}
          description={
            `€${totalBought.toFixed(2)} / €${totalSold.toFixed(2)}`
          }
        />

      </div>

    </div>
  );
}

function Insight({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex gap-4">

      <div
        className={`
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-xl
        bg-white/5
        ${color}
        `}
      >
        {icon}
      </div>

      <div>

        <h3 className="font-bold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          {description}
        </p>

      </div>

    </div>
  );
}