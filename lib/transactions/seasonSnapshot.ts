import { prisma } from "@/lib/prisma";

import {
  getSeason,
} from "@/lib/transactions/seasons";


export async function getSeasonSnapshot(
  userId: string,
  seasonId: string
) {

  const season =
    getSeason(seasonId);


  if (!season) {
    return null;
  }


  const snapshot =
    await prisma.portfolioSnapshot.findFirst({

      where: {

        userId,

        createdAt: {

          gte:
            new Date(
              season.start
            ),

          lt:
            new Date(
              season.end
            ),

        },

      },

      orderBy: {

        createdAt: "asc",

      },

    });


  return snapshot;
}
