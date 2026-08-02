export default function Notifications() {
  const notifications = [
    {
      title: "Sincroniza tu galería",
      description: "Importa las últimas cartas desde Sorare.",
      color: "bg-blue-500",
    },
    {
      title: "Scout IA disponible",
      description: "Analiza tu galería con inteligencia artificial.",
      color: "bg-purple-500",
    },
    {
      title: "Portfolio actualizado",
      description: "Tu dashboard está listo.",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="rounded-3xl border border-purple-900 bg-[#17112F] p-8">
      <h2 className="text-2xl font-bold text-white">Notificaciones</h2>

      <div className="mt-6 space-y-4">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-2xl bg-[#221A40] p-4"
          >
            <div className={`mt-1 h-3 w-3 rounded-full ${item.color}`} />

            <div>
              <p className="font-semibold text-white">{item.title}</p>

              <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
