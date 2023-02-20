-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "deniedMod" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "number" DROP NOT NULL;
