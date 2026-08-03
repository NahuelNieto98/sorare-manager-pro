import {
  Bot,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Target,
  Lock,
} from "lucide-react";

export default function ScoutCard() {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-[#1b1535]
      via-[#24184a]
      to-[#120e25]
      p-8
      shadow-xl
      "
    >

      <div
        className="
        absolute
        -right-20
        -top-20
        h-64
        w-64
        rounded-full
        bg-purple-500/20
        blur-3xl
        "
      />


      <div className="relative">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div
              className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-purple-500/20
              "
            >
              <Bot
                className="text-purple-300"
                size={30}
              />
            </div>


            <div>

              <h2 className="text-2xl font-black text-white">
                Scout IA
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Inteligencia para tu galería Sorare
              </p>

            </div>

          </div>


          <span
            className="
            rounded-full
            bg-yellow-500/20
            px-4
            py-1
            text-xs
            font-bold
            text-yellow-400
            "
          >
            BETA
          </span>

        </div>



        <p
          className="
          mt-8
          text-zinc-400
          leading-relaxed
          "
        >
          Scout IA analizará tu portfolio para detectar oportunidades,
          riesgos y movimientos estratégicos antes que el mercado.
        </p>



        <div
          className="
          mt-8
          space-y-3
          "
        >

          <Feature
            icon={<TrendingUp size={20}/>}
            text="Recomendaciones de compra"
          />

          <Feature
            icon={<TrendingDown size={20}/>}
            text="Alertas de venta"
          />

          <Feature
            icon={<Target size={20}/>}
            text="Optimización de alineaciones"
          />

          <Feature
            icon={<ShieldAlert size={20}/>}
            text="Detección de riesgos"
          />

        </div>



        <button
          className="
          mt-8
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          bg-purple-600
          py-4
          font-bold
          text-white
          transition
          hover:bg-purple-500
          "
        >
          <Lock size={18}/>
          Disponible próximamente
        </button>



        <div
          className="
          mt-6
          flex
          items-center
          justify-center
          gap-2
          text-xs
          text-zinc-500
          "
        >
          <Sparkles size={14}/>
          Próximamente con análisis automático
        </div>


      </div>

    </div>
  );
}



function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {

  return (
    <div
      className="
      flex
      items-center
      gap-4
      rounded-2xl
      border
      border-white/10
      bg-white/5
      p-4
      "
    >

      <div
        className="
        text-purple-300
        "
      >
        {icon}
      </div>


      <p className="font-medium text-white">
        {text}
      </p>

    </div>
  );
}