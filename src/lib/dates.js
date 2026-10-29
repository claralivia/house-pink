const TIME_ZONE = 'America/Fortaleza'
const OFFSET = '-03:00'
const DAY_MS = 86_400_000

const ISO = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE })
const SHORT_WEEKDAY = new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, weekday: 'short' })
const CLOCK = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
})
const LONG_DATE = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const MONTH_YEAR = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  month: 'long',
  year: 'numeric',
})
const SHORT_MONTH = new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, month: 'short' })

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

export const shortDate = (isoDate) =>
  `${shortWeekday(isoDate)}, ${dayOfMonth(isoDate)} ${SHORT_MONTH.format(noon(isoDate)).replace('.', '')}`

export const monthOf = (isoDate) => isoDate.slice(0, 7)

export const addMonths = (month, amount) => {
  const [year, number] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, number - 1 + amount, 1))
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`
}

export const monthDays = (month) => {
  const [year, number] = month.split('-').map(Number)
  const count = new Date(Date.UTC(year, number, 0)).getUTCDate()
  return Array.from({ length: count }, (_, i) => `${month}-${pad(i + 1)}`)
}

export const monthTitle = (month) => {
  const text = MONTH_YEAR.format(noon(`${month}-01`)).replace(' de ', ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours ? `${hours}h${rest ? pad(rest) : ''}` : `${rest}min`
}

export const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export const clock = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

export const dateOf = (value) => ISO.format(new Date(value))

export const timeOf = (value) => CLOCK.format(new Date(value))

export const timestamp = (isoDate, minutes) => `${isoDate}T${clock(minutes)}:00${OFFSET}`

export const weekStart = (isoDate) => addDays(isoDate, -((weekdayOf(isoDate) + 6) % 7))

const firstOfMonth = (isoDate) => `${monthOf(isoDate)}-01`

export const periodOf = (mode, anchor) =>
  ({
    day: { from: anchor, to: addDays(anchor, 1) },
    week: { from: weekStart(anchor), to: addDays(weekStart(anchor), 7) },
    month: { from: firstOfMonth(anchor), to: `${addMonths(monthOf(anchor), 1)}-01` },
  })[mode]

export const shiftPeriod = (mode, anchor, amount) =>
  ({
    day: addDays(anchor, amount),
    week: addDays(anchor, amount * 7),
    month: `${addMonths(monthOf(anchor), amount)}-01`,
  })[mode]

export const periodTitle = (mode, anchor) => {
  const { from, to } = periodOf(mode, anchor)
  return {
    day: longDate(from),
    week: `${shortDate(from)} a ${shortDate(addDays(to, -1))}`,
    month: monthTitle(monthOf(anchor)),
  }[mode]
}
