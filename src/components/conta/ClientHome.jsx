import { Link } from 'react-router-dom'
import { lastWorth, split } from '../../lib/clientAppointments.js'
import AppButton from '../app/AppButton.jsx'
import AppointmentLine from './AppointmentLine.jsx'
import NextAppointment from './NextAppointment.jsx'
import ProfessionalsFeed from './ProfessionalsFeed.jsx'

export default function ClientHome({ appointments, onCancel, onReview }) {
  const { upcoming, past } = split(appointments)
  const [next, ...others] = upcoming
  const last = lastWorth(past)
  const lastType = last?.service_types
  const lastPro = lastType?.services.professionals
  const toReview = past.find(({ status, feedback }) => status === 'done' && !feedback)

  return (
    <>
      {next ? (
        <NextAppointment appointment={next} onCancel={onCancel} />
      ) : (
        <p className="app-lead">Você não tem horários marcados.</p>
      )}

      {toReview ? (
        <section className="app-ask">
          <h2 className="app-title">Como foi o seu atendimento?</h2>
          <p className="app-help">
            {toReview.service_types.name} com a{' '}
            {toReview.service_types.services.professionals.name.split(' ')[0]}
          </p>
          <AppButton full variant="secondary" onClick={() => onReview(toReview)}>
            Dar a minha opinião
          </AppButton>
        </section>
      ) : null}

      <div className="app-actions app-spaced">
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
        <Link className={`app-btn ${lastType ? 'secondary' : 'primary'} full`} to="/agendar">
          {lastType ? 'Agendar outro serviço' : 'Agendar um horário'}
        </Link>
      </div>

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

      <ProfessionalsFeed />
    </>
  )
}
