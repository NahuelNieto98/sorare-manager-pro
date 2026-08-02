type Card = {
  playerName: string;
  marketValue: number | null;
};

type Props = {
  cards: Card[];
};

export default function TopCards({ cards }: Props) {
  return (
    <div className="rounded-3xl border border-violet-700/30 bg-[#17112F] p-8">
      <h2 className="text-2xl font-bold text-white">Top cartas</h2>

      <div className="mt-8 space-y-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl bg-[#221A40] p-4"
          >
            <div>
              <p className="font-bold text-white">{card.playerName}</p>

              <p className="text-sm text-zinc-500">#{index + 1}</p>
            </div>

            <p className="text-xl font-bold text-green-400">
              €{card.marketValue ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
