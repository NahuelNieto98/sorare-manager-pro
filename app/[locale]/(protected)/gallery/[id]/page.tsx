import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import AddTransactionButton from "./AddTransactionButton";


export default async function CardDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}) {


  const { id, locale } = await params;


  const t = await getTranslations("card");



  const card = await prisma.card.findUnique({

    where: {
      id,
    },

    include: {
      MarketTransaction: true,
    },

  });



  if (!card) {

    notFound();

  }




  const purchase =
    card.MarketTransaction
      .filter(
        (tx) =>
          tx.type.includes("BUY") ||
          tx.type.includes("PURCHASE") ||
          tx.type.includes("AUCTION")
      )
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )[0];




  const purchasePrice =
    purchase?.price ?? null;



  const purchaseDate =
    purchase?.date ?? null;




  const roi =
    purchasePrice && card.marketValue

      ? (
          (
            card.marketValue - purchasePrice
          )
          /
          purchasePrice
          *
          100
        ).toFixed(1)

      : null;




  return (

    <main
      className="
      mx-auto
      w-full
      max-w-6xl
      p-6
      "
    >



      <Link

        href={`/${locale}/gallery`}

        className="
        inline-block
        rounded-xl
        bg-zinc-900
        px-5
        py-3
        text-white
        "

      >

        {t("back")}


      </Link>





      <div

        className="
        mt-8
        grid
        gap-8
        lg:grid-cols-2
        "

      >



        <div

          className="
          rounded-2xl
          bg-zinc-900
          p-6
          "

        >


          {
            card.pictureUrl

            ?

            <img

              src={card.pictureUrl}

              alt={card.playerName}

              className="
              mx-auto
              max-h-[650px]
              rounded-xl
              "

            />

            :

            <div className="text-white">

              {t("noImage")}

            </div>

          }


        </div>





        <div

          className="
          rounded-2xl
          bg-zinc-900
          p-8
          text-white
          "

        >



          <h1

            className="
            text-4xl
            font-bold
            "

          >

            {card.playerName}

          </h1>



          <p className="mt-2 text-gray-400">

            {card.club ?? t("noClub")}

          </p>






          <div

            className="
            mt-8
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            "

          >



            <Info

              title={t("rarity")}

              value={card.scarcity}

            />



            <Info

              title={t("position")}

              value={card.position ?? "-"}

            />



            <Info

              title={t("aa")}

              value={
                card.averageScore?.toString()
                ??
                "-"
              }

            />



            <Info

              title={t("marketValue")}

              value={
                `€${card.marketValue?.toFixed(2) ?? "0.00"}`
              }

            />



            <Info

              title={t("purchasePrice")}

              value={
                purchasePrice
                ?
                `€${purchasePrice.toFixed(2)}`
                :
                "-"
              }

            />



            <Info

              title={t("purchaseDate")}

              value={
                purchaseDate

                ?

                new Date(purchaseDate)
                .toLocaleDateString("es-ES")

                :

                "-"
              }

            />



            <Info

              title={t("roi")}

              value={
                roi
                ?
                `${roi}%`
                :
                "-"
              }

            />



            <Info

              title={t("season")}

              value={
                card.season.toString()
              }

            />



          </div>





          <AddTransactionButton
  cardId={card.id}
  currentPrice={purchasePrice}
/>




        </div>


      </div>


    </main>

  );


}





function Info({

  title,

  value,

}: {

  title:string;

  value:string;

}) {


  return (

    <div

      className="
      rounded-xl
      bg-zinc-800
      p-4
      "

    >

      <p

        className="
        text-sm
        text-gray-400
        "

      >

        {title}

      </p>



      <p

        className="
        mt-2
        text-xl
        font-bold
        "

      >

        {value}

      </p>


    </div>

  );

}