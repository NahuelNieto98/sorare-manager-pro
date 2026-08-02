export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F0B1F]">
      <div className="flex flex-col items-center gap-6">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />

        <h2 className="text-2xl font-bold text-white">
          Sorare Manager Pro
        </h2>

        <p className="text-zinc-400">
          Cargando...
        </p>
      </div>
    </main>
  );
}