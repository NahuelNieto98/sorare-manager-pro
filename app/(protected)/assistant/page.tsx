"use client";

import { useState } from "react";

export default function AssistantPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  async function analyze() {
    setLoading(true);

    try {
      const res = await fetch("/api/assistant");

      const data = await res.json();

      setAnalysis(data.analysis);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Scout IA</h1>

        <p className="mt-2 text-zinc-400">
          Tu asistente inteligente para Sorare.
        </p>
      </div>

      <div className="rounded-3xl border border-violet-700/30 bg-[#17112F] p-8">
        <h2 className="text-2xl font-bold text-white">Analiza tu galería</h2>

        <p className="mt-3 text-zinc-400">
          El Scout IA analizará automáticamente tus cartas, tu ROI, tus compras
          y ventas y te dará recomendaciones.
        </p>

        <button
          onClick={analyze}
          disabled={loading}
          className="mt-8 rounded-xl bg-violet-600 px-8 py-4 font-bold text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? "Analizando..." : "Analizar mi galería"}
        </button>
      </div>

      <div className="rounded-3xl border border-violet-700/30 bg-[#17112F] p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">Resultado</h2>

        {analysis ? (
          <pre className="whitespace-pre-wrap text-zinc-300 leading-8">
            {analysis}
          </pre>
        ) : (
          <p className="text-zinc-500">
            Pulsa el botón para generar un análisis.
          </p>
        )}
      </div>
    </div>
  );
}
