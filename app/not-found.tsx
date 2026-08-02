import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0F0B1F] px-8 text-center text-white">
      <h1 className="text-8xl font-extrabold text-purple-500">404</h1>

      <h2 className="mt-6 text-4xl font-bold">
        Página no encontrada
      </h2>

      <p className="mt-4 max-w-xl text-zinc-400">
        La página que intentas visitar no existe.
      </p>

      <Link
        href="/"
        className="mt-10 rounded-xl bg-purple-600 px-8 py-4 font-bold hover:bg-purple-500"
      >
        Volver al inicio
      </Link>
    </main>
  );
}