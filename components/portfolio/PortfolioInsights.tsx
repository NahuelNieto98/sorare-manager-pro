import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

type Props = {
  roi: number;
  profit: number;
  totalBought: number;
  totalSold: number;
  galleryValue: number;
};

export default function PortfolioInsights({
  roi,
  profit,
  totalBought,
  totalSold,
  galleryValue,
}: Props) {
  const recovered =
    totalBought === 0
      ? 0
      : (totalSold / totalBought) * 100;

  const pending =
    Math.max(0, totalBought - totalSold);

  const roiColor =
    roi >= 20
      ? "text-green-400"
      : roi >= 0
      ? "text-yellow-400"
      : "text-red-400";

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
        Portfolio Insights
      </h2>

      <p className="mt-2 text-zinc-400">
        Análisis automático de tu colección.
      </p>

      <div className="mt-8 space-y-5">

        <Insight
          icon={<TrendingUp size={22} />}
          color={roiColor}
          title="ROI"
          description={
            roi >= 20
              ? `Excelente. Tu ROI actual es del ${roi.toFixed(2)}%.`
              : roi >= 0
              ? `ROI positivo del ${roi.toFixed(2)}%.`
              : `ROI negativo del ${roi.toFixed(2)}%.`
          }
        />

        <Insight
          icon={<Wallet size={22} />}
          color="text-cyan-400"
          title="Capital recuperado"
          description={`${recovered.toFixed(
            1
          )}% del dinero invertido ya ha vuelto a tu cuenta.`}
        />

        <Insight
          icon={<ShieldCheck size={22} />}
          color="text-green-400"
          title="Valor de la colección"
          description={`Tu galería está valorada actualmente en €${galleryValue.toFixed(
            2
          )}.`}
        />

        <Insight
          icon={<AlertTriangle size={22} />}
          color="text-yellow-400"
          title="Capital pendiente"
          description={`Todavía quedan €${pending.toFixed(
            2
          )} por recuperar.`}
        />

        <Insight
          icon={
            profit >= 0 ? (
              <TrendingUp size={22} />
            ) : (
              <TrendingDown size={22} />
            )
          }
          color={
            profit >= 0
              ? "text-green-400"
              : "text-red-400"
          }
          title="Beneficio"
          description={`Resultado actual: ${
            profit >= 0 ? "+" : ""
          }€${profit.toFixed(2)}.`}
        />
      </div>
    </section>
  );
}

function Insight({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className="
      flex
      items-start
      gap-5
      rounded-2xl
      border
      border-white/5
      bg-white/5
      p-5
      "
    >
      <div
        className={`
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-xl
        bg-white/5
        ${color}
        `}
      >
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}