import { Link } from 'react-router-dom'
import { lastWorth, split } from '../../lib/clientAppointments.js'
import AppointmentLine from './AppointmentLine.jsx'
import NextAppointment from './NextAppointment.jsx'

export default function ClientHome({ appointments, onCancel }) {
  const { upcoming, past } = split(appointments)
  const [next, ...others] = upcoming
  const last = lastWorth(past)
  const lastType = last?.service_types
  const lastPro = lastType?.services.professionals

  return (
    <>
      {next ? (
        <NextAppointment appointment={next} onCancel={onCancel} />
      ) : (
        <p className="app-lead">Você não tem horários marcados.</p>
      )}

      {lastType ? (
        <Link className="app-btn primary full app-rebook" to={`/agendar?tipo=${lastType.id}`}>
          <span>
            Agendar de novo
            <small>
              {lastType.name} com a {lastPro.name.split(' ')[0]}
            </small>
          </span>
        </Link>
      ) : null}
      <Link className="app-btn secondary full app-spaced" to="/agendar">
        {lastType ? 'Agendar outro serviço' : 'Agendar um horário'}
      </Link>

      {others.length ? (
        <section>
          <h2 className="app-label">Outros horários marcados</h2>
          <ul className="app-group">
            {others.map((appointment) => (
              <AppointmentLine key={appointment.id} appointment={appointment} />
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
