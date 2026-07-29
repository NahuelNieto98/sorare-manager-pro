import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/common/Header";
import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0F0B1F] text-white flex">
      <Sidebar />

      <section className="flex-1 p-10">
        <Header />

        <div className="grid grid-cols-4 gap-6">
          <StatCard
            title="Valor Galería"
            value="0 €"
            subtitle="Sincroniza tu cuenta"
          />

          <StatCard title="ROI" value="0 %" subtitle="Sin datos" />

          <StatCard title="Premios" value="0" subtitle="Temporada 26/27" />

          <StatCard title="Essence" value="0" subtitle="Disponible" />
        </div>

        <div className="mt-8 rounded-2xl border border-purple-900 bg-[#1A1333] h-[450px] flex items-center justify-center">
          <p className="text-zinc-500 text-lg">
            📈 Próximamente: gráfico de evolución de la galería
          </p>
        </div>
      </section>
    </main>
  );
}
