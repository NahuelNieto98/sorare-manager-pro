import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await prisma.user.create({
    data: {
      email: "test@soraremanagerpro.com",
      name: "Usuario de prueba",
      image: null,
    },
  });

  return NextResponse.json(user);
}
