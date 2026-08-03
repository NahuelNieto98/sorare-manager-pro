import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { getUserCards } from "@/lib/sorare/getUserCards";
import { importGallery } from "@/lib/sorare/importGallery";


export async function POST() {

  const session = await auth();


  if (!session?.user?.email) {

    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );

  }



  const user = await prisma.user.findUnique({

    where: {
      email: session.user.email,
    },

    include: {
      sorareAccount: true,
    },

  });




  if (!user) {

    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );

  }





  if (!user.sorareAccount) {

    return NextResponse.json(
      {
        error: "No hay una cuenta de Sorare conectada.",
      },
      {
        status: 400,
      }
    );

  }





  const slug = user.sorareAccount.slug;



  console.log(
    "🔥 Sincronizando usuario:",
    slug
  );





  const cards = await getUserCards(slug);




  await importGallery(
    user.id,
    cards
  );





  const importedCards =
    await prisma.card.count({

      where: {
        ownerId: user.id,
      },

    });





  return NextResponse.json({

    success: true,

    importedCards,

    slug,

    message:
      "Galería sincronizada correctamente. Actualizando valores próximamente.",

  });


}