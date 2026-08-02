import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      sorareAccount: true,
    },
  });

  if (!user?.sorareAccount) {
    return NextResponse.json({ connected: false }, { status: 404 });
  }

  return NextResponse.json({
    connected: true,
    slug: user.sorareAccount.slug,
  });
}
