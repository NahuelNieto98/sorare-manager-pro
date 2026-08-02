export function estimateCardValue(rarity: string, average: number | null) {
  const aa = average ?? 50;

  switch (rarity) {
    case "limited":
      return aa * 2;

    case "rare":
      return aa * 12;

    case "super_rare":
      return aa * 60;

    case "unique":
      return aa * 500;

    default:
      return aa;
  }
}
