import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VALID_SLOTS = [
  "GK",
  "DEF",
  "MID",
  "FWD",
  "EXTRA",
] as const;

type Slot = (typeof VALID_SLOTS)[number];

export async function GET(request: Request) {
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
    select: {
      id: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const gameWeekId = searchParams.get("gameWeekId");

  const lineups = await prisma.lineup.findMany({
    where: {
      userId: user.id,
      ...(gameWeekId
        ? {
            gameWeekId,
          }
        : {}),
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      gameWeek: true,
      players: {
        orderBy: {
          slot: "asc",
        },
        include: {
          card: true,
        },
      },
    },
  });

  return NextResponse.json({
    lineups,
  });
}

export async function POST(request: Request) {
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
    select: {
      id: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  let body: {
    name?: string;
    gameWeekId?: string;
    players?: {
      cardId?: string;
      slot?: string;
      captain?: boolean;
    }[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido" },
      { status: 400 }
    );
  }

  const name = body.name?.trim();
  const gameWeekId = body.gameWeekId?.trim();
  const players = body.players;

  if (!name) {
    return NextResponse.json(
      { error: "El nombre de la alineación es obligatorio" },
      { status: 400 }
    );
  }

  if (!gameWeekId) {
    return NextResponse.json(
      { error: "La Game Week es obligatoria" },
      { status: 400 }
    );
  }

  if (!Array.isArray(players)) {
    return NextResponse.json(
      { error: "Los jugadores deben ser un array" },
      { status: 400 }
    );
  }

  if (players.length !== 5) {
    return NextResponse.json(
      { error: "Una alineación debe tener exactamente 5 jugadores" },
      { status: 400 }
    );
  }

  const slots = players.map((player) => player.slot);

  if (
    slots.some(
      (slot): slot is string =>
        !slot || !VALID_SLOTS.includes(slot as Slot)
    )
  ) {
    return NextResponse.json(
      { error: "Posición de jugador inválida" },
      { status: 400 }
    );
  }

  if (new Set(slots).size !== 5) {
    return NextResponse.json(
      { error: "No puede haber dos jugadores en la misma posición" },
      { status: 400 }
    );
  }

  const cardIds = players.map((player) => player.cardId);

  if (
    cardIds.some(
      (cardId) => !cardId || typeof cardId !== "string"
    )
  ) {
    return NextResponse.json(
      { error: "Todas las cartas deben tener un ID válido" },
      { status: 400 }
    );
  }

  if (new Set(cardIds).size !== 5) {
    return NextResponse.json(
      { error: "No puedes utilizar la misma carta dos veces" },
      { status: 400 }
    );
  }

  const captainCount = players.filter(
    (player) => player.captain === true
  ).length;

  if (captainCount !== 1) {
    return NextResponse.json(
      { error: "La alineación debe tener exactamente un capitán" },
      { status: 400 }
    );
  }

  const gameWeek = await prisma.gameWeek.findUnique({
    where: {
      id: gameWeekId,
    },
  });

  if (!gameWeek) {
    return NextResponse.json(
      { error: "Game Week no encontrada" },
      { status: 404 }
    );
  }

  const ownedCards = await prisma.card.findMany({
    where: {
      id: {
        in: cardIds as string[],
      },
      ownerId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (ownedCards.length !== 5) {
    return NextResponse.json(
      {
        error:
          "Una o más cartas no pertenecen al usuario",
      },
      { status: 403 }
    );
  }

  try {
    const lineup = await prisma.$transaction(async (tx) => {
      /*
       * Una carta solo puede estar en una alineación
       * de la misma Game Week.
       *
       * Si alguna de las cartas que estamos guardando
       * ya pertenece a otra alineación del usuario en
       * esta GW, esa alineación se elimina automáticamente.
       */
      const conflictingPlayers =
        await tx.lineupPlayer.findMany({
          where: {
            cardId: {
              in: cardIds as string[],
            },
            lineup: {
              userId: user.id,
              gameWeekId,
            },
          },
          select: {
            lineupId: true,
          },
        });

      const conflictingLineupIds = [
        ...new Set(
          conflictingPlayers.map(
            (player) => player.lineupId
          )
        ),
      ];

      if (conflictingLineupIds.length > 0) {
        await tx.lineup.deleteMany({
          where: {
            id: {
              in: conflictingLineupIds,
            },
            userId: user.id,
            gameWeekId,
          },
        });
      }

      return tx.lineup.create({
        data: {
          name,
          userId: user.id,
          gameWeekId,
          players: {
            create: players.map((player) => ({
              cardId: player.cardId as string,
              slot: player.slot as Slot,
              captain: player.captain === true,
            })),
          },
        },
        include: {
          gameWeek: true,
          players: {
            include: {
              card: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        lineup,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "Ya existe una alineación con ese nombre para esta Game Week",
        },
        { status: 409 }
      );
    }

    console.error("Error creando alineación:", error);

    return NextResponse.json(
      { error: "No se pudo crear la alineación" },
      { status: 500 }
    );
  }
}


export async function PATCH(request: Request) {
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
    select: {
      id: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  let body: {
    lineupId?: string;
    name?: string;
    players?: {
      cardId?: string;
      slot?: string;
      captain?: boolean;
    }[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido" },
      { status: 400 }
    );
  }

  const lineupId = body.lineupId?.trim();

  if (!lineupId) {
    return NextResponse.json(
      { error: "El ID de la alineación es obligatorio" },
      { status: 400 }
    );
  }

  const lineup = await prisma.lineup.findFirst({
    where: {
      id: lineupId,
      userId: user.id,
    },
  });

  if (!lineup) {
    return NextResponse.json(
      { error: "Alineación no encontrada" },
      { status: 404 }
    );
  }

  const updateData: {
    name?: string;
  } = {};

  if (body.name !== undefined) {
    const name = body.name.trim();

    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la alineación no puede estar vacío" },
        { status: 400 }
      );
    }

    updateData.name = name;
  }

  if (body.players !== undefined) {
    const players = body.players;

    if (!Array.isArray(players) || players.length !== 5) {
      return NextResponse.json(
        { error: "Una alineación debe tener exactamente 5 jugadores" },
        { status: 400 }
      );
    }

    const slots = players.map((player) => player.slot);

    if (
      slots.some(
        (slot) =>
          !slot ||
          !VALID_SLOTS.includes(slot as Slot)
      )
    ) {
      return NextResponse.json(
        { error: "Posición de jugador inválida" },
        { status: 400 }
      );
    }

    if (new Set(slots).size !== 5) {
      return NextResponse.json(
        { error: "No puede haber dos jugadores en la misma posición" },
        { status: 400 }
      );
    }

    const cardIds = players.map(
      (player) => player.cardId
    );

    if (
      cardIds.some(
        (cardId) =>
          !cardId ||
          typeof cardId !== "string"
      )
    ) {
      return NextResponse.json(
        { error: "Todas las cartas deben tener un ID válido" },
        { status: 400 }
      );
    }

    if (new Set(cardIds).size !== 5) {
      return NextResponse.json(
        { error: "No puedes utilizar la misma carta dos veces" },
        { status: 400 }
      );
    }

    const captainCount = players.filter(
      (player) => player.captain === true
    ).length;

    if (captainCount !== 1) {
      return NextResponse.json(
        {
          error:
            "La alineación debe tener exactamente un capitán",
        },
        { status: 400 }
      );
    }

    const ownedCards = await prisma.card.findMany({
      where: {
        id: {
          in: cardIds as string[],
        },
        ownerId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (ownedCards.length !== 5) {
      return NextResponse.json(
        {
          error:
            "Una o más cartas no pertenecen al usuario",
        },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      /*
       * Una carta solo puede estar en una alineación
       * de la misma Game Week.
       *
       * Si alguna de las cartas que estamos guardando
       * ya pertenece a otra alineación del usuario en
       * esta GW, esa alineación se elimina automáticamente.
       *
       * La alineación que estamos editando se excluye
       * porque sus propios jugadores se reemplazarán.
       */
      const conflictingPlayers =
        await tx.lineupPlayer.findMany({
          where: {
            cardId: {
              in: cardIds as string[],
            },
            lineup: {
              userId: user.id,
              gameWeekId: lineup.gameWeekId,
              id: {
                not: lineupId,
              },
            },
          },
          select: {
            lineupId: true,
          },
        });

      const conflictingLineupIds = [
        ...new Set(
          conflictingPlayers.map(
            (player) => player.lineupId
          )
        ),
      ];

      if (conflictingLineupIds.length > 0) {
        await tx.lineup.deleteMany({
          where: {
            id: {
              in: conflictingLineupIds,
            },
            userId: user.id,
            gameWeekId: lineup.gameWeekId,
          },
        });
      }

      await tx.lineupPlayer.deleteMany({
        where: {
          lineupId,
        },
      });

      await tx.lineupPlayer.createMany({
        data: players.map((player) => ({
          lineupId,
          cardId: player.cardId as string,
          slot: player.slot as Slot,
          captain: player.captain === true,
        })),
      });
    });
  }

  const updatedLineup = await prisma.lineup.update({
    where: {
      id: lineupId,
    },
    data: updateData,
    include: {
      gameWeek: true,
      players: {
        orderBy: {
          slot: "asc",
        },
        include: {
          card: true,
        },
      },
    },
  });

  return NextResponse.json({
    lineup: updatedLineup,
  });
}

export async function DELETE(request: Request) {
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
    select: {
      id: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const lineupId = searchParams.get("lineupId");

  if (!lineupId) {
    return NextResponse.json(
      { error: "El ID de la alineación es obligatorio" },
      { status: 400 }
    );
  }

  const lineup = await prisma.lineup.findFirst({
    where: {
      id: lineupId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!lineup) {
    return NextResponse.json(
      { error: "Alineación no encontrada" },
      { status: 404 }
    );
  }

  await prisma.lineup.delete({
    where: {
      id: lineup.id,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
