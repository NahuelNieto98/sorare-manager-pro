"use client";

import { useTranslations } from "next-intl";
import { calculateMarketScore } from "@/lib/market-score";

type Props = {
  item: {
    id: string;
    price: number;
    Card: {
      playerName: string;
      club: string | null;
      scarcity: string;
      marketValue: number | null;
      pictureUrl: string | null;
    };
  };
};

export default function MarketOpportunityCard({ item }: Props) {
  const t = useTranslations("market");

  const card = item.Card;

  const score = calculateMarketScore(card, item.price);

  const opportunity = card.marketValue
    ? ((card.marketValue - item.price) / item.price) * 100
    : 0;

  const label =
    score >= 80
      ? {
          text: `🟢 ${t("buy")}`,
          style: "bg-green-500/20 text-green-400",
        }
      : score >= 60
        ? {
            text: `🟡 ${t("watch")}`,
            style: "bg-yellow-500/20 text-yellow-400",
          }
        : {
            text: `🔴 ${t("expensive")}`,
            style: "bg-red-500/20 text-red-400",
          };

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-4
        transition
        hover:border-violet-500/30
      "
    >
      {card.pictureUrl && (
        <div
          className="
            flex
            h-56
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            bg-black/20
          "
        >
          <img
            src={card.pictureUrl}
            alt={card.playerName}
            className="
              h-full
              w-full
              object-contain
            "
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <h3
          className="
            truncate
            text-lg
            font-black
            text-white
          "
        >
          {card.playerName}
        </h3>

        <span
          className={`
            shrink-0
            rounded-lg
            px-2.5
            py-1
            text-[11px]
            font-bold
            ${label.style}
          `}
        >
          {label.text}
        </span>
      </div>

      <p className="mt-1 truncate text-sm text-zinc-400">
        {card.club ?? "-"}
      </p>

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-3
        "
      >
        <Info
          title={t("rarity")}
          value={card.scarcity}
        />

        <Info
          title={t("score")}
          value={`${score}/100`}
        />

        <Info
          title={t("price")}
          value={`€${item.price.toFixed(2)}`}
        />

        <Info
          title={t("value")}
          value={`€${(card.marketValue ?? 0).toFixed(2)}`}
        />
      </div>

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          rounded-xl
          bg-green-500/10
          px-4
          py-3
        "
      >
        <div>
          <p className="text-xs text-zinc-500">
            {t("opportunity")}
          </p>

          <p className="text-xl font-black text-green-400">
            +{opportunity.toFixed(1)}%
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-zinc-500">
            {t("score")}
          </p>

          <p className="text-lg font-black text-white">
            {score}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        bg-white/5
        px-3
        py-2.5
      "
    >
      <p className="text-[11px] text-zinc-500">
        {title}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}