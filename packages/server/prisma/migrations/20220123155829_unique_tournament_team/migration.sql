/*
  Warnings:

  - A unique constraint covering the columns `[name,tournamentId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tournamentId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Team_name_key";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "tournamentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_tournamentId_key" ON "Team"("name", "tournamentId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
