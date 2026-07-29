export default function Header() {
  return (
    <header className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>

        <p className="text-zinc-400 mt-2">Bienvenido a Sorare Manager Pro</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl bg-purple-600 px-5 py-3 hover:bg-purple-500 transition">
          Conectar Sorare
        </button>

        <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center font-bold">
          N
        </div>
      </div>
    </header>
  );
}
