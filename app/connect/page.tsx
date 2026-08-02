"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const router = useRouter();

  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  async function connectAccount(e: React.FormEvent) {
    e.preventDefault();

    if (!slug.trim()) {
      alert("Introduce tu usuario de Sorare");
      return;
    }

    setLoading(true);

    try {
      const save = await fetch("/api/connect-sorare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
        }),
      });

      if (!save.ok) {
        alert("No se pudo guardar la cuenta.");
        return;
      }

      const sync = await fetch("/api/sync-gallery", {
        method: "POST",
      });

      if (!sync.ok) {
        alert("No se pudo sincronizar la galería.");
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-24 max-w-2xl">
      <div className="rounded-3xl border border-violet-700/30 bg-gradient-to-br from-[#181530] via-[#221B45] to-[#141127] p-10">
        <h1 className="text-4xl font-black text-white">
          Conecta tu cuenta de Sorare
        </h1>

        <p className="mt-4 text-zinc-400">
          Introduce tu nombre de usuario para sincronizar automáticamente tu
          colección.
        </p>

        <form onSubmit={connectAccount} className="mt-8 space-y-6">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Ejemplo: lightenn1"
            className="w-full rounded-xl border border-violet-700/30 bg-[#181530] px-5 py-4 text-white outline-none"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-4 font-bold text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? "Sincronizando..." : "Conectar cuenta"}
          </button>
        </form>

        <div className="mt-10 rounded-2xl bg-white/5 p-6">
          <h2 className="font-bold text-white">¿Qué obtendrás?</h2>

          <ul className="mt-4 space-y-2 text-zinc-300">
            <li>✅ Dashboard automático</li>
            <li>✅ Valor de la galería</li>
            <li>✅ ROI</li>
            <li>✅ Estadísticas</li>
            <li>✅ Transacciones</li>
            <li>✅ Analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
