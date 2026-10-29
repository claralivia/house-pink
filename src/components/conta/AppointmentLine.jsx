import { STATUS_LABEL } from '../../lib/clientAppointments.js'
import { dateOf, shortDate, timeOf } from '../../lib/dates.js'
import { formatPrice } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import Stars from '../app/Stars.jsx'

export default function AppointmentLine({ appointment, onReview }) {
  const { starts_at, status, price_cents, feedback, service_types: type } = appointment
  const professional = type.services.professionals
  const canReview = status === 'done' && onReview

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
        {canReview && feedback ? <Stars value={feedback.rating} /> : null}
      </div>
      <div className="app-line-end">
        {status === 'done' && price_cents ? (
          <span className="app-price">{formatPrice(price_cents)}</span>
        ) : null}
        {canReview ? (
          <AppButton variant="secondary" onClick={() => onReview(appointment)}>
            {feedback ? 'Mudar nota' : 'Avaliar'}
          </AppButton>
        ) : null}
      </div>
    </li>
  )
}
