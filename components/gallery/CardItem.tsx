type Props = {
  playerName: string;
  club: string | null;
  pictureUrl: string | null;
  scarcity: string;
  marketValue: number | null;
  averageScore: number | null;
};

function rarityColor(scarcity: string) {
  switch (scarcity.toLowerCase()) {
    case "limited":
      return "bg-yellow-500 text-black";

    case "rare":
      return "bg-red-500 text-white";

    case "super_rare":
      return "bg-blue-500 text-white";

    case "unique":
      return "bg-black text-yellow-300 border border-yellow-400";

    default:
      return "bg-purple-600 text-white";
  }
}

export default function CardItem({
  playerName,
  club,
  pictureUrl,
  scarcity,
  marketValue,
  averageScore,
}: Props) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-violet-700/30 bg-gradient-to-br from-[#181530] via-[#221B45] to-[#141127] transition-all duration-300 hover:-translate-y-2 hover:border-violet-500 hover:shadow-2xl hover:shadow-violet-900/40">
      <div className="relative h-80 overflow-hidden">
        {pictureUrl ? (
          <img
            src={pictureUrl}
            alt={playerName}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500">
            Sin imagen
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#141127] via-transparent to-transparent" />

        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase ${rarityColor(
            scarcity,
          )}`}
        >
          {scarcity.replace("_", " ")}
        </span>

        <div className="absolute right-4 top-4 rounded-xl bg-black/40 px-3 py-2 backdrop-blur">
          <p className="text-xs text-zinc-300">AA</p>

          <p className="text-lg font-bold text-white">{averageScore ?? "-"}</p>
        </div>
      </div>

      <div className="p-6">
        <h2 className="truncate text-2xl font-bold text-white">{playerName}</h2>

        <p className="mt-1 truncate text-zinc-400">{club ?? "Sin club"}</p>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Valor
            </p>

            <p className="text-2xl font-extrabold text-green-400">
              €{marketValue?.toFixed(2) ?? "0.00"}
            </p>
          </div>

          <button className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500">
            Ver
          </button>
        </div>
      </div>
    </div>
  );
}
