import { addDays, dateOf, dayOfMonth, shortWeekday, timeOf, toMinutes } from '../../lib/dates.js'

const HOUR_PX = 56
const DEFAULT_START = 8
const DEFAULT_END = 18

const minutesOf = (value) => toMinutes(timeOf(value))
const lengthOf = ({ starts_at, ends_at }) => (new Date(ends_at) - new Date(starts_at)) / 60000

export default function WeekView({ appointments, start, today, onOpen }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const visible = appointments.filter(
    ({ status, starts_at }) => status !== 'cancelled' && days.includes(dateOf(starts_at)),
  )
  const first = Math.min(
    DEFAULT_START,
    ...visible.map((item) => Math.floor(minutesOf(item.starts_at) / 60)),
  )
  const last = Math.max(
    DEFAULT_END,
    ...visible.map((item) => Math.ceil((minutesOf(item.starts_at) + lengthOf(item)) / 60)),
  )
  const hours = Array.from({ length: last - first }, (_, i) => first + i)

  return (
    <div className="app-week" role="group" aria-label="Semana">
      <div className="app-week-head">
        <span />
        {days.map((date) => (
          <span key={date} className={date === today ? 'today' : ''}>
            <small>{shortWeekday(date)}</small>
            <strong>{dayOfMonth(date)}</strong>
          </span>
        ))}
      </div>
      <div className="app-week-body" style={{ height: hours.length * HOUR_PX }}>
        <div className="app-week-hours">
          {hours.map((hour) => (
            <span key={hour} style={{ top: (hour - first) * HOUR_PX }}>
              {String(hour).padStart(2, '0')}h
            </span>
          ))}
        </div>
        {days.map((date) => (
          <div key={date} className={`app-week-col${date === today ? ' today' : ''}`}>
            {visible
              .filter((item) => dateOf(item.starts_at) === date)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`app-block ${item.status}`}
                  style={{
                    top: ((minutesOf(item.starts_at) - first * 60) / 60) * HOUR_PX,
                    height: Math.max((lengthOf(item) / 60) * HOUR_PX - 2, 30),
                  }}
                  onClick={() => onOpen(item.id)}
                >
                  <strong>{timeOf(item.starts_at)}</strong>
                  <span>{item.clients.name.split(' ')[0]}</span>
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
