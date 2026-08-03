"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import CardItem from "@/components/gallery/CardItem";
import GalleryHeader from "@/components/gallery/GalleryHeader";
import SortDropdown from "@/components/ui/SortDropdown";


type Card = {
  id: string;
  playerName: string;
  club: string | null;
  scarcity: string;

  averageScore: number | null;

  l5Score: number | null;
  l10Score: number | null;
  l15Score: number | null;
  l40Score: number | null;

  marketValue: number | null;
  pictureUrl: string | null;
};



const rarities = [
  {
    label: "Todas",
    value: "all",
  },
  {
    label: "Limited",
    value: "limited",
  },
  {
    label: "Rare",
    value: "rare",
  },
  {
    label: "Super Rare",
    value: "super_rare",
  },
  {
    label: "Unique",
    value: "unique",
  },
];



export default function GalleryPage() {


  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");
  const [sort, setSort] = useState("value");



  useEffect(() => {

    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {

        setCards(data);
        setLoading(false);

      });

  }, []);





  const filteredCards = useMemo(() => {


    const filtered = cards.filter((card) => {


      const query = search.toLowerCase();


      const matchesSearch =
        card.playerName
          .toLowerCase()
          .includes(query) ||

        (card.club ?? "")
          .toLowerCase()
          .includes(query);



      const matchesRarity =
        rarity === "all" ||
        card.scarcity === rarity;



      return matchesSearch && matchesRarity;

    });





    return filtered.sort((a,b)=>{


      switch(sort){


        case "value":

          return (
            (b.marketValue ?? 0)
            -
            (a.marketValue ?? 0)
          );



        case "lowValue":

          return (
            (a.marketValue ?? 0)
            -
            (b.marketValue ?? 0)
          );



        case "aa":

          return (
            (b.averageScore ?? 0)
            -
            (a.averageScore ?? 0)
          );



        case "lowAA":

          return (
            (a.averageScore ?? 0)
            -
            (b.averageScore ?? 0)
          );



        case "recent":

          return 0;



        default:

          return 0;

      }


    });


  },[
    cards,
    search,
    rarity,
    sort
  ]);






  const galleryValue = cards.reduce(
    (sum,card)=>
      sum + (card.marketValue ?? 0),
    0
  );




  const average =
    cards.length === 0
      ? 0
      :
      cards.reduce(
        (sum,card)=>
          sum + (card.averageScore ?? 0),
        0
      )
      /
      cards.length;







  return (

    <>

      <GalleryHeader
        totalCards={cards.length}
        galleryValue={galleryValue}
        average={average}
      />






      <section
        className="
        mb-8
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-6
        "
      >



        <div
          className="
          flex
          items-center
          gap-3
          "
        >

          <SlidersHorizontal
            className="text-violet-300"
            size={22}
          />


          <h2
            className="
            font-bold
            text-white
            "
          >
            Filtros de colección
          </h2>


        </div>







        <div
          className="
          mt-6
          flex
          flex-col
          gap-4
          xl:flex-row
          "
        >



          <div
            className="
            relative
            flex-1
            "
          >


            <Search
              size={18}
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-zinc-500
              "
            />



            <input

              value={search}

              onChange={(e)=>
                setSearch(e.target.value)
              }

              placeholder="Buscar jugador o club..."

              className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/5
              py-3
              pl-11
              pr-4
              text-white
              outline-none
              focus:border-violet-400
              "

            />


          </div>





          <SortDropdown
            value={sort}
            onChange={setSort}
          />



        </div>







        <div
          className="
          mt-5
          flex
          flex-wrap
          gap-3
          "
        >


          {rarities.map((item)=>(

            <button

              key={item.value}

              onClick={() =>
                setRarity(item.value)
              }

              className={`

              rounded-full

              px-5

              py-2

              text-sm

              font-bold

              transition


              ${
                rarity === item.value

                ?

                "bg-violet-600 text-white"

                :

                "bg-white/5 text-zinc-400 hover:bg-white/10"

              }

              `}

            >

              {item.label}

            </button>

          ))}


        </div>





        <p className="mt-6 text-sm text-zinc-400">

          Mostrando{" "}

          <span className="font-bold text-white">

            {filteredCards.length}

          </span>

          {" "}cartas

        </p>



      </section>







      {loading ? (


        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-[#17112F]
          p-12
          text-center
          text-xl
          text-white
          "
        >

          Cargando colección...

        </div>



      ) : filteredCards.length === 0 ? (



        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-[#17112F]
          p-12
          text-center
          "
        >


          <h2
            className="
            text-3xl
            font-black
            text-white
            "
          >

            No hay cartas

          </h2>



          <p className="mt-3 text-zinc-400">

            Sincroniza tu cuenta de Sorare para empezar.

          </p>


        </div>



      ) : (



        <div
          className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-4
          "
        >


          {filteredCards.map((card) => (


            <CardItem

              key={card.id}

              id={card.id}

              playerName={card.playerName}

              club={card.club}

              pictureUrl={card.pictureUrl}

              scarcity={card.scarcity}

              marketValue={card.marketValue}

              averageScore={card.averageScore}

              l5Score={card.l5Score}

              l10Score={card.l10Score}

              l15Score={card.l15Score}

              l40Score={card.l40Score}

            />


          ))}


        </div>


      )}



    </>

  );

}