"use client";

import { useTranslations } from "next-intl";
import { calculateMarketScore } from "@/lib/market-score";

type AuctionCard = {
  id: string;
  playerName: string;
  club: string | null;
  scarcity: string;
  marketValue: number | null;
};

type MarketItem = {
  id: string;
  price: number;
  type?: string;
  auctionId?: string;
  endDate?: string;
  lotValue?: number;
  lotCards?: AuctionCard[];
  Card: AuctionCard;
  score: number;
};

type Props = {
  cards: MarketItem[];
};

export default function MarketTable({
  cards,
}: Props) {
  const t = useTranslations("market");

  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
      "
    >
      <div className="p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">
              {t("complete")}
            </h2>

            <p className="mt-2 text-zinc-400">
              {t("completeDescription")}
            </p>
          </div>

          <span
            className="
              rounded-full
              border
              border-violet-500/20
              bg-violet-500/10
              px-3
              py-1
              text-xs
              font-bold
              text-violet-300
            "
          >
            {cards.length}
          </span>
        </div>
      </div>

      {cards.length === 0 ? (
        <div
          className="
            border-t
            border-white/5
            p-10
            text-center
            text-zinc-500
          "
        >
          {t("noResults")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-zinc-400">
                  Tipo
                </th>

                <th className="px-6 py-4 text-left text-sm text-zinc-400">
                  {t("player")}
                </th>

                <th className="px-6 py-4 text-left text-sm text-zinc-400">
                  {t("rarity")}
                </th>

                <th className="px-6 py-4 text-left text-sm text-zinc-400">
                  {t("club")}
                </th>

                <th className="px-6 py-4 text-center text-sm text-zinc-400">
                  Cartas
                </th>

                <th className="px-6 py-4 text-right text-sm text-zinc-400">
                  {t("price")}
                </th>

                <th className="px-6 py-4 text-right text-sm text-zinc-400">
                  {t("value")}
                </th>

                <th className="px-6 py-4 text-right text-sm text-zinc-400">
                  {t("opportunity")}
                </th>

                <th className="px-6 py-4 text-right text-sm text-zinc-400">
                  {t("potentialProfit")}
                </th>

                <th className="px-6 py-4 text-center text-sm text-zinc-400">
                  {t("recommendation")}
                </th>

                <th className="px-6 py-4 text-right text-sm text-zinc-400">
                  {t("score")}
                </th>
              </tr>
            </thead>

            <tbody>
              {cards.map((item) => {
                const isAuction =
                  item.type === "AUCTION";

                const lotCards =
                  item.lotCards ?? [];

                const mainAuctionCard =
                  lotCards.length > 0
                    ? lotCards[0]
                    : item.Card;

                const score =
                  calculateMarketScore(
                    item.Card,
                    item.price,
                    isAuction
                      ? {
                          lotValue: item.lotValue,
                          lotCards: item.lotCards,
                        }
                      : undefined
                  );

                const value = isAuction
                  ? item.lotValue ??
                    item.Card.marketValue ??
                    0
                  : item.Card.marketValue ?? 0;

                const opportunity =
                  item.price > 0
                    ? isAuction
                      ? ((value - item.price) /
                          value) *
                        100
                      : ((value - item.price) /
                          item.price) *
                        100
                    : 0;

                const potentialProfit =
                  value - item.price;

                const rarityKey =
                  item.Card.scarcity ===
                  "super_rare"
                    ? "superRare"
                    : item.Card.scarcity;

                const recommendation =
                  opportunity <= 0
                    ? {
                        text: t("expensive"),
                        style:
                          "bg-red-500/10 text-red-400 border-red-500/20",
                      }
                    : score >= 75
                      ? {
                          text: t("buy"),
                          style:
                            "bg-green-500/10 text-green-400 border-green-500/20",
                        }
                      : score >= 55
                        ? {
                            text: t("watch"),
                            style:
                              "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                          }
                        : {
                            text: t("expensive"),
                            style:
                              "bg-red-500/10 text-red-400 border-red-500/20",
                          };

                const playerLabel = isAuction
                  ? `${mainAuctionCard.playerName}${
                      lotCards.length > 1
                        ? ` + ${
                            lotCards.length - 1
                          } más`
                        : ""
                    }`
                  : item.Card.playerName;

                return (
                  <tr
                    key={item.id}
                    className="
                      border-t
                      border-white/5
                      transition
                      hover:bg-white/5
                    "
                  >
                    <td className="px-6 py-5">
                      {isAuction ? (
                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-violet-500/20
                            bg-violet-500/10
                            px-3
                            py-1.5
                            text-[11px]
                            font-black
                            text-violet-300
                          "
                        >
                          🔥 SUBASTA
                        </span>
                      ) : (
                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-emerald-500/20
                            bg-emerald-500/10
                            px-3
                            py-1.5
                            text-[11px]
                            font-black
                            text-emerald-400
                          "
                        >
                          COMPRA
                        </span>
                      )}
                    </td>

                    <td
                      className="
                        px-6
                        py-5
                        font-bold
                        text-white
                      "
                    >
                      <div>
                        {playerLabel}

                        {isAuction &&
                          item.endDate && (
                            <p className="mt-1 text-xs font-normal text-orange-400">
                              ⏱️{" "}
                              {new Date(
                                item.endDate
                              ).toLocaleString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          )}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-zinc-300">
                      {t(
                        `rarities.${rarityKey}`
                      )}
                    </td>

                    <td className="px-6 py-5 text-zinc-400">
                      {isAuction
                        ? mainAuctionCard.club ??
                          "-"
                        : item.Card.club ?? "-"}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {isAuction ? (
                        <span className="font-bold text-violet-300">
                          {lotCards.length}
                        </span>
                      ) : (
                        <span className="text-zinc-500">
                          —
                        </span>
                      )}
                    </td>

                    <td
                      className="
                        px-6
                        py-5
                        text-right
                        font-black
                        text-white
                      "
                    >
                      €{item.price.toFixed(2)}
                    </td>

                    <td
                      className="
                        px-6
                        py-5
                        text-right
                        font-bold
                        text-zinc-200
                      "
                    >
                      €{value.toFixed(2)}
                    </td>

                    <td
                      className={`
                        px-6
                        py-5
                        text-right
                        font-black
                        ${
                          opportunity > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      `}
                    >
                      {opportunity > 0
                        ? "+"
                        : ""}
                      {opportunity.toFixed(1)}%
                    </td>

                    <td
                      className={`
                        px-6
                        py-5
                        text-right
                        font-black
                        ${
                          potentialProfit > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      `}
                    >
                      {potentialProfit < 0
                        ? "-€"
                        : "+€"}
                      {Math.abs(
                        potentialProfit
                      ).toFixed(2)}
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-full
                          border
                          px-3
                          py-1.5
                          text-[11px]
                          font-black
                          ${recommendation.style}
                        `}
                      >
                        {recommendation.text}
                      </span>
                    </td>

                    <td
                      className="
                        px-6
                        py-5
                        text-right
                      "
                    >
                      <span
                        className={`
                          font-black
                          ${
                            score >= 75
                              ? "text-green-400"
                              : score >= 55
                                ? "text-yellow-400"
                                : "text-red-400"
                          }
                        `}
                      >
                        {score}/100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}