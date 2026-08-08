import {
  CheckCircle2,
  Clock3,
  Rocket,
  Sparkles,
} from "lucide-react";


const roadmap = [
  {
    title: "Dashboard Premium",
    description:
      "Panel completo con estadísticas, valor de colección, transacciones y estado de cuenta.",
    status: "Completado",
    done: true,
  },
  {
    title: "Portfolio Intelligence",
    description:
      "Análisis avanzado de ROI, distribución de cartera y evolución del valor.",
    status: "En desarrollo",
    done: false,
  },
  {
    title: "Scout IA",
    description:
      "Recomendaciones inteligentes para detectar oportunidades y riesgos.",
    status: "Próximamente",
    done: false,
  },
  {
    title: "Market Scanner Pro",
    description:
      "Encontrar cartas infravaloradas y oportunidades de mercado.",
    status: "Próximamente",
    done: false,
  },
  {
    title: "Watchlist",
    description:
      "Seguimiento de jugadores favoritos y evolución de precios.",
    status: "Próximamente",
    done: false,
  },
  {
    title: "Squad Builder IA",
    description:
      "Crear alineaciones optimizadas según competición y presupuesto.",
    status: "Futuro",
    done: false,
  },
];


export default function RoadmapPage() {

  return (

    <main
      className="
      min-h-screen
      bg-[#090714]
      px-8
      py-16
      text-white
      "
    >

      <div
        className="
        mx-auto
        max-w-5xl
        "
      >

        <div
          className="
          text-center
          "
        >

          <div
            className="
            mx-auto
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-violet-500/20
            bg-violet-500/10
            px-5
            py-2
            text-sm
            font-bold
            text-violet-300
            "
          >

            <Rocket size={16}/>

            Roadmap público

          </div>


          <h1
            className="
            mt-8
            text-5xl
            font-black
            "
          >
            El futuro de
            <span
              className="
              block
              bg-gradient-to-r
              from-violet-400
              to-blue-400
              bg-clip-text
              text-transparent
              "
            >
              Sorare Manager Pro
            </span>
          </h1>


          <p
            className="
            mx-auto
            mt-6
            max-w-2xl
            text-lg
            text-zinc-400
            "
          >
            Estamos construyendo una herramienta completa
            para ayudarte a gestionar y mejorar tu colección Sorare.
          </p>


        </div>



        <div
          className="
          mt-16
          space-y-5
          "
        >

          {roadmap.map((item)=> (

            <div
              key={item.title}
              className="
              rounded-3xl
              border
              border-white/10
              bg-[#17112F]
              p-7
              transition
              hover:border-violet-500/40
              "
            >

              <div
                className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-center
                md:justify-between
                "
              >

                <div>

                  <h2
                    className="
                    flex
                    items-center
                    gap-3
                    text-2xl
                    font-black
                    "
                  >

                    {item.done ? (
                      <CheckCircle2
                        className="text-green-400"
                      />
                    ) : (
                      <Clock3
                        className="text-violet-400"
                      />
                    )}

                    {item.title}

                  </h2>


                  <p
                    className="
                    mt-3
                    text-zinc-400
                    "
                  >
                    {item.description}
                  </p>


                </div>


                <span
                  className={`
                  rounded-full
                  border
                  px-4
                  py-2
                  text-sm
                  font-bold

                  ${
                    item.done
                    ?
                    "border-green-500/20 bg-green-500/10 text-green-400"
                    :
                    "border-violet-500/20 bg-violet-500/10 text-violet-300"
                  }

                  `}
                >

                  {item.status}

                </span>


              </div>


            </div>

          ))}

        </div>



        <div
          className="
          mt-16
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-8
          text-center
          "
        >

          <Sparkles
            className="
            mx-auto
            text-violet-400
            "
          />


          <h2
            className="
            mt-4
            text-3xl
            font-black
            "
          >
            Forma parte del desarrollo
          </h2>


          <p
            className="
            mt-3
            text-zinc-400
            "
          >
            Tu feedback ayuda a decidir las próximas funcionalidades.
          </p>


        </div>


      </div>


    </main>

  );

}