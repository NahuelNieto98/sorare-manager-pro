export default function GalleryValue() {
  return (
    <div className="rounded-2xl border border-purple-900 bg-[#17112F] p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Valor de la galería</h2>

          <p className="text-zinc-400 mt-2">Actualizado automáticamente</p>
        </div>

        <div className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold">
          LIVE
        </div>
      </div>

      <div className="text-6xl font-extrabold text-purple-400">€0</div>

      <p className="mt-4 text-zinc-400">
        Conecta tu cuenta de Sorare para comenzar a sincronizar tus cartas.
      </p>

      <div className="mt-10 h-64 rounded-xl border border-dashed border-purple-800 flex items-center justify-center">
        <p className="text-zinc-500">
          Aquí aparecerá el gráfico del valor de tu galería.
        </p>
      </div>
    </div>
  );
}
