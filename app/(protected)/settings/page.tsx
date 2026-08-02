"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [slug, setSlug] = useState("");

  async function connect() {
    const res = await fetch("/api/connect-sorare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug,
      }),
    });

    if (!res.ok) {
      alert("Error al conectar la cuenta");
      return;
    }

    alert("Cuenta conectada correctamente");
    setSlug("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Configuración</h1>

        <p className="mt-2 text-zinc-400">Conecta tu cuenta de Sorare.</p>
      </div>

      <div className="rounded-3xl border border-violet-700/30 bg-[#17112F] p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">Cuenta Sorare</h2>

        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Ejemplo: lightenn1"
          className="w-full rounded-xl bg-[#221A40] p-4 text-white"
        />

        <button
          onClick={connect}
          className="mt-6 rounded-xl bg-purple-600 px-8 py-3 font-bold text-white hover:bg-purple-500"
        >
          Conectar cuenta
        </button>
      </div>
    </div>
  );
}
