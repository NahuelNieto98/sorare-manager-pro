"use client";

import { useTranslations } from "next-intl";

type Props = {
  cards: {
    id: string;
    price: number;
    Card: {
      playerName: string;
      club: string | null;
      scarcity: string;
      marketValue: number | null;
    };
    score: number;
  }[];
};

export default function MarketTable({ cards }: Props) {
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
        <h2 className="text-3xl font-black text-white">
          {t("complete")}
        </h2>

        <p className="mt-2 text-zinc-400">
          {t("completeDescription")}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-zinc-400">
                {t("player")}
              </th>

              <th className="px-6 py-4 text-left text-sm text-zinc-400">
                {t("rarity")}
              </th>

              <th className="px-6 py-4 text-left text-sm text-zinc-400">
                {t("club")}
              </th>

              <th className="px-6 py-4 text-right text-sm text-zinc-400">
                {t("price")}
              </th>

              <th className="px-6 py-4 text-right text-sm text-zinc-400">
                {t("score")}
              </th>
            </tr>
          </thead>

          <tbody>
            {cards.map((item) => (
              <tr
                key={item.id}
                className="
                  border-t
                  border-white/5
                  transition
                  hover:bg-white/5
                "
              >
                <td
                  className="
                    px-6
                    py-4
                    font-bold
                    text-white
                  "
                >
                  {item.Card.playerName}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    text-zinc-300
                  "
                >
                  {item.Card.scarcity}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    text-zinc-400
                  "
                >
                  {item.Card.club ?? "-"}
                </td>

                <td
                  className="
                    px-6
                    py-4
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
                    py-4
                    text-right
                    font-black
                    text-violet-400
                  "
                >
                  🔥 {item.score}/100
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}