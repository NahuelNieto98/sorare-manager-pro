import { Card } from "@prisma/client";

export function calculateGalleryValue(cards: Card[]) {
  return cards.reduce((total, card) => {
    return total + (card.marketValue ?? 0);
  }, 0);
}

export function calculateAverage(cards: Card[]) {
  if (cards.length === 0) return 0;

  const total = cards.reduce((sum, card) => {
    return sum + (card.averageScore ?? 0);
  }, 0);

  return Number((total / cards.length).toFixed(1));
}

export function countScarcity(cards: Card[]) {
  return {
    limited: cards.filter((c) => c.scarcity === "limited").length,
    rare: cards.filter((c) => c.scarcity === "rare").length,
    superRare: cards.filter((c) => c.scarcity === "super_rare").length,
    unique: cards.filter((c) => c.scarcity === "unique").length,
  };
}
