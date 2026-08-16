"use client";

import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  Plus,
  RefreshCw,
  Trophy,
  Check,
  Crown,
  SlidersHorizontal,
  ChevronDown,
  CalendarDays,
  Sparkles,
} from "lucide-react";

type Card = {
  id: string;
  sorareId: string;
  playerName: string;
  playerSlug?: string | null;
  pictureUrl?: string | null;
  position?: string | null;
  scarcity: string;
  season: number;
  club?: string | null;
  l5Score?: number | null;
  l10Score?: number | null;
  l15Score?: number | null;
  averageScore?: number | null;
  nextMatch?: {
    opponent: string;
    opponentAbbreviation?: string;
    opponentLogo?: string | null;
    teamAbbreviation?: string;
    teamLogo?: string | null;
    isHome: boolean;
    date: string;
    time: string;
    probabilities?: {
      home: number;
      draw: number;
      away: number;
    };
  } | null;
};

type SlotKey = "GK" | "DEF" | "MID" | "FWD" | "EXTRA";
type SortOption = "average" | "nextMatch" | "l5" | "l10" | "l15";

type GameWeek = {
  id: string;
  number: number;
  name: string;
  season: number;
  startAt: string;
  endAt: string;
};

type SavedLineup = {
  id: string;
  name: string;
  gameWeekId: string;
  players: {
    id: string;
    cardId: string;
    slot: SlotKey;
    captain: boolean;
    card: Card;
  }[];
};

const SELECTION_ORDER: SlotKey[] = [
  "GK",
  "DEF",
  "MID",
  "FWD",
  "EXTRA",
];

const SLOT_NAMES: Record<SlotKey, string> = {
  GK: "Goalkeeper",
  DEF: "Defender",
  MID: "Midfielder",
  FWD: "Forward",
  EXTRA: "Extra",
};

function normalizePosition(
  position?: string | null
): SlotKey | null {
  if (!position) return null;

  const value = position.toLowerCase();

  if (
    value.includes("goalkeeper") ||
    value === "gk" ||
    value.includes("keeper") ||
    value.includes("goalie")
  ) {
    return "GK";
  }

  if (
    value.includes("defender") ||
    value === "def" ||
    value.includes("defense") ||
    value.includes("defence")
  ) {
    return "DEF";
  }

  if (
    value.includes("midfielder") ||
    value === "mid" ||
    value.includes("middle")
  ) {
    return "MID";
  }

  if (
    value.includes("forward") ||
    value === "fwd" ||
    value.includes("attacker") ||
    value.includes("striker")
  ) {
    return "FWD";
  }

  return null;
}

function getScore(card: Card) {
  return (
    card.averageScore ??
    card.l15Score ??
    card.l10Score ??
    card.l5Score ??
    0
  );
}

function getRarityStyle(scarcity?: string) {
  const rarity = scarcity?.toLowerCase() ?? "";

  if (rarity.includes("unique")) {
    return {
      border: "border-orange-400",
      glow: "shadow-orange-500/40",
      badge: "bg-orange-500/20 text-orange-200",
    };
  }

  if (rarity.includes("super")) {
    return {
      border: "border-red-400",
      glow: "shadow-red-500/40",
      badge: "bg-red-500/20 text-red-200",
    };
  }

  if (rarity.includes("rare")) {
    return {
      border: "border-yellow-400",
      glow: "shadow-yellow-500/40",
      badge: "bg-yellow-500/20 text-yellow-200",
    };
  }

  return {
    border: "border-violet-400",
    glow: "shadow-violet-500/40",
    badge: "bg-violet-500/20 text-violet-200",
  };
}

function getStepLabel(
  step:
    | SlotKey
    | "CAPTAIN"
    | "COMPLETE"
    | null
) {
  if (!step) return "Posición";
  if (step === "CAPTAIN") return "Capitán";
  if (step === "COMPLETE") return "Completa";
  return SLOT_NAMES[step];
}

export default function LineupBuilder() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<
    Partial<Record<SlotKey, Card>>
  >({});
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [activePosition, setActivePosition] =
    useState<SlotKey | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("average");

  const [lineupCardFilter, setLineupCardFilter] =
    useState<"available" | "all" | "other">("available");
  const [sortOpen, setSortOpen] = useState(false);

  const [gameWeeks, setGameWeeks] = useState<GameWeek[]>([]);
  const [selectedGameWeekId, setSelectedGameWeekId] =
    useState<string | null>(null);

  const [savedLineups, setSavedLineups] =
    useState<SavedLineup[]>([]);

  const [selectedLineupId, setSelectedLineupId] =
    useState<string | null>(null);

  const [showSaveModal, setShowSaveModal] =
    useState(false);

  const [deleteLineup, setDeleteLineup] =
    useState<SavedLineup | null>(null);

  const [showAllLineups, setShowAllLineups] =
    useState(false);

  const [lineupName, setLineupName] =
    useState("");

  const [savingLineup, setSavingLineup] =
    useState(false);

  const [editingLineup, setEditingLineup] =
    useState(false);

  const [showReplaceWarning, setShowReplaceWarning] =
    useState(false);

  const [conflictingLineups, setConflictingLineups] =
    useState<SavedLineup[]>([]);

  const [loadingGameWeeks, setLoadingGameWeeks] =
    useState(true);

  const [loadingLineups, setLoadingLineups] =
    useState(false);

  async function loadGameWeeks() {
    setLoadingGameWeeks(true);

    try {
      const response = await fetch("/api/gameweeks");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No se pudieron cargar las Game Weeks"
        );
      }

      const weeks: GameWeek[] = data.gameWeeks ?? [];

      setGameWeeks(weeks);

      if (weeks.length > 0) {
        const now = new Date();

        const current =
          weeks.find(
            (week) =>
              new Date(week.startAt) <= now &&
              new Date(week.endAt) >= now
          ) ??
          weeks.find(
            (week) =>
              new Date(week.startAt) > now
          ) ??
          weeks[weeks.length - 1];

        setSelectedGameWeekId(current.id);
      }
    } catch (error) {
      console.error(
        "Error cargando Game Weeks:",
        error
      );
    } finally {
      setLoadingGameWeeks(false);
    }
  }

  async function loadCards() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/cards");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No se pudieron cargar las cartas"
        );
      }

      const clubs = Array.from(
        new Set(
          data
            .map((card: Card) => card.club)
            .filter(Boolean)
        )
      );

      let fixtureMap: Record<string, Card["nextMatch"]> = {};

      if (clubs.length > 0) {
        try {
          const fixtureResponse = await fetch(
            `/api/lineup-fixtures?clubs=${encodeURIComponent(clubs.join("|"))}`
          );

          if (fixtureResponse.ok) {
            fixtureMap = await fixtureResponse.json();
          }
        } catch (fixtureError) {
          console.warn("Could not load upcoming fixtures:", fixtureError);
        }
      }

      setCards(
        data.map((card: Card) => ({
          ...card,
          nextMatch: card.club
            ? fixtureMap[card.club] ?? null
            : null,
        }))
      );
    } catch (err: any) {
      console.error("Error al cargar las cartas:", err);

      setError(
        err.message ?? "Error cargando las cartas"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
    loadGameWeeks();
  }, []);

  useEffect(() => {
    setEditingLineup(false);
    setConflictingLineups([]);

    if (!selectedGameWeekId) {
      setSavedLineups([]);
      setSelectedLineupId(null);
      setSelected({});
      setCaptainId(null);
      setActivePosition(null);
      setSearch("");
      return;
    }

    async function loadLineups() {
      setLoadingLineups(true);

      try {
        const response = await fetch(
          `/api/lineups?gameWeekId=${encodeURIComponent(
            selectedGameWeekId!
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              "No se pudieron cargar las alineaciones"
          );
        }

        const lineups: SavedLineup[] =
          data.lineups ?? [];

        setSavedLineups(lineups);

        setSelectedLineupId(
          lineups.length > 0
            ? lineups[0].id
            : null
        );

        setEditingLineup(false);
        setConflictingLineups([]);

        if (lineups.length === 0) {
          setSelected({});
          setCaptainId(null);
          setActivePosition(null);
          setSearch("");
        }
      } catch (error) {
        console.error(
          "Error cargando alineaciones:",
          error
        );

        setSavedLineups([]);
        setSelectedLineupId(null);
        setSelected({});
        setCaptainId(null);
        setActivePosition(null);
        setSearch("");
        setEditingLineup(false);
        setConflictingLineups([]);
      } finally {
        setLoadingLineups(false);
      }
    }

    loadLineups();
  }, [selectedGameWeekId]);

  useEffect(() => {
    if (!selectedLineupId) {
      return;
    }

    const lineup = savedLineups.find(
      (item) => item.id === selectedLineupId
    );

    if (!lineup) {
      return;
    }

    const nextSelected: Partial<Record<SlotKey, Card>> = {};

    lineup.players.forEach((player) => {
      if (
        player.slot === "GK" ||
        player.slot === "DEF" ||
        player.slot === "MID" ||
        player.slot === "FWD" ||
        player.slot === "EXTRA"
      ) {
        nextSelected[player.slot] = player.card;
      }
    });

    setSelected(nextSelected);

    const captain = lineup.players.find(
      (player) => player.captain
    );

    setCaptainId(
      captain?.cardId ?? null
    );

    setActivePosition(null);
    setSearch("");
  }, [
    selectedLineupId,
    savedLineups,
  ]);

  function saveLineup() {
    if (!selectedGameWeekId) {
      alert("Selecciona una Game Week antes de guardar.");
      return;
    }

    if (selectedCards.length !== 5) {
      alert(
        "La alineación debe tener exactamente 5 jugadores."
      );
      return;
    }

    if (!captainId) {
      alert(
        "Selecciona un capitán antes de guardar."
      );
      return;
    }

    const currentLineup = savedLineups.find(
      (lineup) => lineup.id === selectedLineupId
    );

    setLineupName(
      currentLineup?.name ??
        `Alineación ${savedLineups.length + 1}`
    );

    const selectedCardIds = new Set(
      selectedCards.map((card) => card.id)
    );

    const conflicts = savedLineups.filter((lineup) => {
      if (lineup.id === selectedLineupId) {
        return false;
      }

      return lineup.players.some((player) =>
        selectedCardIds.has(player.cardId)
      );
    });

    setConflictingLineups(conflicts);
    setShowReplaceWarning(false);
    setShowSaveModal(true);
  }

  async function confirmSaveLineup() {
    const name = lineupName.trim();

    if (!name || !selectedGameWeekId) {
      return;
    }

    setSavingLineup(true);

    try {
      const isEditing =
        editingLineup && !!selectedLineupId;

      const response = await fetch("/api/lineups", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isEditing
            ? {
                lineupId: selectedLineupId,
              }
            : {}),
          name,
          gameWeekId: selectedGameWeekId,
          players: SELECTION_ORDER.map((slot) => ({
            cardId: selected[slot]?.id,
            slot,
            captain:
              selected[slot]?.id === captainId,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo guardar la alineación"
        );
      }

      const refreshedResponse = await fetch(
        `/api/lineups?gameWeekId=${encodeURIComponent(
          selectedGameWeekId
        )}`
      );

      const refreshedData =
        await refreshedResponse.json();

      if (!refreshedResponse.ok) {
        throw new Error(
          refreshedData.error ??
            "La alineación se guardó, pero no se pudieron actualizar las alineaciones."
        );
      }

      const refreshedLineups: SavedLineup[] =
        refreshedData.lineups ?? [];

      setSavedLineups(refreshedLineups);
      setSelectedLineupId(data.lineup.id);
      setEditingLineup(false);
      setShowSaveModal(false);
      setShowReplaceWarning(false);
      setConflictingLineups([]);
      setLineupName("");
    } catch (error) {
      console.error(
        "Error guardando alineación:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la alineación."
      );
    } finally {
      setSavingLineup(false);
    }
  }

  async function confirmDeleteLineup() {
    if (!deleteLineup) {
      return;
    }

    try {
      const response = await fetch(
        `/api/lineups?lineupId=${encodeURIComponent(deleteLineup.id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No se pudo eliminar la alineación"
        );
      }

      setSavedLineups((current) =>
        current.filter(
          (item) => item.id !== deleteLineup.id
        )
      );

      if (selectedLineupId === deleteLineup.id) {
        setSelectedLineupId(null);
        clearLineup();
      }

      setDeleteLineup(null);
    } catch (error) {
      console.error(
        "Error eliminando alineación:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la alineación"
      );
    }
  }

  const selectedCards = useMemo(
    () =>
      SELECTION_ORDER.map(
        (slot) => selected[slot]
      ).filter(Boolean) as Card[],
    [selected]
  );

  const selectedIds = useMemo(
    () =>
      new Set(
        selectedCards.map((card) => card.id)
      ),
    [selectedCards]
  );

  const currentSeason = useMemo(
    () =>
      cards.length > 0
        ? Math.max(...cards.map((card) => card.season))
        : null,
    [cards]
  );

  const inSeasonCount = useMemo(
    () =>
      currentSeason === null
        ? 0
        : selectedCards.filter(
            (card) => card.season === currentSeason
          ).length,
    [selectedCards, currentSeason]
  );

  const classicCount = useMemo(
    () =>
      currentSeason === null
        ? 0
        : selectedCards.filter(
            (card) => card.season !== currentSeason
          ).length,
    [selectedCards, currentSeason]
  );

  const activeStep = useMemo<
    SlotKey | "CAPTAIN" | "COMPLETE" | null
  >(() => {
    const lineupComplete =
      SELECTION_ORDER.every(
        (slot) => !!selected[slot]
      );

    if (lineupComplete) {
      if (!captainId) {
        return "CAPTAIN";
      }

      return "COMPLETE";
    }

    return activePosition;
  }, [
    selected,
    captainId,
    activePosition,
  ]);

  const occupiedByOtherLineupIds = useMemo(() => {
    const ids = new Set<string>();

    savedLineups.forEach((lineup) => {
      if (lineup.id === selectedLineupId) {
        return;
      }

      lineup.players.forEach((player) => {
        ids.add(player.cardId);
      });
    });

    return ids;
  }, [savedLineups, selectedLineupId]);

  const cardLineupMap = useMemo(() => {
    const map = new Map<string, string>();

    savedLineups.forEach((lineup) => {
      if (lineup.id === selectedLineupId) {
        return;
      }

      lineup.players.forEach((player) => {
        map.set(player.cardId, lineup.name);
      });
    });

    return map;
  }, [savedLineups, selectedLineupId]);

  const availableCards = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cards.filter((card) => {
      // Cuando editamos una posición, mantenemos visible
      // la carta que ocupa actualmente ese hueco para
      // poder verla y volver a seleccionarla.
      const selectedInCurrentSlot =
        activeStep !== "CAPTAIN" &&
        activeStep !== "COMPLETE" &&
        activeStep
          ? selected[activeStep]?.id === card.id
          : false;

      if (
        selectedIds.has(card.id) &&
        !selectedInCurrentSlot
      ) {
        return false;
      }

      const isOccupiedByOtherLineup =
        occupiedByOtherLineupIds.has(card.id);

      if (
        lineupCardFilter === "available" &&
        isOccupiedByOtherLineup
      ) {
        return false;
      }

      if (
        lineupCardFilter === "other" &&
        !isOccupiedByOtherLineup
      ) {
        return false;
      }

      const matchesSearch =
        !query ||
        card.playerName.toLowerCase().includes(query) ||
        card.club?.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (
        activeStep === "CAPTAIN" ||
        activeStep === "COMPLETE"
      ) {
        return true;
      }

      if (!activeStep) {
        return false;
      }

      if (currentSeason !== null) {
        const isInSeason = card.season === currentSeason;

        if (!isInSeason && classicCount >= 1) {
          return false;
        }
      }

      if (activeStep === "EXTRA") {
        const normalized =
          normalizePosition(card.position);

        return normalized !== null &&
          normalized !== "GK";
      }

      if (
        activePosition === "GK" ||
        activePosition === "DEF" ||
        activePosition === "MID" ||
        activePosition === "FWD"
      ) {
        return normalizePosition(card.position) === activePosition;
      }

      return true;
    });
  }, [
    cards,
    search,
    selectedIds,
    selected,
    activeStep,
    currentSeason,
    classicCount,
    lineupCardFilter,
    occupiedByOtherLineupIds,
  ]);

  const sortedAvailableCards = useMemo(() => {
    const result = [...availableCards];

    result.sort((a, b) => {
      if (sortOption === "nextMatch") {
        if (a.nextMatch && !b.nextMatch) return -1;
        if (!a.nextMatch && b.nextMatch) return 1;
        if (a.nextMatch && b.nextMatch) {
          const parseMatchTime = (match: NonNullable<Card["nextMatch"]>) => {
            const [day, month] = match.date.split("/").map(Number);
            const [hour, minute] = match.time.split(":").map(Number);
            const now = new Date();
            let year = now.getFullYear();

            const date = new Date(
              year,
              month - 1,
              day,
              hour,
              minute
            );

            if (date.getTime() < now.getTime() - 7 * 24 * 60 * 60 * 1000) {
              year += 1;
              return new Date(
                year,
                month - 1,
                day,
                hour,
                minute
              ).getTime();
            }

            return date.getTime();
          };

          const aTime = parseMatchTime(a.nextMatch);
          const bTime = parseMatchTime(b.nextMatch);

          if (Number.isFinite(aTime) && Number.isFinite(bTime)) {
            return aTime - bTime;
          }
        }
        return getScore(b) - getScore(a);
      }

      if (sortOption === "l5") return (b.l5Score ?? 0) - (a.l5Score ?? 0);
      if (sortOption === "l10") return (b.l10Score ?? 0) - (a.l10Score ?? 0);
      if (sortOption === "l15") return (b.l15Score ?? 0) - (a.l15Score ?? 0);
      return getScore(b) - getScore(a);
    });

    return result;
  }, [availableCards, sortOption]);

  const captainCards = useMemo(
    () => selectedCards,
    [selectedCards]
  );

  const lineupAverage =
    selectedCards.length > 0
      ? selectedCards.reduce(
          (sum, card) => sum + getScore(card),
          0
        ) / selectedCards.length
      : 0;

  const l5Average =
    selectedCards.length > 0
      ? selectedCards.reduce(
          (sum, card) =>
            sum + (card.l5Score ?? 0),
          0
        ) / selectedCards.length
      : 0;

  const l10Average =
    selectedCards.length > 0
      ? selectedCards.reduce(
          (sum, card) =>
            sum + (card.l10Score ?? 0),
          0
        ) / selectedCards.length
      : 0;

  const l15Average =
    selectedCards.length > 0
      ? selectedCards.reduce(
          (sum, card) =>
            sum + (card.l15Score ?? 0),
          0
        ) / selectedCards.length
      : 0;

  function selectCard(card: Card) {
    if (activeStep === "CAPTAIN") {
      setCaptainId(card.id);
      setSearch("");
      return;
    }

    if (
      activeStep === "COMPLETE" ||
      !activeStep
    ) {
      return;
    }

    if (currentSeason !== null) {
      const isInSeason = card.season === currentSeason;

      if (!isInSeason && classicCount >= 1) {
        return;
      }
    }

    if (activeStep === "EXTRA" && normalizePosition(card.position) === "GK") {
      return;
    }

    if (
      activeStep !== "EXTRA" &&
      normalizePosition(card.position) !== activeStep
    ) {
      return;
    }

    setSelected((current) => ({
      ...current,
      [activeStep]: card,
    }));

    setSearch("");

    const currentIndex =
      SELECTION_ORDER.indexOf(activeStep);

    const nextPosition =
      currentIndex >= 0 &&
      currentIndex < SELECTION_ORDER.length - 1
        ? SELECTION_ORDER[currentIndex + 1]
        : null;

    setActivePosition(nextPosition);
  }

  function removeCard(slot: SlotKey) {
    setSelected((current) => {
      const next = {
        ...current,
      };

      delete next[slot];

      return next;
    });

    setCaptainId(null);
    setActivePosition(slot);
    setSearch("");
  }

  function clearLineup() {
    setSelected({});
    setCaptainId(null);
    setActivePosition(null);
    setSearch("");
  }

  function selectCaptain(
    card: Card
  ) {
    setCaptainId(card.id);
  }

  const stepProgress =
    activeStep === "CAPTAIN" ||
    activeStep === "COMPLETE"
      ? 5
      : activeStep
        ? SELECTION_ORDER.indexOf(
            activeStep
          )
        : selectedCards.length;

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_34%),linear-gradient(135deg,#0c101b_0%,#111827_55%,#17112f_100%)] p-4 shadow-2xl md:p-6">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-violet-200">
            <Sparkles size={14} />
            Sorare Manager Pro · Lineup Studio
          </div>

          <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              ← Volver al inicio
            </button>

            <h1 className="text-4xl font-black tracking-[-0.03em] text-white md:text-5xl">
            Constructor de alineaciones
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-300 md:text-base">
            Construye tu alineación de 5 jugadores y optimiza cada posición para la Game Week.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <ScoreBox
            label="Media proyectada"
            value={lineupAverage.toFixed(1)}
            highlight
          />

          <ScoreBox
            label="L5"
            value={l5Average.toFixed(1)}
          />

          <ScoreBox
            label="L10"
            value={l10Average.toFixed(1)}
          />

          <ScoreBox
            label="L15"
            value={l15Average.toFixed(1)}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">

        {/* FIELD */}

        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0d1420] shadow-2xl shadow-black/30">

          <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-5">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-300">
                LaLiga
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Alineación
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-300">
                {selectedCards.length}/5
              </div>

              <button
                type="button"
                onClick={clearLineup}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                Limpiar
              </button>

              <button
                type="button"
                onClick={loadCards}
                disabled={loading}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:bg-white/10 disabled:opacity-50"
                title="Actualizar cartas"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>
          </div>

          <div className="relative h-[850px] overflow-hidden bg-[radial-gradient(circle_at_50%_15%,rgba(139,92,246,0.08),transparent_30%),#08111d] p-4 sm:p-6">

            <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-[78%] -translate-x-1/2 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#122f45_0%,#0f293c_48%,#0b2234_100%)] shadow-inner sm:top-6 sm:h-[calc(100%+2rem)]">

              {/* FIELD LINES */}

              <div className="absolute inset-0 opacity-[0.10]">
                <div className="h-1/8 border-b border-white/30" />
                <div className="h-1/8 border-b border-white/30" />
                <div className="h-1/8 border-b border-white/30" />
                <div className="h-1/8 border-b border-white/30" />
                <div className="h-1/8 border-b border-white/30" />
                <div className="h-1/8 border-b border-white/30" />
                <div className="h-1/8 border-b border-white/30" />
                <div className="h-1/8" />
              </div>

              <div className="absolute left-0 right-0 top-1/2 border-t border-white/10" />

              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" />

              {/* FWD */}

              <div className="absolute left-[10%] top-[6%]">
                <LineupSlot
                  label="FWD"
                  card={selected.FWD}
                  captain={
                    captainId ===
                    selected.FWD?.id
                  }
                  onRemove={() =>
                    removeCard("FWD")
                  }
                  onSelect={() => {
                    setActivePosition("FWD");
                    setSearch("");
                  }}
                />
              </div>

              {/* MID + EXTRA */}

              {/* MID - derecha */}
              <div className="absolute right-[10%] top-[55%]">
                <LineupSlot
                  label="MID"
                  card={selected.MID}
                  captain={
                    captainId ===
                    selected.MID?.id
                  }
                  onRemove={() =>
                    removeCard("MID")
                  }
                  onSelect={() => {
                    setActivePosition("MID");
                    setSearch("");
                  }}
                />
              </div>

              {/* EXTRA - arriba derecha */}
              <div className="absolute right-[10%] top-[6%]">
                <LineupSlot
                  label="EXTRA"
                  card={selected.EXTRA}
                  captain={
                    captainId ===
                    selected.EXTRA?.id
                  }
                  onRemove={() =>
                    removeCard("EXTRA")
                  }
                  onSelect={() => {
                    setActivePosition("EXTRA");
                    setSearch("");
                  }}
                />
              </div>

              {/* DEF */}

              <div className="absolute left-[10%] top-[55%]">
                <LineupSlot
                  label="DEF"
                  card={selected.DEF}
                  captain={
                    captainId ===
                    selected.DEF?.id
                  }
                  onRemove={() =>
                    removeCard("DEF")
                  }
                  onSelect={() => {
                    setActivePosition("DEF");
                    setSearch("");
                  }}
                />
              </div>

              {/* GK */}

              <div className="absolute left-1/2 top-[55%] -translate-x-1/2">
                <LineupSlot
                  label="GK"
                  card={selected.GK}
                  captain={
                    captainId ===
                    selected.GK?.id
                  }
                  onRemove={() =>
                    removeCard("GK")
                  }
                  onSelect={() => {
                    setActivePosition("GK");
                    setSearch("");
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}

        <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[32px] border border-violet-400/10 bg-[linear-gradient(180deg,#18132f_0%,#120f24_100%)] shadow-2xl shadow-black/30">

          {/* SELECTOR GAME WEEK */}

          <div className="border-b border-white/10 bg-black/10 p-5 md:p-6">

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
                  Game Week
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Selecciona la jornada que quieres gestionar.
                </p>
              </div>

              {selectedGameWeekId && (
                <select
                  value={selectedGameWeekId}
                  onChange={(event) =>
                    setSelectedGameWeekId(event.target.value)
                  }
                  disabled={loadingGameWeeks}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-white outline-none transition hover:bg-white/10 disabled:opacity-50"
                >
                  {gameWeeks.map((week) => (
                    <option
                      key={week.id}
                      value={week.id}
                      className="bg-[#17112f]"
                    >
                      {week.name}
                    </option>
                  ))}
                </select>
              )}

            </div>

            {selectedGameWeekId && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.025] px-3.5 py-2.5">

                <span className="text-xs font-bold text-zinc-400">
                  {(() => {
                    const week = gameWeeks.find(
                      (item) => item.id === selectedGameWeekId
                    );

                    if (!week) return "";

                    return new Intl.DateTimeFormat("es-ES", {
                      day: "2-digit",
                      month: "short",
                    }).format(new Date(week.startAt));
                  })()}
                  {" — "}
                  {(() => {
                    const week = gameWeeks.find(
                      (item) => item.id === selectedGameWeekId
                    );

                    if (!week) return "";

                    return new Intl.DateTimeFormat("es-ES", {
                      day: "2-digit",
                      month: "short",
                    }).format(new Date(week.endAt));
                  })()}
                </span>

                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                  {savedLineups.length}{" "}
                  {savedLineups.length === 1
                    ? "alineación"
                    : "alineaciones"}
                </span>

              </div>
            )}

            <div className="mt-4">

              <div className="mb-2 flex items-center justify-between">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                  Mis alineaciones
                </p>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => setShowAllLineups(true)}
                    disabled={savedLineups.length === 0}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Ver todas
                  </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLineupId(null);
                    setEditingLineup(false);
                    setConflictingLineups([]);
                    clearLineup();
                  }}
                  className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-violet-300 transition hover:bg-violet-500/20"
                >
                  + Nueva
                </button>

                </div>

              </div>

              {loadingLineups ? (

                <div className="rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3 text-xs font-bold text-zinc-500">
                  Cargando alineaciones...
                </div>

              ) : savedLineups.length === 0 ? (

                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-xs font-bold text-zinc-500">
                  No tienes alineaciones guardadas para esta GW.
                </div>

              ) : (

                <div className="flex gap-2 overflow-x-auto pb-1">

                  {savedLineups.map((lineup) => (

                    <div
                      key={lineup.id}
                      className={`flex shrink-0 items-center gap-1 rounded-xl border px-2 py-1 transition ${
                        selectedLineupId === lineup.id
                          ? "border-violet-400/50 bg-violet-500/15"
                          : "border-white/10 bg-white/5"
                      }`}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedLineupId(lineup.id)
                        }
                        className={`rounded-lg px-2 py-1.5 text-xs font-black transition ${
                          selectedLineupId === lineup.id
                            ? "text-violet-200"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {lineup.name}
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteLineup(lineup);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Eliminar alineación"
                      >
                        ×
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

          <div className="border-b border-white/10 bg-white/[0.015] p-6 md:p-7">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                  {activeStep === "CAPTAIN"
                    ? "Final step"
                    : activeStep === "COMPLETE"
                      ? "Completa"
                      : `Elige una posición · ${selectedCards.length}/5`}
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight text-white">
                  {activeStep === "CAPTAIN"
                    ? "Elige tu capitán"
                    : activeStep === "COMPLETE"
                      ? "Alineación completa"
                      : !activeStep
                        ? "Elige una posición"
                        : `Choose your ${getStepLabel(
                            activeStep === "GK" ||
                            activeStep === "DEF" ||
                            activeStep === "MID" ||
                            activeStep === "FWD" ||
                            activeStep === "EXTRA"
                              ? activeStep
                              : null
                          )}`}
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {activeStep === "CAPTAIN"
                    ? "Selecciona uno de tus cinco jugadores como capitán."
                    : activeStep === "COMPLETE"
                      ? "Tu alineación está lista."
                      : !activeStep
                        ? "Elige qué posición quieres completar."
                        : activeStep === "EXTRA"
                          ? "Elige cualquier carta excepto un portero."
                          : `Only ${SLOT_NAMES[
                              activeStep === "GK" ||
                              activeStep === "DEF" ||
                              activeStep === "MID" ||
                              activeStep === "FWD" ||
                              activeStep === "EXTRA"
                                ? activeStep
                                : "EXTRA"
                            ].toLowerCase()} cards are shown.`}
                </p>
              </div>

              {activeStep === "CAPTAIN" && (
                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-yellow-300">
                  <Crown size={21} />
                </div>
              )}

            </div>

            {/* PROGRESS */}

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center gap-1.5">

                {SELECTION_ORDER.map((slot, index) => {
                  const complete = !!selected[slot];
                  const current = activeStep === slot;
                  const clickable = complete || current;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={!clickable}
                      onClick={() => {
                        if (!clickable) {
                          return;
                        }

                        setActivePosition(slot);
                        setSearch("");
                      }}
                      className={`group flex flex-1 flex-col items-center rounded-xl px-1.5 py-2 transition ${
                        clickable
                          ? "cursor-pointer hover:bg-white/5"
                          : "cursor-default"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-black transition ${
                          complete
                            ? "bg-violet-500 text-white shadow-lg shadow-violet-900/30"
                            : current
                              ? "border border-violet-400/40 bg-violet-500/15 text-violet-200"
                              : "bg-white/5 text-zinc-600"
                        }`}
                      >
                        {complete ? "✓" : index + 1}
                      </div>

                      <span
                        className={`mt-1.5 text-[9px] font-black uppercase tracking-wide transition ${
                          complete || current
                            ? "text-violet-300"
                            : "text-zinc-600"
                        }`}
                      >
                        {slot}
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={!captainId && activeStep !== "CAPTAIN"}
                  onClick={() => {
                    setActivePosition(null);
                    setSearch("");
                  }}
                  className={`group flex flex-1 flex-col items-center rounded-xl px-1.5 py-2 transition ${
                    captainId || activeStep === "CAPTAIN"
                      ? "cursor-pointer hover:bg-white/5"
                      : "cursor-default"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-black transition ${
                      captainId
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-900/20"
                        : activeStep === "CAPTAIN"
                          ? "border border-yellow-400/40 bg-yellow-400/10 text-yellow-300"
                          : "bg-white/5 text-zinc-600"
                    }`}
                  >
                    {captainId ? "✓" : "C"}
                  </div>

                  <span
                    className={`mt-1.5 text-[9px] font-black uppercase tracking-wide transition ${
                      captainId || activeStep === "CAPTAIN"
                        ? "text-yellow-300"
                        : "text-zinc-600"
                    }`}
                  >
                    CAPTAIN
                  </span>
                </button>

              </div>

              <p className="mt-2 text-center text-[9px] font-bold text-zinc-600">
                Pulsa una posición completada para volver a editarla
              </p>
            </div>

            {/* COMPETITION RULE */}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                className={`rounded-2xl border px-4 py-3 ${
                  inSeasonCount === 4
                    ? "border-violet-400/40 bg-violet-500/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    Temporada actual
                  </span>
                  <span className="text-sm font-black text-violet-300">
                    {inSeasonCount}/4
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-zinc-600">
                  Temporada actual
                </p>
              </div>

              <div
                className={`rounded-2xl border px-4 py-3 ${
                  classicCount === 1
                    ? "border-yellow-400/40 bg-yellow-400/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    Clásico
                  </span>
                  <span className="text-sm font-black text-yellow-300">
                    {classicCount}/1
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-zinc-600">
                  Temporadas anteriores
                </p>
              </div>
            </div>

            {/* POSITION SELECTOR */}

            {!activeStep && (
              <div className="mt-5">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                  Elige una posición
                </p>

                <div className="grid grid-cols-5 gap-2.5">
                  {SELECTION_ORDER.map((slot) => {
                    const complete = !!selected[slot];

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={complete}
                        onClick={() => {
                          setActivePosition(slot);
                          setSearch("");
                        }}
                        className={`relative rounded-2xl border px-2 py-3.5 text-xs font-black transition ${
                          complete
                            ? "cursor-not-allowed border-violet-500/20 bg-violet-500/10 text-violet-300"
                            : "border-white/10 bg-white/5 text-zinc-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                        }`}
                      >
                        {slot}

                        {complete && (
                          <Check
                            size={13}
                            className="absolute right-1.5 top-1.5 text-green-400"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeStep &&
              activeStep !== "CAPTAIN" &&
              activeStep !== "COMPLETE" && (
                <div className="mt-5">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    Change position
                  </p>

                  <div className="grid grid-cols-5 gap-2.5">
                    {SELECTION_ORDER.map((slot) => {
                      const complete = !!selected[slot];
                      const current = activeStep === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={complete && !current}
                          onClick={() => {
                            if (complete && !current) return;

                            setActivePosition(slot);
                            setSearch("");
                          }}
                          className={`relative rounded-2xl border px-2 py-3.5 text-xs font-black transition ${
                            current
                              ? "border-violet-400 bg-violet-500/20 text-violet-200 shadow-lg shadow-violet-900/20"
                              : complete
                                ? "cursor-not-allowed border-violet-500/20 bg-violet-500/10 text-violet-300"
                                : "border-white/10 bg-white/5 text-zinc-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                          }`}
                        >
                          {slot}

                          {complete && (
                            <Check
                              size={13}
                              className="absolute right-1.5 top-1.5 text-green-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* CARD FILTER */}

            {activeStep !== "CAPTAIN" &&
              activeStep !== "COMPLETE" &&
              activeStep && (
                <div className="mt-5">
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
                    Mostrar cartas
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["available", "Disponibles"],
                      ["all", "Todas"],
                      ["other", "En otros equipos"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setLineupCardFilter(
                            value as "available" | "all" | "other"
                          )
                        }
                        className={`rounded-xl border px-3 py-2.5 text-[11px] font-black transition ${
                          lineupCardFilter === value
                            ? "border-violet-400/50 bg-violet-500/15 text-violet-200"
                            : "border-white/10 bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* SORT */}

            {activeStep !== "CAPTAIN" && activeStep !== "COMPLETE" && activeStep && (
              <div className="relative mt-5">
                <button
                  type="button"
                  onClick={() => setSortOpen((value) => !value)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-left transition hover:border-violet-400/30 hover:bg-violet-500/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                      <SlidersHorizontal size={17} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">Ordenar jugadores</p>
                      <p className="mt-0.5 text-sm font-black text-white">
                        {sortOption === "average" ? "Puntuación media" : sortOption === "nextMatch" ? "Juega próximamente" : sortOption === "l5" ? "Forma · L5" : sortOption === "l10" ? "Forma · L10" : "Forma · L15"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={18} className={`text-zinc-500 transition ${sortOpen ? "rotate-180" : ""}`} />
                </button>

                {sortOpen && (
                  <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#17112f] p-2 shadow-2xl shadow-black/50">
                    {[
                      ["average", "Puntuación media"],
                      ["nextMatch", "Juega próximamente"],
                      ["l5", "Forma · L5"],
                      ["l10", "Forma · L10"],
                      ["l15", "Forma · L15"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSortOption(value as SortOption);
                          setSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition ${sortOption === value ? "bg-violet-500/15 text-violet-200" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                      >
                        <span>{label}</span>
                        {sortOption === value && <Check size={16} className="text-violet-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SEARCH */}

            {activeStep !== "COMPLETE" &&
              activeStep !== null && (
              <div className="relative mt-5">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder={
                    activeStep ===
                    "CAPTAIN"
                      ? "Buscar jugadores seleccionados..."
                      : "Buscar jugador o club..."
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

          </div>

          {/* CARDS */}

          <div className="min-h-0 flex-1 overflow-y-auto p-5">

            {activeStep ===
              "COMPLETE" ? (
              <CompleteState
                captainId={captainId}
                selectedCards={selectedCards}
                onSave={saveLineup}
                isEditing={editingLineup}
              />
            ) : activeStep ===
              "CAPTAIN" ? (
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {captainCards
                  .filter((card) => {
                    const query =
                      search
                        .trim()
                        .toLowerCase();

                    return (
                      !query ||
                      card.playerName
                        .toLowerCase()
                        .includes(query) ||
                      card.club
                        ?.toLowerCase()
                        .includes(query)
                    );
                  })
                  .map((card) => (
                    <CaptainCard
                      key={card.id}
                      card={card}
                      selected={
                        captainId ===
                        card.id
                      }
                      onSelect={() =>
                        selectCaptain(
                          card
                        )
                      }
                    />
                  ))}
              </div>
            ) : loading ? (
              <div className="flex min-h-[350px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-zinc-500">
                  <RefreshCw
                    size={28}
                    className="animate-spin text-violet-400"
                  />
                  <span className="text-sm">
                    Loading cards...
                  </span>
                </div>
              </div>
            ) : !activeStep ? (
              <div className="flex min-h-[350px] items-center justify-center text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                    <Plus size={26} />
                  </div>

                  <p className="mt-4 font-black text-zinc-300">
                    Elige una posición
                  </p>

                  <p className="mt-1 max-w-xs text-sm leading-6 text-zinc-600">
                    Selecciona GK, DEF, MID, FWD o EXTRA para comenzar tu alineación.
                  </p>
                </div>
              </div>
            ) : availableCards.length ===
              0 ? (
              <div className="flex min-h-[350px] items-center justify-center text-center">
                <div>
                  <p className="font-bold text-zinc-300">
                    No {SLOT_NAMES[
                      activeStep
                    ].toLowerCase()} cards found
                  </p>

                  <p className="mt-1 text-sm text-zinc-600">
                    Try another search.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {sortedAvailableCards.map(
                  (card) => (
                    <PlayerCard
                      key={card.id}
                      card={card}
                      selected={
                        !!activeStep &&
                        selected[activeStep]?.id === card.id
                      }
                      onSelect={() =>
                        selectCard(
                          card
                        )
                      }
                      otherLineupName={
                        cardLineupMap.get(card.id) ?? null
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* COMPLETE FOOTER */}

          

        </section>

      
      {/* SAVE LINEUP MODAL */}

      {showAllLineups && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setShowAllLineups(false)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-violet-400/20 bg-[#100c20] shadow-2xl shadow-black/70"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="flex items-start justify-between border-b border-white/10 bg-black/20 px-7 py-6">

              <div>
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <Plus size={21} />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
                      Lineup Studio
                    </p>

                    <h2 className="mt-1 text-3xl font-black text-white">
                      Todas mis alineaciones
                    </h2>
                  </div>

                </div>

                <p className="mt-3 text-sm text-zinc-500">
                  {(() => {
                    const week = gameWeeks.find(
                      (item) => item.id === selectedGameWeekId
                    );

                    if (!week) {
                      return "Game Week";
                    }

                    return `${week.name} · ${new Intl.DateTimeFormat(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    ).format(new Date(week.startAt))} — ${new Intl.DateTimeFormat(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    ).format(new Date(week.endAt))}`;
                  })()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllLineups(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={19} />
              </button>

            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-7">

              {savedLineups.length === 0 ? (

                <div className="flex min-h-[400px] items-center justify-center text-center">

                  <div>

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                      <Plus size={30} />
                    </div>

                    <h3 className="mt-5 text-xl font-black text-white">
                      No tienes alineaciones
                    </h3>

                    <p className="mt-2 text-sm text-zinc-500">
                      Crea una alineación para esta Game Week.
                    </p>

                  </div>

                </div>

              ) : (

                <div
                  className={`grid gap-6 ${
                    savedLineups.length === 1
                      ? "grid-cols-1"
                      : "lg:grid-cols-2"
                  }`}
                >

                  {savedLineups.map((lineup) => (

                    <div
                      key={lineup.id}
                      className={`overflow-hidden rounded-[26px] border transition ${
                        selectedLineupId === lineup.id
                          ? "border-violet-400/40 bg-violet-500/[0.07] shadow-xl shadow-violet-950/20"
                          : "border-white/10 bg-white/[0.025] hover:border-white/20"
                      }`}
                    >

                      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">

                        <div className="min-w-0">

                          <div className="flex items-center gap-3">

                            <h3 className="truncate text-xl font-black text-white">
                              {lineup.name}
                            </h3>

                            {selectedLineupId === lineup.id && (
                              <span className="shrink-0 rounded-lg bg-violet-500/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-violet-300">
                                Seleccionada
                              </span>
                            )}

                          </div>

                          <p className="mt-1 text-xs font-bold text-zinc-600">
                            {lineup.players.length} jugadores
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setShowAllLineups(false);
                            setDeleteLineup(lineup);
                          }}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                          title="Eliminar alineación"
                        >
                          <X size={17} />
                        </button>

                      </div>

                      <div className="p-5">

                        <div className="grid grid-cols-5 gap-3">

                          {lineup.players.map((player) => (

                            <div
                              key={player.id}
                              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                            >

                              {player.card.pictureUrl ? (
                                <img
                                  src={player.card.pictureUrl}
                                  alt={player.card.playerName}
                                  className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                />
                              ) : (
                                <div className="flex aspect-[3/4] items-center justify-center text-xs font-black text-zinc-600">
                                  {player.card.playerName
                                    .slice(0, 3)
                                    .toUpperCase()}
                                </div>
                              )}

                              {player.captain && (
                                <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400 text-xs font-black text-black shadow-lg">
                                  C
                                </div>
                              )}

                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent px-2 pb-2 pt-7">

                                <p className="truncate text-xs font-black text-white">
                                  {player.card.playerName}
                                </p>

                                <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-wide text-zinc-500">
                                  {player.slot}
                                </p>

                              </div>

                            </div>

                          ))}

                        </div>

                        <div className="mt-5 flex gap-3">

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLineupId(lineup.id);
                              setEditingLineup(false);
                              setShowAllLineups(false);
                            }}
                            className="flex-1 rounded-2xl bg-violet-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500"
                          >
                            Cargar alineación
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLineupId(lineup.id);
                              setEditingLineup(true);
                              setShowAllLineups(false);
                            }}
                            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-black text-zinc-300 transition hover:bg-white/10 hover:text-white"
                          >
                            Editar
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>
        </div>
      )}

      {showSaveModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!savingLineup) {
              setShowSaveModal(false);
              setShowReplaceWarning(false);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-[28px] border border-violet-400/20 bg-[#17112f] p-7 shadow-2xl shadow-black/60"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {showReplaceWarning ? (
              <>
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-500/10 text-2xl font-black text-yellow-300 shadow-lg shadow-yellow-900/10">
                      !
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
                        Atención
                      </p>

                      <h3 className="mt-2 text-3xl font-black leading-tight text-white">
                        Esta alineación reemplazará otras
                      </h3>

                      <p className="mt-3 max-w-xl text-base leading-7 text-zinc-400">
                        Algunas cartas que has seleccionado están siendo
                        utilizadas en otras alineaciones de esta Game Week.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={savingLineup}
                    onClick={() =>
                      setShowReplaceWarning(false)
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                    aria-label="Cerrar"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="mt-7 space-y-3">
                  {conflictingLineups.map((lineup) => {
                    const conflictingPlayers =
                      lineup.players.filter((player) =>
                        selectedCards.some(
                          (card) =>
                            card.id === player.cardId
                        )
                      );

                    return (
                      <div
                        key={lineup.id}
                        className="rounded-2xl border border-yellow-400/30 bg-yellow-500/[0.06] px-5 py-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-xl">
                            🗑
                          </div>

                          <div className="min-w-0">
                            <p className="text-lg font-black text-white">
                              {lineup.name}
                            </p>

                            <p className="mt-1 text-sm leading-6 text-zinc-400">
                              {conflictingPlayers
                                .map(
                                  (player) =>
                                    player.card.playerName
                                )
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/[0.07] px-5 py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-xl font-black text-red-300">
                      !
                    </div>

                    <p className="text-sm font-bold leading-6 text-red-200">
                      Si continúas,{" "}
                      <span className="font-black text-red-300">
                        estas alineaciones se eliminarán completamente
                      </span>{" "}
                      y esta nueva alineación ocupará sus cartas.
                      <span className="mt-1 block text-red-300/70">
                        Esta acción no se puede deshacer.
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex gap-4">
                  <button
                    type="button"
                    disabled={savingLineup}
                    onClick={() =>
                      setShowReplaceWarning(false)
                    }
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base font-black text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                  >
                    Volver
                  </button>

                  <button
                    type="button"
                    disabled={savingLineup}
                    onClick={() => {
                      setShowReplaceWarning(false);
                      confirmSaveLineup();
                    }}
                    className="flex-1 rounded-2xl bg-yellow-500 px-5 py-4 text-base font-black text-black shadow-lg shadow-yellow-900/20 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {savingLineup
                      ? "Guardando..."
                      : "Guardar y reemplazar"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                      Guardar alineación
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-white">
                      Ponle un nombre
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Guarda esta alineación para recuperarla
                      durante esta Game Week.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={savingLineup}
                    onClick={() =>
                      setShowSaveModal(false)
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-zinc-500">
                    Nombre de la alineación
                  </label>

                  <input
                    autoFocus
                    value={lineupName}
                    onChange={(event) =>
                      setLineupName(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        lineupName.trim() &&
                        !savingLineup
                      ) {
                        confirmSaveLineup();
                      }

                      if (
                        event.key === "Escape" &&
                        !savingLineup
                      ) {
                        setShowSaveModal(false);
                      }
                    }}
                    placeholder="Ej. Mi mejor equipo"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50 focus:bg-black/40"
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    disabled={savingLineup}
                    onClick={() =>
                      setShowSaveModal(false)
                    }
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-black text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    disabled={
                      !lineupName.trim() ||
                      savingLineup
                    }
                    onClick={() => {
                      if (conflictingLineups.length > 0) {
                        setShowReplaceWarning(true);
                        return;
                      }

                      confirmSaveLineup();
                    }}
                    className="flex-1 rounded-2xl bg-violet-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {savingLineup
                      ? "Guardando..."
                      : "Guardar alineación"}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {deleteLineup && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setDeleteLineup(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-red-400/20 bg-[#120e25] shadow-2xl shadow-black/70"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6">

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <X size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
                    Eliminar alineación
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white">
                    ¿Eliminar esta alineación?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Vas a eliminar permanentemente
                    <span className="font-black text-white">
                      {" "}{deleteLineup.name}
                    </span>
                    . Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-red-400/10 bg-red-500/[0.05] px-4 py-3">
                <p className="text-xs font-bold leading-5 text-red-300">
                  Las cartas no se eliminarán de tu colección.
                  Solo se eliminará esta alineación.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteLineup(null)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-black text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteLineup}
                  className="flex-1 rounded-2xl bg-red-500 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-red-950/30 transition hover:bg-red-400"
                >
                  Eliminar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      </div>
      </div>
    </div>
  );
}

function ScoreBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`min-w-[110px] rounded-2xl border px-4 py-3 ${
        highlight
          ? "border-violet-500/30 bg-violet-500/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-black ${
          highlight
            ? "text-violet-300"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PlayerCard({
  card,
  onSelect,
  otherLineupName,
  selected = false,
}: {
  card: Card;
  onSelect: () => void;
  otherLineupName?: string | null;
  selected?: boolean;
}) {
  const rarity = getRarityStyle(card.scarcity);

  return (
    <div className="group flex min-w-0 flex-col items-center">
      <button
        type="button"
        onClick={onSelect}
        className={`relative w-full overflow-hidden rounded-2xl text-left transition duration-200 ${
          otherLineupName
            ? "hover:-translate-y-1"
            : "hover:-translate-y-1"
        }`}
      >
        <div
          className={`relative mx-auto aspect-[0.72] w-full max-w-[190px] overflow-hidden rounded-2xl border-2 ${
            otherLineupName
              ? "border-yellow-400/20 bg-[#090d16] opacity-75"
              : selected
                ? "border-violet-400/70 bg-[#090d16] shadow-2xl shadow-violet-900/30"
                : `${rarity.border} bg-[#090d16] shadow-xl ${rarity.glow}`
          }`}
        >
          {card.pictureUrl ? (
            <img
              src={card.pictureUrl}
              alt={card.playerName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-600">
              CARD
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

          <span
            className={`absolute left-2 top-2 rounded-md bg-black/75 px-2 py-1 text-[8px] font-black ${rarity.badge}`}
          >
            {card.scarcity}
          </span>

          {otherLineupName ? (
            <div className="absolute inset-x-2 bottom-2 rounded-xl border border-yellow-400/25 bg-black/90 px-2.5 py-2.5 text-center shadow-lg backdrop-blur-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-yellow-300">
                🔒 En otro equipo
              </p>
              <p className="mt-0.5 truncate text-[9px] font-black text-white">
                {otherLineupName}
              </p>
              <p className="mt-0.5 text-[8px] font-bold text-zinc-500">
                No disponible
              </p>
            </div>
          ) : selected ? (
            <div className="absolute inset-x-2 bottom-2 rounded-xl border border-violet-400/30 bg-violet-600/90 px-2.5 py-2 text-center shadow-lg shadow-violet-900/40 backdrop-blur-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-white">
                ✓ Seleccionada
              </p>
              <p className="mt-0.5 truncate text-[8px] font-bold text-violet-100">
                Pulsa para sustituir
              </p>
            </div>
          ) : (
            <span className="absolute right-2 top-2 rounded-lg bg-violet-600 p-2 text-white shadow-lg shadow-violet-900/40 transition group-hover:bg-violet-500">
              <Plus size={18} />
            </span>
          )}
        </div>
      </button>

      <div className="mt-2 w-full max-w-[190px] rounded-xl border border-white/8 bg-black/20 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-md bg-violet-500/15 px-2 py-1 text-[10px] font-black text-violet-300">
            L10
          </span>

          <span className="text-sm font-black text-white">
            {card.l10Score?.toFixed(1) ?? "—"}
          </span>
        </div>

        {card.nextMatch && (
        <div className="mt-1 w-[115px] overflow-hidden rounded-lg border border-white/10 bg-[#080c14] shadow-lg">

          <div className="flex items-center justify-center gap-1 px-1.5 py-1">
            <span className="text-[8px] font-black text-zinc-400">
              L5
            </span>
            <span className="rounded bg-green-500 px-1.5 py-0.5 text-[9px] font-black text-black">
              {card.l5Score?.toFixed(0) ?? "—"}
            </span>
            <span className="rounded bg-violet-600 px-1.5 py-0.5 text-[8px] font-black text-white">
              AA {card.averageScore?.toFixed(0) ?? "—"}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1 border-t border-white/10 px-1.5 py-1">

            {card.nextMatch.teamLogo ? (
              <img
                src={card.nextMatch.teamLogo}
                alt=""
                className="h-[17px] w-[17px] shrink-0 object-contain"
              />
            ) : (
              <div className="h-[17px] w-[17px] shrink-0 rounded-full bg-white/5" />
            )}

            <span className="max-w-[28px] truncate text-[8px] font-black text-white">
              {card.nextMatch.teamAbbreviation ?? "TEAM"}
            </span>

            <span className="text-[8px] font-black text-zinc-500">
              {card.nextMatch.isHome ? "VS" : "@"}
            </span>

            <span className="max-w-[28px] truncate text-[8px] font-black text-white">
              {card.nextMatch.opponentAbbreviation ?? "RIVAL"}
            </span>

            {card.nextMatch.opponentLogo ? (
              <img
                src={card.nextMatch.opponentLogo}
                alt=""
                className="h-4 w-4 shrink-0 object-contain"
              />
            ) : (
              <div className="h-4 w-4 shrink-0 rounded-full bg-white/5" />
            )}

          </div>

          <div className="border-t border-white/10 px-1.5 py-1 text-center">
            <span className="text-[8px] font-black text-zinc-400">
              {card.nextMatch.date}
            </span>
            <span className="mx-1 text-zinc-600">·</span>
            <span className="text-[8px] font-black text-white">
              {card.nextMatch.time}
            </span>
          </div>

        </div>
      )}

      </div>
    </div>
  );
}

function CaptainCard({
  card,
  selected,
  onSelect,
}: {
  card: Card;
  selected: boolean;
  onSelect: () => void;
}) {
  const rarity =
    getRarityStyle(card.scarcity);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${
        selected
          ? "border-yellow-400/50 bg-yellow-400/10"
          : "border-white/5 bg-black/10 hover:border-yellow-400/30 hover:bg-yellow-400/[0.04]"
      }`}
    >
      <div
        className={`relative h-[250px] w-[178px] shrink-0 overflow-hidden rounded-xl border ${rarity.border} bg-[#0b1020] shadow-lg ${rarity.glow}`}
      >
        {card.pictureUrl ? (
          <img
            src={card.pictureUrl}
            alt={card.playerName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-600">
            CARD
          </div>
        )}
      </div>

      <div className="min-w-0 w-full text-center">
        <p className="truncate text-base font-black text-white">
          {card.playerName}
        </p>

        <p className="mt-0.5 text-xs text-zinc-500">
          {card.club ?? "Club desconocido"}
        </p>

        <p className="mt-2 text-xs font-bold text-zinc-400">
          AA{" "}
          <span className="text-white">
            {card.averageScore?.toFixed(
              1
            ) ?? "—"}
          </span>
        </p>
      </div>

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
          selected
            ? "bg-yellow-400 text-black"
            : "bg-white/5 text-zinc-500 group-hover:bg-yellow-400/10 group-hover:text-yellow-300"
        }`}
      >
        {selected ? (
          <Check size={21} />
        ) : (
          <Crown size={20} />
        )}
      </div>
    </button>
  );
}

function CompleteState({
  captainId,
  selectedCards,
  onSave,
  isEditing,
}: {
  captainId: string | null;
  selectedCards: Card[];
  onSave: () => void;
  isEditing: boolean;
}) {
  const captain =
    selectedCards.find(
      (card) => card.id === captainId
    );

  const currentSeason =
    selectedCards.length > 0
      ? Math.max(
          ...selectedCards.map(
            (card) => card.season
          )
        )
      : null;

  const inSeasonCount =
    currentSeason === null
      ? 0
      : selectedCards.filter(
          (card) => card.season === currentSeason
        ).length;

  const classicCount =
    selectedCards.length - inSeasonCount;

  return (
    <div className="flex min-h-[420px] flex-col justify-center">

      <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8">

        <div className="flex items-start gap-5">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-green-400/20 bg-green-500/10 text-green-400">
            <Check size={32} strokeWidth={3} />
          </div>

          <div className="min-w-0">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
              Completa
            </p>

            <h3 className="mt-1 text-3xl font-black tracking-tight text-white md:text-4xl">
              Alineación completa
            </h3>

            <p className="mt-2 text-base leading-7 text-zinc-400 md:text-lg">
              Tu alineación está lista. Has seleccionado los 5 jugadores y tu capitán.
            </p>

          </div>

        </div>

        <div className="mt-7 grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-5">

            <div className="flex items-center justify-between">

              <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                Temporada actual
              </span>

              <span className="text-2xl font-black text-violet-300">
                {inSeasonCount}/4
              </span>

            </div>

            <p className="mt-2 text-sm font-medium text-zinc-500">
              Máximo 4 cartas de la temporada actual
            </p>

          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">

            <div className="flex items-center justify-between">

              <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                Clásico
              </span>

              <span className="text-2xl font-black text-yellow-300">
                {classicCount}/1
              </span>

            </div>

            <p className="mt-2 text-sm font-medium text-zinc-500">
              Máximo 1 carta de temporadas anteriores
            </p>

          </div>

        </div>

        {captain && (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.06] px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300">
                <Crown size={21} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                  Capitán
                </p>

                <p className="mt-0.5 text-base font-black text-white">
                  {captain.playerName}
                </p>
              </div>

            </div>

            <span className="rounded-xl bg-yellow-400/10 px-3 py-1.5 text-xs font-black text-yellow-300">
              CAPTAIN
            </span>

          </div>
        )}

        <button
          type="button"
          onClick={onSave}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-violet-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
        >
          <Check size={20} strokeWidth={3} />
          {isEditing
            ? "Guardar cambios"
            : "Guardar alineación"}
        </button>

      </div>

    </div>
  );
}

function LineupSlot({
  label,
  card,
  captain,
  onRemove,
  onSelect,
}: {
  label: SlotKey;
  card?: Card;
  captain: boolean;
  onRemove: () => void;
  onSelect?: () => void;
}) {
  if (!card) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-col items-center gap-2"
      >
        <div className="flex h-[180px] w-[128px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/10 text-zinc-500 transition hover:border-violet-400/50 hover:bg-violet-500/5 hover:text-violet-300">
          <Plus size={28} className="mb-3" />

          <span className="text-[11px] font-black tracking-wider">
            {label}
          </span>
        </div>

        <span className="rounded-lg bg-black/40 px-3 py-1.5 text-[10px] font-black text-zinc-400">
          {label}
        </span>
      </button>
    );
  }

  const rarity = getRarityStyle(card.scarcity);

  return (
    <div
      className="group relative flex flex-col items-center"
      onClick={onSelect}
    >

      {/* CARTA */}
      <div
        className={
          "relative h-[200px] w-[140px] overflow-hidden rounded-2xl border-2 " +
          rarity.border +
          " bg-[#090d16] shadow-2xl " +
          rarity.glow +
          " transition duration-200 group-hover:-translate-y-1 group-hover:scale-[1.02]"
        }
      >

        {card.pictureUrl ? (
          <img
            src={card.pictureUrl}
            alt={card.playerName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-600">
            CARD
          </div>
        )}


        {/* RAREZA */}
        <span className="absolute left-2.5 top-2.5 rounded-md bg-black/75 px-2.5 py-1.5 text-[9px] font-black uppercase text-white">
          {card.scarcity}
        </span>

        {/* CAPITÁN */}
        {captain && (
          <div className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg">
            <Crown size={16} />
          </div>
        )}

        {/* ELIMINAR */}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="absolute right-2.5 top-12 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
        >
          <X size={14} />
        </button>

      </div>

      {/* INFORMACIÓN SORARE */}
      {card.nextMatch && (
        <div className="mt-2 w-[140px] overflow-hidden rounded-xl border border-white/10 bg-[#111722] shadow-xl">

          {/* PUNTUACIÓN */}
          <div className="flex h-[34px] items-center justify-between border-b border-white/10 px-2.5">

            <div className="flex items-center gap-1.5">

              <div className="flex items-end gap-[2px]">
                <span className="h-2 w-[3px] rounded-full bg-emerald-400" />
                <span className="h-3 w-[3px] rounded-full bg-emerald-400" />
                <span className="h-4 w-[3px] rounded-full bg-emerald-400" />
                <span className="h-5 w-[3px] rounded-full bg-emerald-400" />
              </div>

              <span className="text-base font-black text-white">
                {card.l5Score?.toFixed(0) ?? "—"}
              </span>

            </div>

            <span className="rounded bg-violet-600/80 px-1.5 py-0.5 text-[8px] font-black text-white">
              AA {card.averageScore?.toFixed(0) ?? "—"}
            </span>

          </div>

          {/* EQUIPOS */}
          <div className="flex h-[32px] items-center justify-center gap-1.5 border-b border-white/10 px-2">

            {card.nextMatch.teamLogo ? (
              <img
                src={card.nextMatch.teamLogo}
                alt=""
                className="h-4 w-4 shrink-0 object-contain"
              />
            ) : (
              <div className="h-4 w-4 shrink-0 rounded-full bg-white/5" />
            )}

            <span className="max-w-[28px] truncate text-[8px] font-black text-white">
              {card.nextMatch.teamAbbreviation ?? "TEAM"}
            </span>

            <span className="text-[7px] font-black text-zinc-500">
              {card.nextMatch.isHome ? "VS" : "@"}
            </span>

            <span className="max-w-[28px] truncate text-[8px] font-black text-white">
              {card.nextMatch.opponentAbbreviation ?? "RIVAL"}
            </span>

            {card.nextMatch.opponentLogo ? (
              <img
                src={card.nextMatch.opponentLogo}
                alt=""
                className="h-4 w-4 shrink-0 object-contain"
              />
            ) : (
              <div className="h-4 w-4 shrink-0 rounded-full bg-white/5" />
            )}

          </div>

          {/* FECHA Y HORA */}
          <div className="flex h-[25px] items-center justify-center gap-1.5">

            <span className="text-[8px] font-black text-zinc-400">
              {card.nextMatch.date}
            </span>

            <span className="text-[7px] text-zinc-600">
              ·
            </span>

            <span className="text-[9px] font-black text-white">
              {card.nextMatch.time}
            </span>

          </div>

        </div>
      )}

      {/* POSICIÓN */}
      <span className="mt-2 rounded-lg bg-black/70 px-3 py-1.5 text-[10px] font-black text-zinc-400">
        {label}
      </span>

    </div>
  );
}

