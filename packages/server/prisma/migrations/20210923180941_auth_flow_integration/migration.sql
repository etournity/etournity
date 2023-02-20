-- DropForeignKey
ALTER TABLE "ParticipantRole" DROP CONSTRAINT "ParticipantRole_participantId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_matchGameId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_matchGameId_fkey";

-- AddForeignKey
ALTER TABLE "ParticipantRole" ADD CONSTRAINT "ParticipantRole_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_matchGameId_fkey" FOREIGN KEY ("matchGameId") REFERENCES "MatchGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_matchGameId_fkey" FOREIGN KEY ("matchGameId") REFERENCES "MatchGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
