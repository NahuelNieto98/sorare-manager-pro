import {
  BadgeEuro,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  Target,
} from "lucide-react";

type Props = {
  totalBought: number;
  totalSold: number;
  recoveredCapital: number;
  portfolioHealth: string;
  investmentStatus: string;
  average: number;
};

export default function PortfolioStats({
  totalBought,
  totalSold,
  recoveredCapital,
  portfolioHealth,
  investmentStatus,
  average,
}: Props) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <Card
        icon={<BadgeEuro size={24} />}
        title="Capital invertido"
        value={`€${totalBought.toFixed(2)}`}
        subtitle="Total invertido desde el inicio"
        color="text-red-400"
      />

      <Card
        icon={<Wallet size={24} />}
        title="Capital recuperado"
        value={`€${totalSold.toFixed(2)}`}
        subtitle={`${recoveredCapital.toFixed(1)}% recuperado`}
        color="text-green-400"
      />

      <Card
        icon={<Target size={24} />}
        title="AA Medio"
        value={average.toFixed(1)}
        subtitle="Media de toda la colección"
        color="text-cyan-400"
      />

      <Card
        icon={<TrendingUp size={24} />}
        title="Estado"
        value={portfolioHealthLabel(portfolioHealth)}
        subtitle="Salud del portfolio"
        color={portfolioHealthColor(portfolioHealth)}
      />

      <Card
        icon={<PiggyBank size={24} />}
        title="Situación"
        value={investmentStatusLabel(investmentStatus)}
        subtitle="Estado de la inversión"
        color="text-violet-300"
      />

      <Card
        icon={<TrendingDown size={24} />}
        title="Rentabilidad"
        value={
          recoveredCapital >= 100
            ? "Positiva"
            : "Pendiente"
        }
        subtitle="Capital recuperado"
        color={
          recoveredCapital >= 100
            ? "text-green-400"
            : "text-yellow-400"
        }
      />
    </section>
  );
}

function Card({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-6
      transition
      hover:border-violet-500/40
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-white/5
          text-violet-300
          "
        >
          {icon}
        </div>

        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h3
            className={`mt-1 text-2xl font-black ${color}`}
          >
            {value}
          </h3>
        </div>
      </div>

      <p className="mt-6 text-sm text-zinc-500">
        {subtitle}
      </p>
    </div>
  );
}

function portfolioHealthLabel(status: string) {
  switch (status) {
    case "excellent":
      return "Excelente";
    case "good":
      return "Buena";
    case "stable":
      return "Estable";
    default:
      return "En riesgo";
  }
}

function portfolioHealthColor(status: string) {
  switch (status) {
    case "excellent":
      return "text-green-400";
    case "good":
      return "text-cyan-400";
    case "stable":
      return "text-yellow-400";
    default:
      return "text-red-400";
  }
}

function investmentStatusLabel(status: string) {
  switch (status) {
    case "growing":
      return "Creciendo";
    default:
      return "Recuperando";
  }
}