import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

type Transaction = {
  id: string;
  type: string;
  playerName: string;
  rarity: string;
  price: number;
};

type Props = {
  transactions: Transaction[];
};

export default function PortfolioTransactions({
  transactions,
}: Props) {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">
            Últimas transacciones
          </h2>

          <p className="mt-2 text-zinc-400">
            Compras y ventas más recientes.
          </p>
        </div>

        <span
          className="
          rounded-xl
          bg-violet-500/10
          px-4
          py-2
          text-sm
          font-bold
          text-violet-300
          "
        >
          {transactions.length} movimientos
        </span>
      </div>

      <div className="mt-8 space-y-3">
        {transactions.map((transaction) => {
          const buy =
            transaction.type === "BUY";

          return (
            <div
              key={transaction.id}
              className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-white/5
              bg-white/5
              p-5
              transition
              hover:border-violet-500/30
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    buy
                      ? "bg-red-500/10 text-red-400"
                      : "bg-green-500/10 text-green-400"
                  }
                  `}
                >
                  {buy ? (
                    <ArrowDownRight size={22} />
                  ) : (
                    <ArrowUpRight size={22} />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-white">
                    {transaction.playerName}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {transaction.rarity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-xl font-black ${
                    buy
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {buy ? "-" : "+"}€
                  {transaction.price.toFixed(2)}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {buy ? "Compra" : "Venta"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}