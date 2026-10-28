const TIME_ZONE = 'America/Fortaleza'
const OFFSET = '-03:00'
const DAY_MS = 86_400_000

const ISO = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE })
const SHORT_WEEKDAY = new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, weekday: 'short' })
const LONG_DATE = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const pad = (value) => String(value).padStart(2, '0')
const noon = (isoDate) => new Date(`${isoDate}T12:00:00${OFFSET}`)

export const todayIso = (now = new Date()) => ISO.format(now)

export const addDays = (isoDate, amount) =>
  ISO.format(new Date(noon(isoDate).getTime() + amount * DAY_MS))

export const dateRange = (from, days) =>
  Array.from({ length: days + 1 }, (_, i) => addDays(from, i))

export const weekdayOf = (isoDate) => noon(isoDate).getUTCDay()

export const dayOfMonth = (isoDate) => Number(isoDate.slice(8))

export const shortWeekday = (isoDate) => SHORT_WEEKDAY.format(noon(isoDate)).replace('.', '')

export const longDate = (isoDate) => LONG_DATE.format(noon(isoDate))

export const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export const clock = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

export const timestamp = (isoDate, minutes) => `${isoDate}T${clock(minutes)}:00${OFFSET}`
