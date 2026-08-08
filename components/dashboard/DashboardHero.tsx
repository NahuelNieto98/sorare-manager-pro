"use client";

import {
  Wallet,
  Layers,
  Sparkles,
} from "lucide-react";

import SyncGalleryButton from "@/components/dashboard/SyncGalleryButton";


type DashboardHeroProps = {
  galleryValue: number;
  totalCards: number;
};


export default function DashboardHero({
  galleryValue,
  totalCards,
}: DashboardHeroProps) {


  return (

    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-[#24194d]
      via-[#17132f]
      to-[#0f0b1f]
      p-10
      shadow-2xl
      "
    >


      <div
        className="
        absolute
        -right-20
        -top-20
        h-72
        w-72
        rounded-full
        bg-purple-500/20
        blur-3xl
        "
      />


      <div
        className="
        relative
        flex
        flex-col
        gap-8
        xl:flex-row
        xl:items-center
        xl:justify-between
        "
      >


        <div>


          <div
            className="
            flex
            items-center
            gap-2
            text-sm
            font-bold
            uppercase
            tracking-widest
            text-violet-300
            "
          >

            <Sparkles size={16}/>

            Sorare Manager Pro Beta

          </div>



          <h1
            className="
            mt-3
            text-5xl
            font-black
            text-white
            "
          >

            Tu centro de gestión Sorare


          </h1>



          <p
            className="
            mt-4
            max-w-xl
            text-lg
            text-zinc-400
            "
          >

            Analiza tu colección, controla el valor de tus cartas
            y mejora tus decisiones en Sorare.

          </p>


          <div className="mt-6">

            <SyncGalleryButton />

          </div>


        </div>




        <div
          className="
          flex
          gap-4
          "
        >


          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-6
            py-5
            "
          >

            <Wallet
              size={22}
              className="text-violet-300"
            />


            <p
              className="
              mt-3
              text-3xl
              font-black
              text-white
              "
            >

              €
              {galleryValue.toLocaleString(
                "es-ES",
                {
                  minimumFractionDigits:2
                }
              )}

            </p>


            <p className="text-xs text-zinc-400">
              Valor colección
            </p>

          </div>




          <div
            className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-6
            py-5
            "
          >

            <Layers
              size={22}
              className="text-blue-300"
            />


            <p
              className="
              mt-3
              text-3xl
              font-black
              text-white
              "
            >

              {totalCards}

            </p>


            <p className="text-xs text-zinc-400">
              Cartas
            </p>

          </div>



        </div>


      </div>


    </div>

  );

}