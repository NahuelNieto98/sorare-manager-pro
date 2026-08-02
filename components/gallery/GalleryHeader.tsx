import { Layers3, Euro, BarChart3, Gem } from "lucide-react";

type Props = {
  totalCards: number;
  galleryValue: number;
  average: number;
};

export default function GalleryHeader({
  totalCards,
  galleryValue,
  average,
}: Props) {
  const stats = [
    {
      title: "Cartas",
      value: totalCards,
      icon: Layers3,
      color: "text-violet-300",
    },
    {
      title: "Valor",
      value: `€${galleryValue.toFixed(2)}`,
      icon: Euro,
      color: "text-green-400",
    },
    {
      title: "AA Media",
      value: average.toFixed(1),
      icon: BarChart3,
      color: "text-cyan-400",
    },
    {
      title: "Colección",
      value: "Pro",
      icon: Gem,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="mb-8 rounded-3xl border border-violet-700/30 bg-gradient-to-br from-[#181530] via-[#221B45] to-[#141127] p-8">
      <h1 className="text-4xl font-black text-white">Gallery</h1>

      <p className="mt-2 text-zinc-400">
        Gestiona toda tu colección de Sorare.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.title} className="rounded-2xl bg-white/5 p-5">
              <Icon className={stat.color} size={24} />

              <p className="mt-4 text-sm text-zinc-400">{stat.title}</p>

              <h2 className={`mt-2 text-3xl font-black ${stat.color}`}>
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
