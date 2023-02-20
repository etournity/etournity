import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

export const useTime = () => {
  const [now, setNow] = useState(dayjs())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs())
    }, 1000)
    return () => clearInterval(interval)
  })

  return {
    now,
  }
}
