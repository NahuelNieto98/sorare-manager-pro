type Card = {
  id: string;
  playerName: string;
  club: string | null;
  rarity: string;
  marketValue: number | null;
  averageScore: number | null;
  pictureUrl: string | null;
};

type Props = {
  cards: Card[];
};

export default function TopHoldings({
  cards,
}: Props) {
  return (
    <section
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-8
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">
            Top Holdings
          </h2>

          <p className="mt-2 text-zinc-400">
            Cartas con mayor valor de mercado.
          </p>
        </div>

        <div
          className="
          rounded-xl
          bg-violet-500/10
          px-4
          py-2
          text-sm
          font-bold
          text-violet-300
          "
        >
          {cards.length} cartas
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-zinc-400">
                Jugador
              </th>

              <th className="text-left text-sm text-zinc-400">
                Club
              </th>

              <th className="text-left text-sm text-zinc-400">
                Rareza
              </th>

              <th className="text-right text-sm text-zinc-400">
                AA
              </th>

              <th className="pr-6 text-right text-sm text-zinc-400">
                Valor
              </th>
            </tr>
          </thead>

          <tbody>
            {cards.map((card) => (
              <tr
                key={card.id}
                className="
                border-t
                border-white/5
                transition
                hover:bg-white/5
                "
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {card.pictureUrl ? (
                      <img
                        src={card.pictureUrl}
                        alt={card.playerName}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div
                        className="
                        h-14
                        w-14
                        rounded-xl
                        bg-white/10
                        "
                      />
                    )}

                    <div>
                      <p className="font-bold text-white">
                        {card.playerName}
                      </p>

                      <p className="text-sm text-zinc-500">
                        #{card.id.slice(0, 6)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="text-zinc-300">
                  {card.club ?? "-"}
                </td>

                <td>
                  <span
                    className="
                    rounded-full
                    bg-violet-500/15
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-violet-300
                    "
                  >
                    {card.rarity}
                  </span>
                </td>

                <td className="text-right font-semibold text-cyan-400">
                  {card.averageScore ?? "-"}
                </td>

                <td className="pr-6 text-right">
                  <span className="text-xl font-black text-green-400">
                    €
                    {(card.marketValue ?? 0).toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}