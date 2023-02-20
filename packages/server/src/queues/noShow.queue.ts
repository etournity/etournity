import Queue from 'bull'
import { REDIS_URL } from '../globals'

export const noShowQueue = new Queue('noShow', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
  },
})
