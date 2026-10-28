import { dateOf, longDate } from '../../lib/dates.js'
import AppointmentRow from './AppointmentRow.jsx'

export default function AgendaList({ appointments, onStatus }) {
  const days = Object.entries(Object.groupBy(appointments, ({ starts_at }) => dateOf(starts_at)))

  return days.length ? (
    days.map(([date, items]) => (
      <section key={date} className="ag-day">
        <h2 className="ag-date">{longDate(date)}</h2>
        <ul className="ag-list">
          {items.map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} onStatus={onStatus} />
          ))}
        </ul>
      </section>
    ))
  ) : (
    <p className="lead">Nenhum agendamento por enquanto.</p>
  )
}
