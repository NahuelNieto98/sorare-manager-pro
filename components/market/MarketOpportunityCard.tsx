"use client";

import { useTranslations } from "next-intl";
import { calculateMarketScore } from "@/lib/market-score";

type AuctionCard = {
  id: string;
  playerName: string;
  club: string | null;
  scarcity: string;
  marketValue: number | null;
  pictureUrl: string | null;
};

type Props = {
  item: {
    id: string;
    price: number;
    type?: string;
    auctionId?: string;
    endDate?: string;
    lotValue?: number;
    lotCards?: AuctionCard[];
    Card: AuctionCard;
  };
};

export default function MarketOpportunityCard({
  item,
}: Props) {
  const t = useTranslations("market");

  const card = item.Card;

  const isAuction = item.type === "AUCTION";

  const score = calculateMarketScore(
    card,
    item.price,
    isAuction
      ? {
          lotValue: item.lotValue,
          lotCards: item.lotCards,
        }
      : undefined
  );

  const value = isAuction
    ? item.lotValue ?? card.marketValue ?? 0
    : card.marketValue ?? 0;

  const opportunity =
    item.price > 0
      ? isAuction
        ? ((value - item.price) / value) * 100
        : ((value - item.price) / item.price) * 100
      : 0;

  const potentialProfit =
    value - item.price;

  const rarityKey =
    card.scarcity === "super_rare"
      ? "superRare"
      : card.scarcity;

  const label =
    opportunity > 0 && score >= 75
      ? {
          text: `🟢 ${t("buy")}`,
          style:
            "bg-green-500/20 text-green-400",
        }
      : opportunity > 0 && score >= 55
        ? {
            text: `🟡 ${t("watch")}`,
            style:
              "bg-yellow-500/20 text-yellow-400",
          }
        : {
            text: `🔴 ${t("expensive")}`,
            style:
              "bg-red-500/20 text-red-400",
          };

  const auctionCards =
    item.lotCards ?? [];

  const formattedEndDate =
    item.endDate
      ? new Date(
          item.endDate
        ).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

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
        duration-300
        hover:-translate-y-1
        hover:border-violet-500/40
      "
    >
      {isAuction ? (
        <>
          <div
            className="
              mb-4
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <span
              className="
                rounded-lg
                bg-violet-500/20
                px-3
                py-1.5
                text-[11px]
                font-black
                uppercase
                tracking-wider
                text-violet-300
              "
            >
              🔥 Subasta
            </span>

            <span
              className={`
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

          <div
            className="
              rounded-2xl
              border
              border-white/5
              bg-black/20
              p-3
            "
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Lote · {auctionCards.length} cartas
              </p>

              {formattedEndDate && (
                <p className="text-xs font-bold text-orange-400">
                  ⏱️ {formattedEndDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {auctionCards.map(
                (auctionCard) => (
                  <div
                    key={auctionCard.id}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-white/5
                      p-2
                    "
                  >
                    {auctionCard.pictureUrl ? (
                      <img
                        src={
                          auctionCard.pictureUrl
                        }
                        alt={
                          auctionCard.playerName
                        }
                        className="
                          h-14
                          w-10
                          rounded-lg
                          object-contain
                        "
                      />
                    ) : (
                      <div
                        className="
                          h-14
                          w-10
                          rounded-lg
                          bg-white/5
                        "
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-white">
                        {auctionCard.playerName}
                      </p>

                      <p className="truncate text-xs text-zinc-500">
                        {auctionCard.club ?? "-"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-white">
                        €{(
                          auctionCard.marketValue ??
                          0
                        ).toFixed(2)}
                      </p>

                      <p className="text-[10px] text-zinc-500">
                        Valor
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      ) : (
        <>
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

          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
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

              <p className="mt-1 truncate text-sm text-zinc-400">
                {card.club ?? "-"}
              </p>
            </div>

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
        </>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Info
          title={isAuction ? "Cartas" : t("rarity")}
          value={
            isAuction
              ? `${auctionCards.length} cartas`
              : t(
                  `rarities.${rarityKey}`
                )
          }
        />

        <Info
          title={t("score")}
          value={`${score}/100`}
        />

        <Info
          title={
            isAuction
              ? "Precio actual"
              : t("price")
          }
          value={`€${item.price.toFixed(2)}`}
        />

        <Info
          title={
            isAuction
              ? "Valor del lote"
              : t("value")
          }
          value={`€${value.toFixed(2)}`}
        />
      </div>

      <div
        className="
          mt-4
          rounded-2xl
          border
          border-emerald-500/10
          bg-emerald-500/10
          p-4
        "
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {t("opportunity")}
            </p>

            <p
              className={`
                mt-1
                text-3xl
                font-black
                ${
                  opportunity >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              `}
            >
              {opportunity >= 0
                ? "+"
                : ""}
              {opportunity.toFixed(1)}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-zinc-500">
              {t("potentialProfit")}
            </p>

            <p
              className={`
                mt-1
                text-lg
                font-black
                ${
                  potentialProfit >= 0
                    ? "text-white"
                    : "text-red-400"
                }
              `}
            >
              {potentialProfit >= 0
                ? "+"
                : "-"}
              €{Math.abs(
                potentialProfit
              ).toFixed(2)}
            </p>
          </div>
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