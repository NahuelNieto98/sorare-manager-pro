import {
  CheckCircle2,
  Sparkles,
  Wrench,
} from "lucide-react";


const updates = [
  {
    version: "v0.9.0",
    date: "Agosto 2026",
    title: "Beta Pública",
    description:
      "Primera versión disponible para la comunidad.",
    items: [
      "Dashboard completo",
      "Gestión de colección Sorare",
      "Portfolio inicial",
      "Analytics de colección",
    ],
    type: "release",
  },

  {
    version: "v0.8.5",
    date: "Agosto 2026",
    title: "Nuevo sistema Portfolio",
    description:
      "Mejoras visuales y nuevas métricas para controlar tu colección.",
    items: [
      "Valor total de colección",
      "ROI",
      "Top Holdings",
      "Distribución de cartas",
    ],
    type: "update",
  },

  {
    version: "v0.8.0",
    date: "Julio 2026",
    title: "Nuevo Dashboard",
    description:
      "Rediseño completo del panel principal.",
    items: [
      "Nuevo diseño premium",
      "Gráficos mejorados",
      "Estado del sistema",
    ],
    type: "update",
  },
];


export default function ChangelogPage() {

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

            <Sparkles size={16}/>

            Actualizaciones

          </div>


          <h1
            className="
            mt-8
            text-5xl
            font-black
            "
          >
            Novedades de
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
            mt-6
            text-lg
            text-zinc-400
            "
          >
            Todas las mejoras y nuevas funcionalidades del proyecto.
          </p>


        </div>




        <div
          className="
          mt-16
          space-y-6
          "
        >

          {updates.map((update)=> (

            <article
              key={update.version}
              className="
              rounded-3xl
              border
              border-white/10
              bg-[#17112F]
              p-8
              "
            >

              <div
                className="
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-start
                md:justify-between
                "
              >

                <div>

                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    "
                  >

                    {update.type === "release" ? (
                      <CheckCircle2
                        className="text-green-400"
                      />
                    ) : (
                      <Wrench
                        className="text-violet-400"
                      />
                    )}


                    <h2
                      className="
                      text-2xl
                      font-black
                      "
                    >
                      {update.title}
                    </h2>


                  </div>


                  <p
                    className="
                    mt-3
                    text-zinc-400
                    "
                  >
                    {update.description}
                  </p>

                </div>


                <div
                  className="
                  text-right
                  "
                >

                  <p
                    className="
                    font-black
                    text-violet-300
                    "
                  >
                    {update.version}
                  </p>


                  <p
                    className="
                    text-sm
                    text-zinc-500
                    "
                  >
                    {update.date}
                  </p>


                </div>


              </div>



              <ul
                className="
                mt-6
                space-y-3
                "
              >

                {update.items.map((item)=> (

                  <li
                    key={item}
                    className="
                    flex
                    items-center
                    gap-3
                    text-zinc-300
                    "
                  >

                    <CheckCircle2
                      size={18}
                      className="text-green-400"
                    />

                    {item}

                  </li>

                ))}


              </ul>


            </article>


          ))}


        </div>


      </div>


    </main>

  );

}