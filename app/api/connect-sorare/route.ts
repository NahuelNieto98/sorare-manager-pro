import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }


  const body = await req.json();

  const slug = body.slug;


  if (!slug) {
    return NextResponse.json(
      { error: "Slug de Sorare requerido" },
      { status: 400 }
    );
  }


  // Limpiamos el slug antes de guardarlo
  const cleanSlug = slug
    .trim()
    .toLowerCase();



  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });


  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }



  await prisma.sorareAccount.upsert({
    where: {
      userId: user.id,
    },

    update: {
      slug: cleanSlug,
    },

    create: {
      slug: cleanSlug,
      userId: user.id,
    },
  });



  console.log(
    "Sorare conectado:",
    cleanSlug
  );



  return NextResponse.json({
    success: true,
    slug: cleanSlug,
  });
}