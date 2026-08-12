"use client";

import {
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";


export default function ConnectPage() {

const t = useTranslations("connectPage");
const params = useParams<{ locale: string }>();


  


  function connectSorare() {

    window.location.href =
      `/api/sorare/connect?locale=${params.locale}`;

  }



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
        flex
        max-w-3xl
        flex-col
        items-center
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

          {t("badge")}

        </div>




        <h1
          className="
          mt-10
          text-5xl
          font-black
          "
        >

          {t("title")}

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

            Sorare

          </span>


        </h1>





        <p
          className="
          mt-6
          max-w-xl
          text-lg
          text-zinc-400
          "
        >

          {t("description")}

        </p>





        <div
          className="
          mt-10
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-[#17112F]
          p-8
          "
        >



          <div
            className="
            rounded-2xl
            border
            border-violet-500/20
            bg-violet-500/10
            p-5
            text-left
            "
          >

            <p
              className="
              font-bold
              text-violet-300
              "
            >
              🔐 {t("secure.title")}
            </p>


            <p
              className="
              mt-2
              text-sm
              text-zinc-400
              "
            >
              {t("secure.description")}
            </p>


          </div>





          <button

            type="button"

            onClick={connectSorare}

            className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-violet-600
            to-blue-600
            px-6
            py-4
            font-black
            transition
            hover:scale-[1.02]
            "
          >

            🔗 {t("button")}


          </button>



        </div>





        <div
          className="
          mt-10
          grid
          gap-4
          md:grid-cols-3
          "
        >


          <InfoCard
            icon={<ShieldCheck />}
            title={t("cards.security.title")}
            text={t("cards.security.text")}
          />


          <InfoCard
            icon={<WalletCards />}
            title={t("cards.collection.title")}
            text={t("cards.collection.text")}
          />


          <InfoCard
            icon={<Sparkles />}
            title={t("cards.analytics.title")}
            text={t("cards.analytics.text")}
          />


        </div>



      </div>


    </main>

  );

}





function InfoCard({

icon,
title,
text,

}:{

icon:React.ReactNode;

title:string;

text:string;

}) {


return (

<div
  className="
  rounded-2xl
  border
  border-white/10
  bg-[#17112F]
  p-5
  "
>
 

  <div className="text-violet-400">

    {icon}

  </div>



  <h3
    className="
    mt-4
    font-black
    "
  >

    {title}

  </h3>



  <p
    className="
    mt-2
    text-sm
    text-zinc-400
    "
  >

    {text}

  </p>


</div>

);


}