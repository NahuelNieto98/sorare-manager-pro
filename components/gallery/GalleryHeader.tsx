import {
  Layers3,
  Euro,
  BarChart3,
  Gem,
  Sparkles,
} from "lucide-react";


type Props = {
  totalCards: number;
  galleryValue: number;
  average: number;
};


export default function GalleryHeader({
  totalCards,
  galleryValue,
  average,
}: Props) {


  const stats = [
    {
      title: "Cartas",
      value: totalCards,
      icon: Layers3,
      color: "text-violet-300",
      bg: "bg-violet-500/10",
    },

    {
      title: "Valor",
      value: `€${galleryValue.toFixed(2)}`,
      icon: Euro,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },

    {
      title: "AA Media",
      value: average.toFixed(1),
      icon: BarChart3,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },

    {
      title: "Colección",
      value: "PRO",
      icon: Gem,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
  ];



  return (

    <div
      className="
      relative
      overflow-hidden
      mb-8
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

      <div
        className="
        absolute
        -right-20
        -top-20
        h-64
        w-64
        rounded-full
        bg-violet-500/20
        blur-3xl
        "
      />



      <div className="relative">


        <div className="flex items-center gap-4">


          <div
            className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-violet-500/20
            "
          >

            <Sparkles
              className="text-violet-300"
              size={28}
            />

          </div>



          <div>

            <h1
              className="
              text-4xl
              font-black
              text-white
              "
            >
              Gallery
            </h1>


            <p
              className="
              mt-2
              text-zinc-400
              "
            >
              Gestiona y analiza toda tu colección de Sorare.
            </p>

          </div>


        </div>





        <div
          className="
          mt-8
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
          "
        >

          {stats.map((stat) => {

            const Icon = stat.icon;


            return (

              <div
                key={stat.title}
                className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
                transition
                hover:bg-white/10
                hover:border-violet-400/30
                "
              >

                <div
                  className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${stat.bg}
                  `}
                >

                  <Icon
                    className={stat.color}
                    size={25}
                  />

                </div>



                <p
                  className="
                  mt-5
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-zinc-500
                  "
                >
                  {stat.title}
                </p>



                <h2
                  className={`
                  mt-2
                  text-3xl
                  font-black
                  ${stat.color}
                  `}
                >
                  {stat.value}
                </h2>


              </div>

            );

          })}

        </div>


      </div>


    </div>

  );
}