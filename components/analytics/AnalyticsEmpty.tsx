"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function AnalyticsEmpty() {
  const t = useTranslations("analytics");
  const locale = useLocale();

  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-10
      text-center
      "
    >
      <div className="text-5xl">
        📊
      </div>

      <h2
        className="
        mt-5
        text-3xl
        font-black
        text-white
        "
      >
        {t("title")}
      </h2>

      <p
        className="
        mx-auto
        mt-4
        max-w-xl
        text-zinc-400
        "
      >
        {t("subtitle")}
      </p>

      <Link
        href={`/${locale}/connect-sorare`}
        className="
        mt-8
        inline-flex
        rounded-xl
        bg-purple-600
        px-8
        py-3
        font-bold
        text-white
        transition
        hover:bg-purple-500
        "
      >
        🔗 Sorare
      </Link>
    </div>
  );
}