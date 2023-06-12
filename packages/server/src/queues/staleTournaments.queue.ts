import { TournamentStatus } from '@prisma/client'
import Queue, { ProcessCallbackFunction } from 'bull'
import { prisma, REDIS_URL } from '../globals'
import dayjs from 'dayjs'
export const closeStaleQueue = new Queue('staleTournaments', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: { age: 86400 }, // Jobs will be kept for 1 day
    removeOnFail: { age: 86400 }, // Jobs will be kept for 1 day
  },
})
/**
 * Sets stale tournaments to "Finished" status.
 *
 * Stale tournament are defined as:
 * - status -> not in "Finished" or "Cancelled" status
 * - updatedAt -> no update in the last 7 days
 * - date -> start date is in the past
 *
 */
export const closeStaleProcessor: ProcessCallbackFunction<null> = async (
  _,
  done
) => {
  const tournamentsToClose = await prisma.tournament.findMany({
    where: {
      AND: {
        status: {
          notIn: [TournamentStatus.CANCELLED, TournamentStatus.FINISHED],
        },
        updatedAt: { lt: dayjs().subtract(7, 'days').toDate() },
        date: { lt: dayjs().toDate() },
      },
    },
    select: {
      id: true,
    },
  })
  await prisma.tournament.updateMany({
    where: { id: { in: tournamentsToClose.map(({ id }) => id) } },
    data: { status: TournamentStatus.FINISHED },
  })

  done()
}
