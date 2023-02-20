-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_teamId_fkey";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "kicked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "registeredAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
