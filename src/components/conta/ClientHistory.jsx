import { split, spending, totalDone } from '../../lib/clientAppointments.js'
import { monthOf, monthTitle, todayIso } from '../../lib/dates.js'
import { formatPrice } from '../../lib/money.js'
import AppointmentLine from './AppointmentLine.jsx'

const plural = (count) => `${count} ${count === 1 ? 'atendimento' : 'atendimentos'}`

export default function ClientHistory({ appointments, onReview }) {
  const month = monthOf(todayIso())
  const { past } = split(appointments)
  const thisMonth = spending(appointments, month)
  const all = totalDone(appointments)

  return (
    <>
      <div className="app-total">
        <span className="app-help">{monthTitle(month)}</span>
        <strong>{formatPrice(thisMonth.cents)}</strong>
        <span className="app-help">
          {plural(thisMonth.count)} · desde o começo {formatPrice(all.cents)} em {plural(all.count)}
        </span>
      </div>

      {past.length ? (
        <>
          <h2 className="app-label">Histórico</h2>
          <ul className="app-group">
            {past.map((appointment) => (
              <AppointmentLine key={appointment.id} appointment={appointment} onReview={onReview} />
            ))}
          </ul>
        </>
      ) : (
        <p className="app-lead">Quando você fizer o primeiro atendimento, ele aparece aqui.</p>
      )}
    </>
  )
}
