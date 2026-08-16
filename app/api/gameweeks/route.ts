import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gameWeeks = await prisma.gameWeek.findMany({
      orderBy: [
        {
          season: "desc",
        },
        {
          number: "asc",
        },
      ],
    });

    return NextResponse.json({
      gameWeeks,
    });
  } catch (error) {
    console.error("Error cargando Game Weeks:", error);

    return NextResponse.json(
      {
        error: "No se pudieron cargar las Game Weeks",
      },
      {
        status: 500,
      }
    );
  }
}
