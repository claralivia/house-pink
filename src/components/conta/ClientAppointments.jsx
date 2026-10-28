import { dateOf, shortDate, timeOf } from '../../lib/dates.js'

const STATUS_LABEL = {
  pending: 'Aguardando confirmação',
  confirmed: 'Confirmado',
  done: 'Concluído',
  cancelled: 'Cancelado',
}

const OPEN_STATUS = ['pending', 'confirmed']

const isUpcoming = ({ starts_at, status }) =>
  OPEN_STATUS.includes(status) && new Date(starts_at) >= new Date()

function Row({ appointment }) {
  const { starts_at, status, service_types } = appointment
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
    </li>
  )
}

function Group({ title, items }) {
  return items.length ? (
    <section>
      <h2 className="app-label">{title}</h2>
      <ul className="app-group">
        {items.map((appointment) => (
          <Row key={appointment.id} appointment={appointment} />
        ))}
      </ul>
    </section>
  ) : null
}

export default function ClientAppointments({ appointments }) {
  const upcoming = appointments.filter(isUpcoming).reverse()
  const past = appointments.filter((appointment) => !isUpcoming(appointment))

  return appointments.length ? (
    <>
      <Group title="Próximos" items={upcoming} />
      <Group title="Anteriores" items={past} />
    </>
  ) : (
    <p className="app-lead">Você ainda não tem horários marcados.</p>
  )
}
