type Props = {
  totalCards: number;
  average: number;
};

export default function QuickStats({ totalCards, average }: Props) {
  return (
    <div className="rounded-3xl border border-violet-700/30 bg-[#17112F] p-8">
      <h2 className="text-2xl font-bold text-white">Estadísticas rápidas</h2>

      <div className="mt-8 space-y-5">
        <div className="flex justify-between">
          <span className="text-zinc-400">Cartas</span>

          <span className="font-bold text-white">{totalCards}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">AA Media</span>

          <span className="font-bold text-purple-400">
            {average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
