import { SorareCard } from "./types";


export function mapSorareCard(card: any): SorareCard {

return {

id: card.assetId ?? "",

assetId: card.assetId ?? "",


slug: card.slug ?? "",


playerName:
card.player?.displayName ?? "Jugador",


season:
card.season ?? 0,


scarcity:
card.rarity ?? "limited",


club:
card.player?.club ?? null,


position:
card.player?.position ?? null,


pictureUrl:
card.pictureUrl ?? null,


averageScore:
card.player?.averageScore ?? null,


marketValue:
card.marketValue ?? null,

sealed:
card.sealed ?? false,

};

}