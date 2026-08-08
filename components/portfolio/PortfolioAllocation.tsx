type Props = {
  scarcity: {
    limited: number;
    rare: number;
    superRare: number;
    unique: number;
  };
};

export default function PortfolioAllocation({
  scarcity,
}: Props) {
  const total =
    scarcity.limited +
    scarcity.rare +
    scarcity.superRare +
    scarcity.unique;

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
      <h2 className="text-2xl font-black text-white">
        Distribución de la colección
      </h2>

      <p className="mt-2 text-zinc-400">
        Reparto de cartas por rareza.
      </p>

      <div className="mt-8 space-y-6">
        <Row
          label="Limited"
          value={scarcity.limited}
          total={total}
          color="bg-emerald-500"
        />

        <Row
          label="Rare"
          value={scarcity.rare}
          total={total}
          color="bg-blue-500"
        />

        <Row
          label="Super Rare"
          value={scarcity.superRare}
          total={total}
          color="bg-purple-500"
        />

        <Row
          label="Unique"
          value={scarcity.unique}
          total={total}
          color="bg-yellow-500"
        />
      </div>

      <div
        className="
        mt-10
        rounded-2xl
        bg-white/5
        p-5
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">
            Total de cartas
          </span>

          <span className="text-3xl font-black text-white">
            {total}
          </span>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage =
    total === 0
      ? 0
      : (value / total) * 100;

  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="font-semibold text-white">
          {label}
        </span>

        <span className="text-zinc-400">
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`${color} h-full rounded-full transition-all duration-700`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}