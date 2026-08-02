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

export default function RecentTransactions({ transactions }: Props) {
  return (
    <div className="rounded-3xl border border-violet-700/30 bg-[#17112F] p-8">
      <h2 className="text-2xl font-bold text-white">Últimas transacciones</h2>

      <div className="mt-8 space-y-4">
        {transactions.length === 0 && (
          <p className="text-zinc-500">No hay transacciones todavía.</p>
        )}

        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-xl bg-[#221A40] p-4"
          >
            <div>
              <p className="font-bold text-white">{transaction.playerName}</p>

              <p className="text-sm text-zinc-500">{transaction.rarity}</p>
            </div>

            <div className="text-right">
              <p
                className={`font-bold ${
                  transaction.type === "BUY" ? "text-red-400" : "text-green-400"
                }`}
              >
                {transaction.type === "BUY" ? "-" : "+"}€
                {transaction.price.toFixed(2)}
              </p>

              <p className="text-xs text-zinc-500">{transaction.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
