type Props = {
  bought: number;
  sold: number;
};

export default function MarketSummary({ bought, sold }: Props) {
  return (
    <div className="rounded-3xl border border-violet-700/30 bg-[#17112F] p-8">
      <h2 className="text-2xl font-bold text-white">Mercado</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-zinc-500">Comprado</p>

          <p className="mt-2 text-4xl font-bold text-red-400">
            €{bought.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-zinc-500">Vendido</p>

          <p className="mt-2 text-4xl font-bold text-green-400">
            €{sold.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
