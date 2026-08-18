export type Season = {
  id: string;
  label: string;
  start: string;
  end: string;
};

export const SEASONS: Season[] = [
  {
    id: "2026-27",
    label: "2026/27",
    start: "2026-07-21T00:00:00.000Z",
    end: "2027-07-21T00:00:00.000Z",
  },
  {
    id: "2025-26",
    label: "2025/26",
    start: "2025-07-21T00:00:00.000Z",
    end: "2026-07-21T00:00:00.000Z",
  },
  {
    id: "2024-25",
    label: "2024/25",
    start: "2024-07-21T00:00:00.000Z",
    end: "2025-07-21T00:00:00.000Z",
  },
  {
    id: "2023-24",
    label: "2023/24",
    start: "2023-07-21T00:00:00.000Z",
    end: "2024-07-21T00:00:00.000Z",
  },
];

export function getSeason(seasonId: string) {
  return SEASONS.find(
    (season) => season.id === seasonId
  );
}

export function isDateInSeason(
  date: string | Date,
  seasonId: string
) {
  const season = getSeason(seasonId);

  if (!season) {
    return true;
  }

  const timestamp =
    new Date(date).getTime();

  return (
    timestamp >=
      new Date(season.start).getTime() &&
    timestamp <
      new Date(season.end).getTime()
  );
}
