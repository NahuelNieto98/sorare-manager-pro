"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ShieldCheck,
  Sparkles,
  WalletCards,
  Loader2,
} from "lucide-react";


export default function ConnectPage() {


  const router = useRouter();


  const [slug,setSlug] = useState("");

  const [loading,setLoading] = useState(false);

  const [error,setError] = useState("");




  async function connectSorare(){


    if(!slug.trim()){

      setError("Introduce tu usuario de Sorare");

      return;

    }



    try {


      setLoading(true);

      setError("");



      const res = await fetch(
        "/api/connect-sorare",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",
          },

          body:JSON.stringify({
            slug,
          }),

        }
      );



      const json = await res.json();



      if(!res.ok){

        throw new Error(
          json.error || "Error conectando Sorare"
        );

      }



      router.push("/es/dashboard");



    } catch(err:any){


      setError(
        err.message || "Error desconocido"
      );


    } finally {


      setLoading(false);


    }


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

          Sorare Manager Pro Beta

        </div>




        <h1
          className="
          mt-10
          text-5xl
          font-black
          "
        >

          Conecta tu cuenta

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

          Introduce tu username de Sorare para importar tu
          colección y empezar a analizar tus cartas.

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


          <label
            className="
            block
            text-left
            text-sm
            font-bold
            text-zinc-300
            "
          >

            Username de Sorare

          </label>




          <input

            value={slug}

            onChange={(e)=>setSlug(e.target.value)}

            placeholder="ej: lightenN1"

            className="
            mt-3
            w-full
            rounded-xl
            border
            border-white/10
            bg-black/20
            px-4
            py-3
            text-white
            outline-none
            focus:border-violet-500
            "

          />




          {
            error && (

              <p
                className="
                mt-3
                text-sm
                text-red-400
                "
              >

                {error}

              </p>

            )
          }





          <button

            type="button"

            onClick={connectSorare}

            disabled={loading}

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
            disabled:opacity-50
            "

          >

            {
              loading ? (

                <>
                  <Loader2
                    className="animate-spin"
                    size={20}
                  />

                  Conectando...

                </>

              ) : (

                <>
                  🚀 Conectar Sorare
                </>

              )
            }


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
            title="Seguro"
            text="Solo guardamos la conexión de tu cuenta."
          />


          <InfoCard
            icon={<WalletCards />}
            title="Colección"
            text="Analiza tus cartas automáticamente."
          />


          <InfoCard
            icon={<Sparkles />}
            title="Analytics"
            text="Controla valor y rendimiento."
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