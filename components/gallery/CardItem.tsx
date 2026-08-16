"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  id: string;
  playerName: string;
  club: string | null;
  position: string | null;
  pictureUrl: string | null;
  scarcity: string;
  marketValue: number | null;
  purchasePrice?: number | null;
  purchaseDate?: string | null;
  season: number;
  averageScore: number | null;
  l5Score: number | null;
  l10Score: number | null;
  l15Score: number | null;
  l40Score: number | null;
};

function scoreColor(value: number | null) {
  if (value === null) return "text-white/50";
  if (value >= 60) return "text-emerald-400";
  if (value >= 40) return "text-yellow-400";

  return "text-red-400";
}

export default function CardItem({
  id,
  playerName,
  club,
  position,
  pictureUrl,
  scarcity,
  marketValue,
  purchasePrice,
  purchaseDate,
  season,
  averageScore,
  l5Score,
  l10Score,
  l15Score,
  l40Score,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("card");

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
      "
    >
      <div
        className="
          relative
          h-64
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            inset-x-10
            top-8
            h-32
            rounded-full
            bg-violet-500/20
            blur-3xl
          "
        />

        {pictureUrl ? (
          <img
            src={pictureUrl}
            alt={playerName}
            className="
              relative
              z-10
              h-full
              w-full
              object-contain
              scale-[1.04]
              transition
              duration-500
              group-hover:scale-110
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/40">
            {t("noImage")}
          </div>
        )}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#100c22]
            via-transparent
            to-transparent
          "
        />

        <div
          className="
            absolute
            right-3
            top-3
            z-20
            rounded-2xl
            border
            border-white/10
            bg-black/50
            px-3
            py-2
            text-center
            backdrop-blur
          "
        >
          <p className="text-[9px] font-bold tracking-[0.2em] text-white/40">
            AA15
          </p>

          <p className="font-mono text-2xl font-black text-white">
            {averageScore !== null
              ? Math.round(averageScore)
              : "-"}
          </p>
        </div>
      </div>

      <div className="p-4">
        <h2
          className="
            truncate
            text-lg
            font-bold
            tracking-tight
            text-white
          "
        >
          {playerName}
        </h2>

        <p
          className="
            mt-1
            truncate
            text-xs
            font-medium
            uppercase
            tracking-wide
            text-white/40
          "
        >
          {club ?? t("noClub")}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className="
              rounded-full
              bg-violet-500/20
              px-3
              py-1
              text-xs
              font-bold
              text-violet-300
            "
          >
            {position
              ? t(`positions.${position.toLowerCase()}`)
              : "—"}
          </span>

          <span
            className="
              rounded-full
              bg-white/10
              px-3
              py-1
              text-xs
              font-bold
              text-white/60
            "
          >
            {t(
              scarcity === "super_rare"
                ? "rarities.superRare"
                : `rarities.${scarcity}`
            )}{" "}
            · {season}
          </span>
        </div>

        <div
          className="
            mt-4
            grid
            grid-cols-4
            gap-2
            rounded-2xl
            bg-black/20
            p-3
            text-center
          "
        >
          {[
            ["L5", l5Score],
            ["L10", l10Score],
            ["L15", l15Score],
            ["L40", l40Score],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                {label}
              </p>

              <p
                className={`
                  mt-1
                  font-mono
                  text-base
                  font-black
                  ${scoreColor(value as number | null)}
                `}
              >
                {value ?? "-"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">

            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                Precio compra
              </p>

              <p className="mt-1 text-sm font-black text-white">
                {purchasePrice != null
                  ? `€${purchasePrice.toFixed(2)}`
                  : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                Precio actual
              </p>

              <p className="mt-1 text-sm font-black text-emerald-400">
                {marketValue !== null
                  ? `€${marketValue.toFixed(2)}`
                  : "—"}
              </p>
            </div>

          </div>

          <Link
            href={`/${locale}/gallery/${id}`}
            className="
              block
              w-full
              rounded-xl
              bg-violet-600
              px-4
              py-2.5
              text-center
              text-xs
              font-bold
              text-white
              transition
              hover:bg-violet-500
              md:py-3
              md:text-sm
            "
          >
            {t("viewCard")}
          </Link>
        </div>

      </div>
    </div>
  );
}