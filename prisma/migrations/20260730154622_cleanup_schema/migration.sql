/*
  Warnings:

  - A unique constraint covering the columns `[sorareId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sorareId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "sorareId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Card_sorareId_key" ON "Card"("sorareId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_slug_key" ON "Card"("slug");
