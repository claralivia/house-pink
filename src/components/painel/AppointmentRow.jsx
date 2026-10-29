import { timeOf } from '../../lib/dates.js'
import Icon from '../app/Icon.jsx'

const STATUS = {
  pending: { label: 'Pendente', icon: 'clock', tone: 'warning' },
  confirmed: { label: 'Confirmado', icon: 'ok', tone: 'success' },
  done: { label: 'Concluído', icon: 'ok', tone: 'success' },
  cancelled: { label: 'Cancelado', icon: 'close', tone: 'muted' },
}

export default function AppointmentRow({ appointment, onOpen }) {
  const { starts_at, ends_at, status, clients, service_types } = appointment
  const { label, icon, tone } = STATUS[status]

  return (
    <li className={`app-slotrow ${status}`}>
      <button type="button" className="app-slotrow-btn" onClick={() => onOpen(appointment.id)}>
        <span className="app-slot-time">
          <strong>{timeOf(starts_at)}</strong>
          <small>até {timeOf(ends_at)}</small>
        </span>
        <span className="app-slot-who">
          <span className="app-name">{clients.name}</span>
          <span className="app-item-meta">{service_types.name}</span>
        </span>
        <span className={`app-status ${tone}`}>
          <Icon name={icon} />
          {label}
        </span>
      </button>
    </li>
  )
}
