import {
  ArrowDownLeft,
  ArrowUpRight,
  ReceiptText,
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

export default function RecentTransactions({
  transactions,
}: Props) {

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
            Últimas transacciones
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Historial de movimientos de tu portfolio.
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
          bg-violet-500/10
          "
        >
          <ReceiptText
            className="text-violet-300"
            size={24}
          />
        </div>

      </div>



      <div className="mt-8 space-y-4">


        {transactions.length === 0 && (

          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-6
            text-center
            text-zinc-400
            "
          >
            No hay transacciones todavía.
          </div>

        )}



        {transactions.map((transaction) => {

          const isBuy = transaction.type === "BUY";


          return (

            <div
              key={transaction.id}
              className="
              group
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-5
              transition
              hover:bg-white/10
              hover:border-violet-400/30
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
                    isBuy
                      ? "bg-red-500/10 text-red-400"
                      : "bg-green-500/10 text-green-400"
                  }
                  `}
                >

                  {isBuy ? (
                    <ArrowDownLeft size={24}/>
                  ) : (
                    <ArrowUpRight size={24}/>
                  )}

                </div>



                <div>

                  <p
                    className="
                    font-bold
                    text-white
                    group-hover:text-violet-300
                    transition
                    "
                  >
                    {transaction.playerName}
                  </p>


                  <div className="mt-1 flex items-center gap-3">

                    <span
                      className="
                      rounded-full
                      bg-white/5
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-zinc-400
                      "
                    >
                      {transaction.rarity}
                    </span>


                    <span className="text-xs text-zinc-500">
                      {isBuy ? "Compra" : "Venta"}
                    </span>

                  </div>

                </div>

              </div>




              <div className="text-right">

                <p
                  className={`
                  text-xl
                  font-black
                  ${
                    isBuy
                      ? "text-red-400"
                      : "text-green-400"
                  }
                  `}
                >
                  {isBuy ? "-" : "+"}
                  €
                  {transaction.price.toFixed(2)}
                </p>


                <p className="mt-1 text-xs text-zinc-500">
                  {transaction.type}
                </p>

              </div>


            </div>

          );

        })}

      </div>


    </div>
  );
}