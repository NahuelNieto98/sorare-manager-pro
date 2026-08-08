import {
  Wallet,
  TrendingUp,
  Trophy,
  Layers,
} from "lucide-react";

type Props = {
  galleryValue: number;
  roi: number;
  profit: number;
  totalCards: number;
};

export default function PortfolioHero({
  galleryValue,
  roi,
  profit,
  totalCards,
}: Props) {
  const positive = roi >= 0;

  return (
    <section
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-[#24194d]
      via-[#17132f]
      to-[#0f0b1f]
      p-10
      shadow-2xl
      "
    >
      <div
        className="
        absolute
        -right-24
        -top-24
        h-80
        w-80
        rounded-full
        bg-violet-500/20
        blur-3xl
        "
      />

      <div className="relative">
        <span
          className="
          rounded-full
          border
          border-violet-500/30
          bg-violet-500/10
          px-4
          py-2
          text-xs
          font-bold
          uppercase
          tracking-widest
          text-violet-300
          "
        >
          Portfolio Intelligence
        </span>

        <h1
          className="
          mt-6
          text-5xl
          font-black
          text-white
          "
        >
          Tu patrimonio Sorare
        </h1>

        <p
          className="
          mt-4
          max-w-2xl
          text-lg
          text-zinc-400
          "
        >
          Consulta el valor total de tu galería, tu beneficio,
          el ROI y la evolución de tu inversión desde un único lugar.
        </p>

        <div
          className="
          mt-10
          grid
          gap-6
          md:grid-cols-4
          "
        >
          <Metric
            icon={<Wallet size={22} />}
            title="Valor"
            value={`€${galleryValue.toFixed(2)}`}
            color="text-green-400"
          />

          <Metric
            icon={<TrendingUp size={22} />}
            title="ROI"
            value={`${positive ? "+" : ""}${roi.toFixed(2)}%`}
            color={
              positive
                ? "text-cyan-400"
                : "text-red-400"
            }
          />

          <Metric
            icon={<Trophy size={22} />}
            title="Beneficio"
            value={`${profit >= 0 ? "+" : ""}€${profit.toFixed(2)}`}
            color={
              profit >= 0
                ? "text-green-400"
                : "text-red-400"
            }
          />

          <Metric
            icon={<Layers size={22} />}
            title="Cartas"
            value={String(totalCards)}
            color="text-violet-300"
          />
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-white/10
      bg-white/5
      p-6
      backdrop-blur-sm
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-white/5
          "
        >
          {icon}
        </div>

        <span className="text-sm text-zinc-400">
          {title}
        </span>
      </div>

      <h2
        className={`mt-6 text-3xl font-black ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}