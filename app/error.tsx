"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0F0B1F] text-white">
      <h1 className="text-5xl font-bold">
        Ha ocurrido un error
      </h1>

      <p className="mt-5 text-zinc-400">
        Inténtalo de nuevo.
      </p>

      <button
        onClick={reset}
        className="mt-8 rounded-xl bg-purple-600 px-8 py-3 font-bold"
      >
        Reintentar
      </button>
    </main>
  );
}