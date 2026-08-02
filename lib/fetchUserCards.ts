import { sorareRequest } from "./sorare";
import { GET_USER_CARDS } from "./queries";

export async function fetchUserCards(slug: string) {
  const response = await sorareRequest(GET_USER_CARDS, {
    slug,
  });

  const cards = response.data.football.user.cards.nodes;

  return cards.map((card: any) => ({
    id: card.assetId,

    assetId: card.assetId,

    slug: card.slug,

    season: card.season,

    scarcity: card.rarity.toLowerCase(),

    playerName: card.player.displayName,

    club: card.player.activeClub?.name ?? null,

    position: card.player.position,

    pictureUrl: card.player.pictureUrl,

    averageScore: card.player.averageScore ?? 0,

    marketValue: 0,
  }));
}
