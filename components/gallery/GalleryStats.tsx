"use client";

type Card = {
  playerName: string;
  marketValue: number | null;
  averageScore: number | null;
};

type Props = {
  cards: Card[];
  galleryValue: number;
  totalCards: number;
  inSeasonCards: number;
  classicCards: number;
  inSeasonValue: number;
  classicValue: number;
};

export default function GalleryStats({
  cards,
  galleryValue,
  totalCards,
  inSeasonCards,
  classicCards,
}: Props) {

  const averageAA =
    cards.length
      ? cards.reduce(
          (sum, card) =>
            sum + (card.averageScore ?? 0),
          0
        ) / cards.length
      : 0;

  const mostValuableCard =
    [...cards].sort(
      (a, b) =>
        (b.marketValue ?? 0) -
        (a.marketValue ?? 0)
    )[0];


  return (
    <div
      className="
      grid
      gap-4
      mb-6
      md:gap-5
      md:mb-8
      md:grid-cols-2
      xl:grid-cols-4
      "
    >

      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-4
        md:p-6
        "
      >
        <p className="text-sm text-white/70">
          💎 Valor colección
        </p>

        <p className="mt-2 text-2xl font-black text-emerald-400">
          €{galleryValue.toFixed(2)}
        </p>
      </div>


      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-4
        md:p-6
        "
      >
        <p className="text-sm text-white/70">
          🃏 Cartas
        </p>

        <p className="mt-2 text-2xl font-black text-white">
          {totalCards}
        </p>

        <p className="mt-1 text-xs text-white/50">
          {inSeasonCards} In Season · {classicCards} Classic
        </p>
      </div>


      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-4
        md:p-6
        "
      >
        <p className="text-sm text-white/70">
          ⭐ Media AA
        </p>

        <p className="mt-2 text-2xl font-black text-violet-300">
          {averageAA.toFixed(1)}
        </p>

        <p className="mt-1 text-xs text-white/50">
          Media de rendimiento
        </p>
      </div>


      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-[#17112F]
        p-4
        md:p-6
        "
      >
        <p className="text-sm text-white/70">
          🏆 Carta estrella
        </p>

        <p className="mt-2 truncate text-lg font-black text-white">
          {mostValuableCard?.playerName ?? "Sin datos"}
        </p>

        <p className="mt-1 text-lg font-black text-emerald-400">
          €
          {mostValuableCard?.marketValue?.toFixed(2) ?? "0.00"}
        </p>
      </div>

    </div>
  );
}