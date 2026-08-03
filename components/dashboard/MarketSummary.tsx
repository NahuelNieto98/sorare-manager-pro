import {
  ShoppingCart,
  WalletCards,
  ArrowRightLeft,
} from "lucide-react";

type Props = {
  bought: number;
  sold: number;
};

export default function MarketSummary({
  bought,
  sold,
}: Props) {

  const balance = sold - bought;

  return (
    <div
      className="
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

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black text-white">
            Mercado
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Seguimiento de movimientos económicos.
          </p>

        </div>


        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-violet-500/20
          "
        >
          <ArrowRightLeft
            className="text-violet-300"
            size={24}
          />
        </div>

      </div>



      <div
        className="
        mt-8
        grid
        gap-4
        md:grid-cols-2
        "
      >

        <div
          className="
          rounded-2xl
          border
          border-white/10
          bg-white/5
          p-5
          "
        >

          <div className="flex items-center gap-3">

            <ShoppingCart
              className="text-red-400"
              size={22}
            />

            <p className="text-sm text-zinc-400">
              Comprado
            </p>

          </div>


          <p
            className="
            mt-5
            text-3xl
            font-black
            text-red-400
            "
          >
            €{bought.toFixed(2)}
          </p>

        </div>



        <div
          className="
          rounded-2xl
          border
          border-white/10
          bg-white/5
          p-5
          "
        >

          <div className="flex items-center gap-3">

            <WalletCards
              className="text-green-400"
              size={22}
            />

            <p className="text-sm text-zinc-400">
              Vendido
            </p>

          </div>


          <p
            className="
            mt-5
            text-3xl
            font-black
            text-green-400
            "
          >
            €{sold.toFixed(2)}
          </p>

        </div>

      </div>



      <div
        className="
        mt-6
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
        "
      >

        <p className="text-sm text-zinc-400">
          Balance mercado
        </p>


        <p
          className={`
          mt-2
          text-2xl
          font-black
          ${
            balance >= 0
              ? "text-green-400"
              : "text-red-400"
          }
          `}
        >
          {balance >= 0 ? "+" : ""}
          €{balance.toFixed(2)}
        </p>


      </div>


    </div>
  );
}