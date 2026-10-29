import { STATUS_LABEL } from '../../lib/clientAppointments.js'
import { dateOf, shortDate, timeOf } from '../../lib/dates.js'
import { formatPrice } from '../../lib/money.js'

export default function AppointmentLine({ appointment }) {
  const { starts_at, status, price_cents, service_types: type } = appointment
  const professional = type.services.professionals

  return (
    <li className={`app-row client ${status}`}>
      <div>
        <div className="app-name">
          {type.services.name}, {type.name}
        </div>
        <div className="app-item-meta">
          {shortDate(dateOf(starts_at))}, {timeOf(starts_at)} ·{' '}
          <span className={`app-who ${professional.key}`}>{professional.name.split(' ')[0]}</span>
        </div>
        <div className="app-item-meta">{STATUS_LABEL[status]}</div>
      </div>
      {status === 'done' && price_cents ? (
        <span className="app-price">{formatPrice(price_cents)}</span>
      ) : null}
    </li>
  )
}
