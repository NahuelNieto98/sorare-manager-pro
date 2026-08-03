import {
  Layers,
  Star,
} from "lucide-react";

type Props = {
  totalCards: number;
  average: number;
};

export default function QuickStats({
  totalCards,
  average,
}: Props) {
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
            Estadísticas rápidas
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Información general de tu colección.
          </p>
        </div>


        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-violet-500/20
          "
        >
          <Layers
            className="text-violet-300"
            size={24}
          />
        </div>

      </div>



      <div className="mt-8 space-y-4">


        <div
          className="
          flex
          items-center
          justify-between
          rounded-2xl
          border
          border-white/10
          bg-white/5
          p-5
          "
        >

          <div className="flex items-center gap-3">

            <Layers
              className="text-blue-300"
              size={22}
            />

            <span className="text-zinc-400">
              Cartas
            </span>

          </div>


          <span
            className="
            text-3xl
            font-black
            text-white
            "
          >
            {totalCards}
          </span>

        </div>



        <div
          className="
          flex
          items-center
          justify-between
          rounded-2xl
          border
          border-white/10
          bg-white/5
          p-5
          "
        >

          <div className="flex items-center gap-3">

            <Star
              className="text-yellow-400"
              size={22}
            />

            <span className="text-zinc-400">
              Media AA
            </span>

          </div>


          <span
            className="
            text-3xl
            font-black
            text-purple-300
            "
          >
            {average.toFixed(1)}
          </span>

        </div>


      </div>


      <div
        className="
        mt-8
        rounded-2xl
        border
        border-purple-500/20
        bg-purple-500/10
        p-4
        text-sm
        text-purple-200
        "
      >
        Rendimiento basado en tu colección actual.
      </div>


    </div>
  );
}