"use client";

type Card = {
  scarcity: string;
  marketValue: number | null;
};


export default function CollectionDistribution({
  cards,
}: {
  cards: Card[];
}) {

  const rarities = [
    {
      key: "limited",
      label: "Limited",
    },
    {
      key: "rare",
      label: "Rare",
    },
    {
      key: "super_rare",
      label: "Super Rare",
    },
    {
      key: "unique",
      label: "Unique",
    },
  ];


  return (

    <div
      className="
      mb-8
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-6
      "
    >

      <h2
        className="
        mb-6
        text-2xl
        font-black
        text-white
        "
      >
        📊 Distribución de colección
      </h2>


      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-5
        "
      >

        {
          rarities.map((rarity)=>{

            const rarityCards =
              cards.filter(
                (card)=>
                  card.scarcity === rarity.key
              );


            const value =
              rarityCards.reduce(
                (sum,card)=>
                  sum + (card.marketValue ?? 0),
                0
              );


            return (

              <div
                key={rarity.key}
                className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
                "
              >

                <p className="text-zinc-400">
                  {rarity.label}
                </p>


                <h3
                  className="
                  mt-3
                  text-3xl
                  font-black
                  text-white
                  "
                >
                  {rarityCards.length}
                </h3>


                <p
                  className="
                  mt-2
                  font-bold
                  text-green-400
                  "
                >
                  {value.toFixed(2)}€
                </p>

              </div>

            );

          })
        }

      </div>

    </div>

  );

}