import { PROS } from '../../data/site.js'
import { STATUS_LABEL } from '../../lib/clientAppointments.js'
import { dateOf, longDate, timeOf } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import AppButton from '../app/AppButton.jsx'
import CancelButton from './CancelButton.jsx'

const message = (pro, appointment) =>
  `Oi, ${pro.first}! Sobre o meu horário de ${longDate(dateOf(appointment.starts_at))}, às ${timeOf(appointment.starts_at)}.`

export default function NextAppointment({ appointment, onCancel }) {
  const { starts_at, status, service_types: type } = appointment
  const professional = type.services.professionals
  const pro = PROS[professional.key]
  const rules = professional.booking_notes ?? []

  return (
    <section className="app-next">
      <p className="app-step">Seu próximo horário</p>
      <h2 className="app-next-date">{longDate(dateOf(starts_at))}</h2>
      <p className="app-next-time">{timeOf(starts_at)}</p>
      <p className="app-next-what">
        {type.services.name}, {type.name} · com a{' '}
        <span className={`app-who ${pro.key}`}>{pro.first}</span>
      </p>
      <p className="app-help">{STATUS_LABEL[status]}</p>

      <div className="app-row-actions">
        <AppButton variant="secondary" href={whatsappUrl(pro, message(pro, appointment))}>
          Falar com a {pro.first}
        </AppButton>
        <CancelButton onCancel={() => onCancel(appointment.id)} />
      </div>

      {rules.length ? (
        <details className="app-more">
          <summary>Regras de atendimento</summary>
          <ul className="app-rules">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  )
}
