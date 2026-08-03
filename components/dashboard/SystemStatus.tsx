import {
  CheckCircle2,
  Clock3,
  Database,
  Bot,
  Globe2,
} from "lucide-react";

export default function SystemStatus() {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-[#1b1535]
      via-[#221a45]
      to-[#120e25]
      p-8
      shadow-xl
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">
            Estado del sistema
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Monitorización de Sorare Manager Pro
          </p>
        </div>

        <div className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-green-500/10
          "
        >
          <CheckCircle2
            className="text-green-400"
            size={26}
          />
        </div>
      </div>


      <div className="mt-8 space-y-4">

        <Status
          label="API Sorare"
          status="ONLINE"
          icon={<Globe2 size={20} />}
        />


        <Status
          label="Base de datos"
          status="ONLINE"
          icon={<Database size={20} />}
        />


        <Status
          label="Dashboard"
          status="ONLINE"
          icon={<CheckCircle2 size={20} />}
        />


        <Status
          label="Scout IA"
          status="BETA"
          icon={<Bot size={20} />}
        />

      </div>


      <div
        className="
        mt-8
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-4
        "
      >
        <Clock3
          size={18}
          className="text-violet-300"
        />

        <p className="text-sm text-zinc-400">
          Sistema preparado para la beta privada
        </p>
      </div>

    </div>
  );
}


function Status({
  label,
  status,
  icon,
}: {
  label: string;
  status: "ONLINE" | "BETA";
  icon: React.ReactNode;
}) {

  const online = status === "ONLINE";

  return (
    <div
      className="
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-white/10
      bg-white/5
      px-4
      py-4
      transition
      hover:bg-white/10
      "
    >

      <div className="flex items-center gap-3">

        <div
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-white/5
          text-zinc-300
          "
        >
          {icon}
        </div>

        <p className="font-semibold text-white">
          {label}
        </p>

      </div>


      <span
        className={`
        rounded-full
        px-4
        py-1
        text-xs
        font-bold
        ${
          online
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-400"
        }
        `}
      >
        {status}
      </span>

    </div>
  );
}