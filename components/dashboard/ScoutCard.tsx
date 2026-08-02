export default function ScoutCard() {
  return (
    <div className="rounded-3xl border border-violet-700/30 bg-gradient-to-br from-violet-700 to-purple-900 p-8">
      <h2 className="text-3xl font-bold text-white">🤖 Scout IA</h2>

      <p className="mt-4 text-purple-100 leading-8">
        Tu asistente analizará automáticamente tu galería y te recomendará:
        {"\n\n"}• Qué vender
        {"\n"}• Qué comprar
        {"\n"}• Mejor alineación
        {"\n"}• ROI esperado
        {"\n"}• Riesgos de mercado
      </p>

      <button className="mt-8 rounded-xl bg-white px-6 py-3 font-bold text-purple-900 transition hover:scale-105">
        Abrir Scout IA
      </button>
    </div>
  );
}
