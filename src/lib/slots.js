import { dateRange, timestamp, toMinutes, todayIso, weekdayOf } from './dates.js'

const STEP_MINUTES = 30
const MINUTE_MS = 60_000

const range = (start, end, step) =>
  Array.from(
    { length: Math.max(0, Math.floor((end - start) / step) + 1) },
    (_, i) => start + i * step,
  )

const isOff = (timeOff, date) =>
  timeOff.some(({ starts_on, ends_on }) => date >= starts_on && date <= ends_on)

const isBusy = (busy, start, end) => busy.some((slot) => start < slot.end && end > slot.start)

export const slotsForDay = ({ date, hours, timeOff, busy, duration, now }) =>
  isOff(timeOff, date)
    ? []
    : hours
        .filter(({ weekday }) => weekday === weekdayOf(date))
        .flatMap(({ starts_at, ends_at }) =>
          range(toMinutes(starts_at), toMinutes(ends_at) - duration, STEP_MINUTES),
        )
        .filter((minutes) => {
          const start = new Date(timestamp(date, minutes)).getTime()
          return start > now && !isBusy(busy, start, start + duration * MINUTE_MS)
        })

const isClosed = ({ hours, timeOff }, date) =>
  isOff(timeOff, date) || !hours.some(({ weekday }) => weekday === weekdayOf(date))

// Dias em que as duas profissionais atendem, com só os horários livres das duas.
export const joinDays = (first, second) => {
  const other = Object.fromEntries(second.map((day) => [day.date, day]))
  return first
    .filter((day) => other[day.date])
    .map((day) => ({
      date: day.date,
      closed: day.closed || other[day.date].closed,
      slots: day.slots.filter((slot) => other[day.date].slots.includes(slot)),
    }))
}

export const buildDays = ({ availability, duration, windowDays, now = Date.now() }) =>
  dateRange(todayIso(new Date(now)), windowDays).map((date) => ({
    date,
    closed: isClosed(availability, date),
    slots: slotsForDay({ date, ...availability, duration, now }),
  }))
