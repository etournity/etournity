import dayjs from 'dayjs'

export const getDate = (time: Date) => {
  if (dayjs(time).isSame(dayjs(), 'day')) return 'Today'
  if (dayjs(time).isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday'
  if (dayjs(time).isSame(dayjs().add(1, 'day'), 'day')) return 'Tomorrow'
  return dayjs(time).format('DD.MM.YY')
}

export const formatTime = (time: Date) =>
  `${getDate(time)}, ${dayjs(time).format('HH:mm')}`

export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

export const getTimezoneOffsetInHours = () => {
  const date = new Date()
  const timezoneOffset = date.getTimezoneOffset()
  return timezoneOffset / 60
}
