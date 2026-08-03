"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function SyncGalleryButton() {
  const [loading, setLoading] = useState(false);

  async function syncGallery() {
    setLoading(true);

    try {
      const res = await fetch("/api/sync-gallery", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error();
      }

      window.location.reload();

    } catch {

      alert("Error sincronizando la galería.");

    } finally {

      setLoading(false);

    }
  }


  return (
    <button
      onClick={syncGallery}
      disabled={loading}
      className="flex items-center gap-3 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-500 disabled:opacity-50"
    >

      <RefreshCw
        size={20}
        className={loading ? "animate-spin" : ""}
      />

      {loading
        ? "Sincronizando..."
        : "Sincronizar galería"
      }

    </button>
  );
}