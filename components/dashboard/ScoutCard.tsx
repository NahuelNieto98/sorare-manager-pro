export default function ScoutCard() {
  return (
    <div className="rounded-3xl border border-purple-900 bg-[#17112F] p-8">
      <h2 className="text-2xl font-bold text-white">Scout IA</h2>

      <p className="mt-4 text-zinc-400">
        Próximamente podrás analizar automáticamente tu galería utilizando
        inteligencia artificial.
      </p>

      <div className="mt-8 rounded-2xl bg-[#221A40] p-6">
        <p className="text-white">✓ Recomendaciones de compra</p>

        <p className="mt-3 text-white">✓ Recomendaciones de venta</p>

        <p className="mt-3 text-white">✓ Mejor alineación</p>

        <p className="mt-3 text-white">✓ Riesgo de jugadores</p>
      </div>

      <button className="mt-8 w-full rounded-xl bg-purple-600 py-3 font-bold text-white hover:bg-purple-500">
        Disponible próximamente
      </button>
    </div>
  );
}
