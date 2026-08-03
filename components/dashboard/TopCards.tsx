import {
  Trophy,
  Crown,
} from "lucide-react";

type Card = {
  playerName: string;
  marketValue: number | null;
};

type Props = {
  cards: Card[];
};

export default function TopCards({ cards }: Props) {
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
            Top cartas
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Tus activos con mayor valor de mercado.
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
          bg-yellow-500/10
          "
        >
          <Trophy
            className="text-yellow-400"
            size={24}
          />
        </div>

      </div>



      <div className="mt-8 space-y-4">

        {cards.length === 0 && (
          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-6
            text-center
            text-zinc-400
            "
          >
            No hay cartas sincronizadas todavía.
          </div>
        )}



        {cards.map((card, index) => (

          <div
            key={index}
            className="
            group
            flex
            items-center
            justify-between
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

            <div className="flex items-center gap-4">


              <div
                className={`
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                font-black
                ${
                  index === 0
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-violet-500/20 text-violet-300"
                }
                `}
              >
                {index === 0 ? (
                  <Crown size={22}/>
                ) : (
                  `#${index + 1}`
                )}
              </div>



              <div>

                <p
                  className="
                  font-bold
                  text-white
                  group-hover:text-violet-300
                  transition
                  "
                >
                  {card.playerName}
                </p>


                <p className="mt-1 text-sm text-zinc-500">
                  Carta #{index + 1}
                </p>

              </div>


            </div>



            <div className="text-right">

              <p
                className="
                text-xl
                font-black
                text-green-400
                "
              >
                €{(card.marketValue ?? 0).toFixed(2)}
              </p>


              <p className="text-xs text-zinc-500">
                Valor estimado
              </p>

            </div>


          </div>

        ))}

      </div>

    </div>
  );
}