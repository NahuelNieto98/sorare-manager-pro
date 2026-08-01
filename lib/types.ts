export type SorareCard = {
  id: string;
  slug: string;
  assetId: string;

  playerName: string;
  club: string | null;
  position: string | null;

  pictureUrl: string | null;

  season: number;

  scarcity: string;

  averageScore: number | null;

  marketValue: number | null;
};
