import { useState } from 'react'
import { dateOf, shortDate, timeOf } from '../../lib/dates.js'
import AppButton from '../app/AppButton.jsx'

const STATUS_LABEL = {
  pending: 'Aguardando confirmação',
  confirmed: 'Confirmado',
  done: 'Concluído',
  cancelled: 'Cancelado',
}

const OPEN_STATUS = ['pending', 'confirmed']

const isUpcoming = ({ starts_at, status }) =>
  OPEN_STATUS.includes(status) && new Date(starts_at) >= new Date()

function CancelAction({ onCancel }) {
  const [confirming, setConfirming] = useState(false)

  return confirming ? (
    <div className="app-row-actions">
      <AppButton variant="secondary" onClick={onCancel}>
        Sim, cancelar
      </AppButton>
      <AppButton variant="ghost" onClick={() => setConfirming(false)}>
        Manter horário
      </AppButton>
    </div>
  ) : (
    <div className="app-row-actions">
      <AppButton variant="ghost" onClick={() => setConfirming(true)}>
        Cancelar horário
      </AppButton>
    </div>
  )
}

function Row({ appointment, onCancel }) {
  const { id, starts_at, status, service_types } = appointment
  const pro = service_types.services.professionals

  return (
    <li className={`app-row client ${status}`}>
      <div>
        <div className="app-name">
          {service_types.services.name}, {service_types.name}
        </div>
        <div className="app-item-meta">
          {shortDate(dateOf(starts_at))}, {timeOf(starts_at)} ·{' '}
          <span className={`app-who ${pro.key}`}>{pro.name.split(' ')[0]}</span>
        </div>
      </div>
      <span className="app-item-meta">{STATUS_LABEL[status]}</span>
      {isUpcoming(appointment) ? <CancelAction onCancel={() => onCancel(id)} /> : null}
    </li>
  )
}

function Group({ title, items, onCancel }) {
  return items.length ? (
    <section>
      <h2 className="app-label">{title}</h2>
      <ul className="app-group">
        {items.map((appointment) => (
          <Row key={appointment.id} appointment={appointment} onCancel={onCancel} />
        ))}
      </ul>
    </section>
  ) : null
}

export default function ClientAppointments({ appointments, onCancel }) {
  const upcoming = appointments.filter(isUpcoming).reverse()
  const past = appointments.filter((appointment) => !isUpcoming(appointment))

  return appointments.length ? (
    <>
      <Group title="Próximos" items={upcoming} onCancel={onCancel} />
      <Group title="Anteriores" items={past} onCancel={onCancel} />
    </>
  ) : (
    <p className="app-lead">Você ainda não tem horários marcados.</p>
  )
}
