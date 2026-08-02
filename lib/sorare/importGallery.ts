import { prisma } from "@/lib/prisma";
import { estimateCardValue } from "@/lib/galleryValue";

export async function importGallery(userId: string, cards: any[]) {
  await prisma.card.deleteMany({
    where: {
      ownerId: userId,
    },
  });

  for (const card of cards) {
    const value = estimateCardValue(card.rarity, 50);

    await prisma.card.create({
      data: {
        sorareId: card.assetId,

        slug: card.slug,

        season: card.season,

        scarcity: card.rarity,

        playerName: card.player.displayName,

        club: card.player.activeClub?.name ?? null,

        position: card.player.position,

        pictureUrl: card.player.pictureUrl,

        averageScore: 50,

        marketValue: value,

        ownerId: userId,
      },
    });
  }
}
