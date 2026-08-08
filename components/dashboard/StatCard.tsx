"use client";

import {
  Wallet,
  ShoppingCart,
  CircleDollarSign,
  TrendingUp,
  Sparkles,
  Layers,
} from "lucide-react";


type Props = {
  title: string;
  value: string;
  subtitle: string;
};



function getIcon(title:string) {

  switch(title) {

    case "Valor galería":
      return <Wallet size={32}/>;


    case "Comprado":
      return <ShoppingCart size={32}/>;


    case "Vendido":
      return <CircleDollarSign size={32}/>;


    case "Beneficio":
      return <TrendingUp size={32}/>;


    case "ROI":
      return <TrendingUp size={32}/>;


    case "Cartas":
      return <Layers size={32}/>;


    default:
      return <Sparkles size={32}/>;

  }

}



function formatValue(value:string) {

  return value;

}





export default function StatCard({

  title,
  value,
  subtitle,

}:Props) {


  return (

    <div

      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-[#211943]
      via-[#18142f]
      to-[#0f0b1f]
      p-7
      shadow-xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-violet-400/40
      "

    >


      <div

        className="
        absolute
        -right-20
        -top-20
        h-52
        w-52
        rounded-full
        bg-violet-500/20
        blur-3xl
        transition
        group-hover:bg-violet-400/30
        "

      />



      <div

        className="
        relative
        flex
        items-start
        justify-between
        "

      >


        <div>


          <p

            className="
            text-xs
            font-bold
            uppercase
            tracking-widest
            text-zinc-400
            "

          >

            {title}

          </p>




          <h2

            className="
            mt-5
            text-5xl
            font-black
            tracking-tight
            text-white
            "

          >

            {formatValue(value)}

          </h2>




          <p

            className="
            mt-3
            text-sm
            text-zinc-400
            "

          >

            {subtitle}

          </p>


        </div>





        <div

          className="
          relative
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/5
          text-violet-300
          transition
          duration-300
          group-hover:scale-110
          "

        >


          <div

            className="
            absolute
            inset-0
            rounded-2xl
            bg-violet-500/20
            blur-xl
            "

          />


          <div className="relative">

            {getIcon(title)}

          </div>


        </div>



      </div>





      <div

        className="
        mt-8
        flex
        items-center
        gap-2
        text-xs
        font-semibold
        text-emerald-400
        "

      >

        <TrendingUp size={14}/>

        Datos actualizados


      </div>




    </div>

  );

}