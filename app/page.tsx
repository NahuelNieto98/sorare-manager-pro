import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F0B1F] text-white flex items-center justify-center">
      <div className="text-center max-w-3xl px-6">
        <h1 className="text-6xl font-bold text-purple-400">
          Sorare Manager Pro
        </h1>

        <p className="text-xl text-zinc-300 mt-8">
          Gestiona tu cuenta de Sorare como un profesional.
        </p>

        <p className="text-zinc-500 mt-4">
          Estadísticas, ROI, compras, ventas, premios, crafteos y mucho más.
        </p>

        <Link
          href="/dashboard"
          className="inline-block mt-10 rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold hover:bg-purple-500 transition"
        >
          Entrar al Dashboard
        </Link>
      </div>
    </main>
  );
}
