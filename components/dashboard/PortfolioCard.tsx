type Props = {
  galleryValue: number;
  profit: number;
  roi: number;
};

export default function PortfolioCard({ galleryValue, profit, roi }: Props) {
  return (
    <div className="rounded-3xl border border-violet-700/30 bg-[#17112F] p-8">
      <h2 className="text-3xl font-bold text-white">Portfolio</h2>

      <p className="mt-2 text-zinc-400">Resumen económico de tu cuenta.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-zinc-500">Valor galería</p>

          <h3 className="mt-2 text-4xl font-extrabold text-green-400">
            €{galleryValue.toFixed(2)}
          </h3>
        </div>

        <div>
          <p className="text-zinc-500">Beneficio</p>

          <h3
            className={`mt-2 text-4xl font-extrabold ${
              profit >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            €{profit.toFixed(2)}
          </h3>
        </div>

        <div>
          <p className="text-zinc-500">ROI</p>

          <h3
            className={`mt-2 text-4xl font-extrabold ${
              roi >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {roi.toFixed(2)}%
          </h3>
        </div>
      </div>
    </div>
  );
}
