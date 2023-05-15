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
        updatedAt: { lte: dayjs().subtract(3, 'days').toDate() },
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
