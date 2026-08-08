"use client";

import { Layers3, Euro, BarChart3, Gem } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  totalCards: number;
  galleryValue: number;
  average: number;
};

export default function GalleryHeader({
  totalCards,
  galleryValue,
  average,
}: Props) {
  const t = useTranslations("galleryHeader");

  const stats = [
    {
      title: t("cards"),
      value: totalCards.toString(),
      icon: Layers3,
      color: "text-violet-300",
      bg: "bg-violet-500/10",
    },
    {
      title: t("value"),
      value: `€${galleryValue.toFixed(2)}`,
      icon: Euro,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: t("average"),
      value: average.toFixed(1),
      icon: BarChart3,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      title: t("collection"),
      value: "PRO",
      icon: Gem,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <section className="mb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">
          Gallery
        </h1>

        <p className="mt-2 text-zinc-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-3xl border border-white/10 bg-[#17112F] p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-white">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`rounded-2xl p-4 ${stat.bg}`}
                >
                  <Icon
                    className={stat.color}
                    size={28}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}