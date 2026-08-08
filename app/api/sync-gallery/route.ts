import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { getUserCards } from "@/lib/sorare/getUserCards";
import { importGallery } from "@/lib/sorare/importGallery";


export async function POST() {

  console.log(
    "🚀 API SYNC LLAMADA"
  );


  try {


    const session =
      await auth();



    console.log(
      "SESSION:",
      session?.user?.email
    );



    if(!session?.user?.email) {


      return NextResponse.json(

        {
          error:"No autorizado"
        },

        {
          status:401
        }

      );

    }



    const user =
      await prisma.user.findUnique({

        where:{
          email:
            session.user.email
        },

        include:{
          sorareAccount:true
        }

      });




    if(!user) {


      return NextResponse.json(

        {
          error:"Usuario no encontrado"
        },

        {
          status:404
        }

      );

    }




    console.log(
      "SORARE ACCOUNT:",
      user.sorareAccount?.slug
    );




    if(!user.sorareAccount) {


      return NextResponse.json(

        {
          error:"Sin cuenta Sorare"
        },

        {
          status:400
        }

      );

    }





    const accessToken =
      user.sorareAccount.accessToken;





    if(!accessToken) {


      return NextResponse.json(

        {
          error:
            "La cuenta Sorare no tiene token OAuth"
        },

        {
          status:400
        }

      );

    }





    console.log(
      "🔐 Usando OAuth Sorare"
    );





    console.time(
      "⏱️ GET USER CARDS"
    );


    const cards =
      await getUserCards(

        accessToken

      );


    console.timeEnd(
      "⏱️ GET USER CARDS"
    );





    console.log(

      "🃏 CARTAS RECIBIDAS:",

      cards.length

    );





    console.time(
      "⏱️ IMPORT GALLERY"
    );


    await importGallery(

      user.id,

      cards

    );


    console.timeEnd(
      "⏱️ IMPORT GALLERY"
    );





    console.log(

      "✅ SYNC FINALIZADA"

    );





    return NextResponse.json({

      success:true,

      cards:
        cards.length

    });



  } catch(error:any) {



    console.error(

      "❌ ERROR SYNC:",

      error

    );





    return NextResponse.json(

      {

        error:
          error.message

      },

      {

        status:500

      }

    );


  }

}