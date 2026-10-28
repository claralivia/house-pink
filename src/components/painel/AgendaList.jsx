import { dateOf, shortDate } from '../../lib/dates.js'
import AppointmentRow from './AppointmentRow.jsx'

export default function AgendaList({ appointments, pro, onStatus }) {
  const days = Object.entries(Object.groupBy(appointments, ({ starts_at }) => dateOf(starts_at)))

  return days.length ? (
    days.map(([date, items]) => (
      <section key={date}>
        <h2 className="app-label">{shortDate(date)}</h2>
        <ul className="app-group">
          {items.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              pro={pro}
              onStatus={onStatus}
            />
          ))}
        </ul>
      </section>
    ))
  ) : (
    <p className="app-lead">Nenhum agendamento por enquanto.</p>
  )
}
