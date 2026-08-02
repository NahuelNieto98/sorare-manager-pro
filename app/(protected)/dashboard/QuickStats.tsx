"use client";

type Props = {
  bought: number;
  sold: number;
  profit: number;
};

export default function QuickStats({ bought, sold, profit }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="rounded-2xl bg-[#17112F] p-6 border border-purple-900">
        <p className="text-zinc-400">Comprado</p>

        <h2 className="mt-3 text-3xl font-bold text-white">
          €{bought.toFixed(2)}
        </h2>
      </div>

      <div className="rounded-2xl bg-[#17112F] p-6 border border-purple-900">
        <p className="text-zinc-400">Vendido</p>

        <h2 className="mt-3 text-3xl font-bold text-white">
          €{sold.toFixed(2)}
        </h2>
      </div>

      <div className="rounded-2xl bg-[#17112F] p-6 border border-purple-900">
        <p className="text-zinc-400">Beneficio</p>

        <h2 className="mt-3 text-3xl font-bold text-green-400">
          €{profit.toFixed(2)}
        </h2>
      </div>
    </div>
  );
}
