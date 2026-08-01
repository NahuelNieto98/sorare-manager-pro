export default function ConnectPage() {
  return (
    <main className="min-h-screen bg-[#0F0B1F] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-[#1A1333] p-8 border border-purple-900">
        <h1 className="text-3xl font-bold text-white mb-2">
          Conectar cuenta Sorare
        </h1>

        <p className="text-zinc-400 mb-8">
          Introduce tus credenciales de Sorare para sincronizar tu galería.
        </p>

        <form className="space-y-5">
          <input
            type="email"
            placeholder="Email de Sorare"
            className="w-full rounded-xl bg-[#241845] p-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-xl bg-[#241845] p-4 text-white outline-none"
          />

          <button className="w-full rounded-xl bg-purple-600 p-4 font-semibold hover:bg-purple-500 transition">
            Conectar cuenta
          </button>
        </form>
      </div>
    </main>
  );
}
