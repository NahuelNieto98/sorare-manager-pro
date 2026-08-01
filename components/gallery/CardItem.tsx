type Props = {
  playerName: string;
  club: string | null;
  pictureUrl: string | null;
  scarcity: string;
  marketValue: number | null;
  averageScore: number | null;
};

export default function CardItem({
  playerName,
  club,
  pictureUrl,
  scarcity,
  marketValue,
  averageScore,
}: Props) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-purple-900 bg-[#17112F] transition-all duration-300 hover:-translate-y-2 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-900/30">
      <div className="relative h-72 bg-[#221A40] flex items-center justify-center">
        {pictureUrl ? (
          <img
            src={pictureUrl}
            alt={playerName}
            className="h-full object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-zinc-500">Sin imagen</span>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold uppercase">
          {scarcity}
        </span>
      </div>

      <div className="p-5">
        <h2 className="truncate text-2xl font-bold text-white">{playerName}</h2>

        <p className="mt-1 truncate text-zinc-400">{club ?? "Sin club"}</p>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Valor</p>

            <p className="text-xl font-bold text-green-400">
              €{marketValue ?? 0}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-zinc-500">AA</p>

            <p className="text-xl font-bold text-purple-400">
              {averageScore ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
