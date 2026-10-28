import { longDate, dateOf, timeOf } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import ExternalLink from '../ui/ExternalLink.jsx'

const STATUS_LABEL = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  done: 'Concluído',
}

const NEXT_ACTIONS = {
  pending: [
    { label: 'Confirmar', status: 'confirmed' },
    { label: 'Cancelar', status: 'cancelled' },
  ],
  confirmed: [
    { label: 'Concluir', status: 'done' },
    { label: 'Cancelar', status: 'cancelled' },
  ],
}

const reminder = ({ clients, starts_at }) =>
  `Oi, ${clients.name}! Aqui é da House Pink, sobre o seu horário de ${longDate(dateOf(starts_at))}, às ${timeOf(starts_at)}.`

export default function AppointmentRow({ appointment, onStatus }) {
  const { id, starts_at, status, clients, service_types } = appointment

  return (
    <li className={`ag-row ${status}`}>
      <strong className="ag-time">{timeOf(starts_at)}</strong>
      <div className="ag-info">
        <p className="ag-name">{clients.name}</p>
        <p className="ag-service">
          {service_types.services.name}, {service_types.name}
        </p>
        <ExternalLink href={whatsappUrl(clients, reminder(appointment))}>
          WhatsApp da cliente
        </ExternalLink>
      </div>
      <span className="ag-status">{STATUS_LABEL[status]}</span>
      <div className="ag-actions">
        {(NEXT_ACTIONS[status] ?? []).map(({ label, status: next }) => (
          <button key={next} type="button" className="chip" onClick={() => onStatus(id, next)}>
            {label}
          </button>
        ))}
      </div>
    </li>
  )
}
