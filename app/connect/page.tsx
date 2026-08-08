import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  ShieldCheck,
  Zap,
  Database,
  BarChart3,
  RefreshCw,
  CheckCircle,
} from "lucide-react";



export default async function ConnectPage() {


  const session =
    await auth();



  const user =
    await prisma.user.findUnique({

      where:{
        email:
          session?.user?.email ?? "",
      },

      include:{
        sorareAccount:true,
      },

    });



  const sorareAccount =
    user?.sorareAccount;






  async function connectSorare() {

    "use server";

    redirect(
      "/api/sorare/connect"
    );

  }







  return (

    <div
      className="
      mx-auto
      mt-24
      max-w-2xl
      "
    >

      <div
        className="
        rounded-3xl
        border
        border-violet-700/30
        bg-gradient-to-br
        from-[#181530]
        via-[#221B45]
        to-[#141127]
        p-10
        shadow-xl
        "
      >


        <div
          className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          bg-violet-500/20
          "
        >

          <Zap
            size={32}
            className="text-violet-300"
          />

        </div>





        {sorareAccount ? (


          <>

            <h1
              className="
              mt-6
              text-4xl
              font-black
              text-white
              "
            >
              Cuenta Sorare conectada
            </h1>



            <p
              className="
              mt-4
              text-zinc-400
              "
            >
              Tu cuenta está vinculada correctamente con Sorare Manager Pro.
            </p>




            <div
              className="
              mt-8
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-green-500/20
              bg-green-500/10
              p-5
              "
            >

              <CheckCircle
                size={30}
                className="text-green-400"
              />


              <div>

                <p className="text-sm text-zinc-400">
                  Usuario conectado
                </p>


                <p className="text-xl font-bold text-white">
                  {sorareAccount.slug}
                </p>

              </div>


            </div>





            <a
              href="/dashboard"
              className="
              mt-8
              block
              rounded-xl
              bg-violet-600
              py-4
              text-center
              font-bold
              text-white
              hover:bg-violet-500
              "
            >

              Ir al Dashboard

            </a>


          </>


        ) : (


          <>


            <h1
              className="
              mt-6
              text-4xl
              font-black
              text-white
              "
            >
              Conecta tu cuenta de Sorare
            </h1>



            <p
              className="
              mt-4
              text-zinc-400
              "
            >
              Autoriza a Sorare Manager Pro para acceder a tu galería y sincronizar automáticamente tus cartas.
            </p>





            <form action={connectSorare}>

              <button

                className="
                mt-8
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-violet-600
                py-4
                font-bold
                text-white
                hover:bg-violet-500
                "
              >

                🔗 Conectar con Sorare

              </button>


            </form>




            <div
              className="
              mt-10
              rounded-2xl
              bg-white/5
              p-6
              "
            >

              <h2 className="font-bold text-white">
                ¿Qué obtendrás?
              </h2>


              <ul className="mt-4 space-y-3 text-zinc-300">

                <li className="flex gap-2">
                  <Database size={18}/>
                  Galería sincronizada automáticamente
                </li>


                <li className="flex gap-2">
                  <BarChart3 size={18}/>
                  Valor de mercado y ROI
                </li>


                <li className="flex gap-2">
                  <RefreshCw size={18}/>
                  Actualización de cartas y precios
                </li>


              </ul>


            </div>


          </>


        )}


      </div>


    </div>

  );

}