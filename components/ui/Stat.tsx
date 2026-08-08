import { ReactNode } from "react";
import CountUp from "react-countup";

type Props = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  valueColor?: string;
};

export default function Stat({
  title,
  value,
  subtitle,
  icon,
  prefix = "",
  suffix = "",
  decimals = 0,
  valueColor = "text-white",
}: Props) {
  const numeric =
    typeof value === "number";

  return (
    <div
      className="
      group
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-6
      transition-all
      duration-300
      hover:border-violet-500/40
      hover:-translate-y-1
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="
            text-xs
            font-bold
            uppercase
            tracking-widest
            text-zinc-500
            "
          >
            {title}
          </p>

          <h2
            className={`
            mt-4
            text-4xl
            font-black
            ${valueColor}
            `}
          >
            {numeric ? (
              <>
                {prefix}

                <CountUp
                  end={value as number}
                  decimals={decimals}
                  duration={1.5}
                />

                {suffix}
              </>
            ) : (
              value
            )}
          </h2>

          {subtitle && (
            <p
              className="
              mt-3
              text-sm
              text-zinc-400
              "
            >
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div
            className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-white/5
            text-violet-300
            transition
            group-hover:scale-110
            "
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}