interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export default function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-[#1A1333] border border-purple-900 p-6 hover:border-purple-500 transition-all duration-300">
      <p className="text-zinc-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold text-white mt-3">{value}</h2>

      {subtitle && <p className="text-purple-400 text-sm mt-2">{subtitle}</p>}
    </div>
  );
}
