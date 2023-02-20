/*
  Warnings:

  - Added the required column `number` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "number" INTEGER NOT NULL;

-- RenameIndex
ALTER INDEX "Game_imageId_unique" RENAME TO "Game_imageId_key";
