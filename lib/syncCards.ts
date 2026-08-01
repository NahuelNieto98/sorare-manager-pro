import { prisma } from "@/lib/prisma";
import { SorareCard } from "@/lib/types";

export async function saveCards(userId: string, cards: SorareCard[]) {
  for (const card of cards) {
    await prisma.card.upsert({
      where: {
        slug: card.slug,
      },
      update: {
        playerName: card.playerName,
        club: card.club,
        position: card.position,
        pictureUrl: card.pictureUrl,
        season: card.season,
        scarcity: card.scarcity,
        averageScore: card.averageScore,
        marketValue: card.marketValue,
        ownerId: userId,
      },
      create: {
        sorareId: card.assetId,
        slug: card.slug,
        playerName: card.playerName,
        club: card.club,
        position: card.position,
        pictureUrl: card.pictureUrl,
        season: card.season,
        scarcity: card.scarcity,
        averageScore: card.averageScore,
        marketValue: card.marketValue,
        ownerId: userId,
      },
    });
  }
}
