import {
  Wallet,
  TrendingUp,
  Percent,
} from "lucide-react";

type Props = {
  galleryValue: number;
  profit: number;
  roi: number;
};

export default function PortfolioCard({
  galleryValue,
  profit,
  roi,
}: Props) {

  const positiveProfit = profit >= 0;
  const positiveRoi = roi >= 0;

  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-[#1b1535]
      via-[#221a45]
      to-[#120e25]
      p-8
      shadow-xl
      "
    >

      <div
        className="
        absolute
        -right-20
        -top-20
        h-64
        w-64
        rounded-full
        bg-violet-500/20
        blur-3xl
        "
      />


      <div className="relative">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-3xl font-black text-white">
              Portfolio
            </h2>

            <p className="mt-2 text-zinc-400">
              Resumen económico de tu colección Sorare.
            </p>
          </div>


          <div
            className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-violet-500/20
            "
          >
            <Wallet
              className="text-violet-300"
              size={28}
            />
          </div>

        </div>



        <div
          className="
          mt-10
          grid
          gap-6
          md:grid-cols-3
          "
        >


          <Metric
            title="Valor galería"
            value={`€${galleryValue.toFixed(2)}`}
            icon={
              <Wallet size={22}/>
            }
            color="text-green-400"
          />


          <Metric
            title="Beneficio"
            value={`${positiveProfit ? "+" : ""}€${profit.toFixed(2)}`}
            icon={
              <TrendingUp size={22}/>
            }
            color={
              positiveProfit
                ? "text-green-400"
                : "text-red-400"
            }
          />


          <Metric
            title="ROI"
            value={`${positiveRoi ? "+" : ""}${roi.toFixed(2)}%`}
            icon={
              <Percent size={22}/>
            }
            color={
              positiveRoi
                ? "text-cyan-400"
                : "text-red-400"
            }
          />


        </div>


        <div
          className="
          mt-10
          h-px
          bg-white/10
          "
        />


        <div
          className="
          mt-6
          flex
          items-center
          justify-between
          text-sm
          "
        >

          <span className="text-zinc-400">
            Rendimiento de cartera
          </span>


          <span
            className={`
            font-bold
            ${
              positiveRoi
                ? "text-green-400"
                : "text-red-400"
            }
            `}
          >
            {positiveRoi
              ? "Tendencia positiva"
              : "Revisar cartera"
            }
          </span>

        </div>

      </div>

    </div>
  );
}



function Metric({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {

  return (
    <div
      className="
      rounded-2xl
      border
      border-white/10
      bg-white/5
      p-5
      transition
      hover:bg-white/10
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-white/5
          text-zinc-300
          "
        >
          {icon}
        </div>


        <p className="text-sm text-zinc-400">
          {title}
        </p>

      </div>


      <h3
        className={`
        mt-5
        text-3xl
        font-black
        ${color}
        `}
      >
        {value}
      </h3>

    </div>
  );
}