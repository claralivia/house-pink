import { useState } from 'react'
import { timeOf } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import { formatPrice } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import Icon from '../app/Icon.jsx'

const STATUS = {
  pending: { label: 'Pendente', icon: 'clock', tone: 'warning' },
  confirmed: { label: 'Confirmado', icon: 'ok', tone: 'success' },
  done: { label: 'Concluído', icon: 'ok', tone: 'success' },
  cancelled: { label: 'Cancelado', icon: 'close', tone: 'muted' },
}

const NEXT_ACTIONS = {
  pending: [{ label: 'Confirmar', status: 'confirmed' }],
  confirmed: [{ label: 'Concluir', status: 'done' }],
}

const PAYMENTS = [
  { id: 'pix', label: 'Pix' },
  { id: 'card', label: 'Cartão' },
  { id: 'cash', label: 'Dinheiro' },
]

const CANCEL = { label: 'Cancelar horário', status: 'cancelled' }

const reminder = ({ clients, starts_at }) =>
  `Oi, ${clients.name}! Aqui é da House Pink, sobre o seu horário das ${timeOf(starts_at)}.`

export default function AppointmentRow({ appointment, pro, onStatus, onPay }) {
  const [paying, setPaying] = useState(false)
  const { id, starts_at, ends_at, status, price_cents, clients, service_types } = appointment
  const { label, icon, tone } = STATUS[status]
  const actions = NEXT_ACTIONS[status] ? [...NEXT_ACTIONS[status], CANCEL] : []

  return (
    <li className={`app-row ${status}`}>
      <div>
        <div className="app-time">{timeOf(starts_at)}</div>
        <div className="app-sub">até {timeOf(ends_at)}</div>
      </div>
      <div>
        <div className="app-name">{clients.name}</div>
        <div className="app-item-meta">
          <span className={`app-who ${pro.key}`}>{pro.first}</span> · {service_types.services.name},{' '}
          {service_types.name}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        {price_cents === null ? null : <div className="app-price">{formatPrice(price_cents)}</div>}
        <span className={`app-status ${tone}`}>
          <Icon name={icon} />
          {label}
        </span>
      </div>
      {paying ? (
        <div className="app-row-actions">
          <p className="app-help app-full">Como foi o pagamento?</p>
          {PAYMENTS.map(({ id: method, label: text }) => (
            <AppButton key={method} variant="secondary" onClick={() => onPay(id, method)}>
              {text}
            </AppButton>
          ))}
          <AppButton variant="ghost" onClick={() => onStatus(id, 'done')}>
            Sem pagamento
          </AppButton>
        </div>
      ) : null}
      <div className="app-row-actions">
        {actions.map(({ label: text, status: next }) => (
          <AppButton
            key={next}
            variant={next === 'cancelled' ? 'ghost' : 'secondary'}
            onClick={() => (next === 'done' ? setPaying(true) : onStatus(id, next))}
          >
            {text}
          </AppButton>
        ))}
        <AppButton variant="ghost" href={whatsappUrl(clients, reminder(appointment))}>
          WhatsApp da cliente
        </AppButton>
      </div>
    </li>
  )
}
