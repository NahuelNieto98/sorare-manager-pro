"use client";

import CountUp from "react-countup";
import {
  Wallet,
  ShoppingCart,
  CircleDollarSign,
  TrendingUp,
  Sparkles,
} from "lucide-react";

type Props = {
  title: string;
  value: string;
  subtitle: string;
};

function getIcon(title: string) {
  switch (title) {
    case "Valor galería":
      return <Wallet className="text-violet-300" size={28} />;

    case "Comprado":
      return <ShoppingCart className="text-red-300" size={28} />;

    case "Vendido":
      return <CircleDollarSign className="text-emerald-300" size={28} />;

    case "Beneficio":
      return <TrendingUp className="text-green-300" size={28} />;

    case "ROI":
      return <TrendingUp className="text-cyan-300" size={28} />;

    default:
      return <Sparkles className="text-yellow-300" size={28} />;
  }
}

export default function StatCard({ title, value, subtitle }: Props) {
  const numeric = Number(value.replace(/[^\d.-]/g, ""));

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-violet-700/30 bg-gradient-to-br from-[#181530] via-[#221B45] to-[#141127] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-violet-400 hover:shadow-2xl hover:shadow-violet-900/40">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-black text-white">
            {isNaN(numeric) ? (
              value
            ) : value.includes("%") ? (
              <>
                <CountUp end={numeric} decimals={2} duration={1.5} />%
              </>
            ) : value.includes("€") ? (
              <>
                €<CountUp end={numeric} decimals={2} duration={1.5} />
              </>
            ) : (
              <CountUp end={numeric} duration={1.5} />
            )}
          </h2>

          <p className="mt-3 text-zinc-400">{subtitle}</p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 backdrop-blur transition group-hover:scale-110">
          {getIcon(title)}
        </div>
      </div>

      <div className="mt-8 h-1 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"></div>
      </div>
    </div>
  );
}
