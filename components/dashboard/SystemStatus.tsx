export default function SystemStatus() {
  return (
    <div className="rounded-3xl border border-purple-900 bg-[#17112F] p-8">
      <h2 className="text-2xl font-bold text-white">Estado del sistema</h2>

      <div className="mt-8 space-y-5">
        <Status label="API Sorare" status />

        <Status label="Base de datos" status />

        <Status label="Dashboard" status />

        <Status label="Scout IA" status={false} />
      </div>
    </div>
  );
}

function Status({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-white">{label}</p>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          status ? "bg-green-600" : "bg-yellow-600"
        }`}
      >
        {status ? "ONLINE" : "BETA"}
      </span>
    </div>
  );
}
