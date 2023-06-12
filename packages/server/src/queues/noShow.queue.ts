import Queue from 'bull'
import { REDIS_URL } from '../globals'

export const noShowQueue = new Queue('noShow', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: { age: 86400 }, // Jobs will be kept for 1 day
    removeOnFail: { age: 86400 }, // Jobs will be kept for 1 day
  },
})
