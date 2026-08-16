-- CreateTable
CREATE TABLE "GameWeek" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lineup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameWeekId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lineup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineupPlayer" (
    "id" TEXT NOT NULL,
    "lineupId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "captain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LineupPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameWeek_startAt_endAt_idx" ON "GameWeek"("startAt", "endAt");

-- CreateIndex
CREATE UNIQUE INDEX "GameWeek_season_number_key" ON "GameWeek"("season", "number");

-- CreateIndex
CREATE INDEX "Lineup_userId_gameWeekId_idx" ON "Lineup"("userId", "gameWeekId");

-- CreateIndex
CREATE UNIQUE INDEX "Lineup_userId_gameWeekId_name_key" ON "Lineup"("userId", "gameWeekId", "name");

-- CreateIndex
CREATE INDEX "LineupPlayer_cardId_idx" ON "LineupPlayer"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "LineupPlayer_lineupId_slot_key" ON "LineupPlayer"("lineupId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "LineupPlayer_lineupId_cardId_key" ON "LineupPlayer"("lineupId", "cardId");

-- AddForeignKey
ALTER TABLE "Lineup" ADD CONSTRAINT "Lineup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lineup" ADD CONSTRAINT "Lineup_gameWeekId_fkey" FOREIGN KEY ("gameWeekId") REFERENCES "GameWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineupPlayer" ADD CONSTRAINT "LineupPlayer_lineupId_fkey" FOREIGN KEY ("lineupId") REFERENCES "Lineup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineupPlayer" ADD CONSTRAINT "LineupPlayer_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

