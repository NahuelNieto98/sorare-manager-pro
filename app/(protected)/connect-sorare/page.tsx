"use client";

import { useState } from "react";

export default function ConnectSorarePage() {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function connect() {
    if (!slug) return;

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/connect-sorare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Cuenta conectada correctamente.");
    } else {
      setMessage(data.error ?? "Ha ocurrido un error.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl font-bold text-white">Conectar Sorare</h1>

      <p className="mt-3 text-zinc-400">
        Introduce el nombre de usuario (slug) de tu cuenta de Sorare.
      </p>

      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Ejemplo: nahuel98"
        className="mt-8 w-full rounded-xl border border-purple-900 bg-[#17112F] p-4 text-white outline-none"
      />

      <button
        onClick={connect}
        disabled={loading}
        className="mt-6 rounded-xl bg-purple-600 px-8 py-4 font-bold hover:bg-purple-500 disabled:opacity-50"
      >
        {loading ? "Conectando..." : "Conectar"}
      </button>

      {message && <p className="mt-6 text-lg text-green-400">{message}</p>}
    </div>
  );
}
