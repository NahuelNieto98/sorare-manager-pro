import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json(
      { error: "Debes introducir un usuario de Sorare." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado." },
      { status: 404 },
    );
  }

  await prisma.sorareAccount.upsert({
    where: {
      userId: user.id,
    },
    update: {
      slug,
    },
    create: {
      userId: user.id,
      slug,
    },
  });

  return NextResponse.json({
    success: true,
    slug,
  });
}
