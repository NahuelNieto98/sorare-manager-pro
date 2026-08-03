"use client";

import CountUp from "react-countup";
import {
  Wallet,
  ShoppingCart,
  CircleDollarSign,
  TrendingUp,
  Sparkles,
  Layers,
} from "lucide-react";

type Props = {
  title: string;
  value: string;
  subtitle: string;
};

function getIcon(title: string) {
  switch (title) {
    case "Valor galería":
      return <Wallet className="text-violet-300" size={30} />;

    case "Comprado":
      return <ShoppingCart className="text-red-300" size={30} />;

    case "Vendido":
      return <CircleDollarSign className="text-emerald-300" size={30} />;

    case "Beneficio":
      return <TrendingUp className="text-green-300" size={30} />;

    case "ROI":
      return <TrendingUp className="text-cyan-300" size={30} />;

    case "Cartas":
      return <Layers className="text-blue-300" size={30} />;

    default:
      return <Sparkles className="text-yellow-300" size={30} />;
  }
}

function formatValue(value: string) {
  const numeric = Number(value.replace(/[^\d.-]/g, ""));

  if (isNaN(numeric)) {
    return value;
  }

  if (value.includes("%")) {
    return (
      <>
        <CountUp
          end={numeric}
          decimals={2}
          duration={1.5}
        />
        %
      </>
    );
  }

  if (value.includes("€")) {
    return (
      <>
        €
        <CountUp
          end={numeric}
          decimals={2}
          duration={1.5}
        />
      </>
    );
  }

  return (
    <CountUp
      end={numeric}
      duration={1.5}
    />
  );
}

export default function StatCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-[#1b1535]
      via-[#221a45]
      to-[#120e25]
      p-6
      shadow-xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-violet-400/40
      hover:shadow-violet-900/40
      "
    >

      <div
        className="
        absolute
        -right-16
        -top-16
        h-44
        w-44
        rounded-full
        bg-violet-500/20
        blur-3xl
        transition
        group-hover:bg-violet-400/30
        "
      />

      <div className="relative flex items-start justify-between">

        <div>

          <p
            className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.25em]
            text-zinc-400
            "
          >
            {title}
          </p>


          <h2
            className="
            mt-5
            text-4xl
            font-black
            tracking-tight
            text-white
            "
          >
            {formatValue(value)}
          </h2>


          <p
            className="
            mt-3
            text-sm
            text-zinc-400
            "
          >
            {subtitle}
          </p>

        </div>


        <div
          className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/5
          backdrop-blur
          transition-all
          duration-300
          group-hover:scale-110
          "
        >
          {getIcon(title)}
        </div>

      </div>


      <div
        className="
        relative
        mt-8
        h-1.5
        overflow-hidden
        rounded-full
        bg-white/10
        "
      >

        <div
          className="
          h-full
          w-2/3
          rounded-full
          bg-gradient-to-r
          from-violet-500
          via-fuchsia-500
          to-cyan-400
          transition-all
          duration-700
          group-hover:w-full
          "
        />

      </div>

    </div>
  );
}