import { useState } from 'react'
import { useTeam } from '../../hooks/useTeam.js'
import { dateOf, longDate, timeOf } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import AppButton from '../app/AppButton.jsx'
import Avatar from '../app/Avatar.jsx'

const message = (pro, appointment) =>
  `Oi, ${pro.first}! Sobre o meu horário de ${longDate(dateOf(appointment.starts_at))}, às ${timeOf(appointment.starts_at)}.`

export default function NextAppointment({ appointment, onCancel }) {
  const [view, setView] = useState('main')
  const { starts_at, status, service_types: type } = appointment
  const professional = type.services.professionals
  const team = useTeam()
  const pro = team[professional.key] ?? {
    name: professional.name,
    first: professional.name.split(' ')[0],
  }
  const rules = professional.booking_notes ?? []
  const confirmed = status === 'confirmed'

  return (
    <section className="app-next">
      <p className="app-step">Seu próximo horário</p>
      <h2 className="app-next-date">{longDate(dateOf(starts_at))}</h2>
      <p className="app-next-time">{timeOf(starts_at)}</p>

      <div className="app-next-who">
        <Avatar src={pro.photo} name={pro.name} size="lg" className="pro" />
        <p>
          <strong>
            {type.services.name}, {type.name}
          </strong>
          <span>com a {pro.first}</span>
        </p>
      </div>

      <p className={`app-next-status ${confirmed ? 'ok' : 'wait'}`}>
        {confirmed
          ? `Horário confirmado pela ${pro.first}`
          : `Aguardando a ${pro.first} confirmar. Fale com ela pelo WhatsApp.`}
      </p>

      {view === 'main' ? (
        <div className="app-actions">
          {pro.whatsapp ? (
            <AppButton full href={whatsappUrl(pro, message(pro, appointment))}>
              Falar com a {pro.first} no WhatsApp
            </AppButton>
          ) : null}
          {rules.length ? (
            <AppButton variant="secondary" full onClick={() => setView('rules')}>
              Ver regras de atendimento
            </AppButton>
          ) : null}
          <AppButton variant="danger" full onClick={() => setView('cancel')}>
            Cancelar este horário
          </AppButton>
        </div>
      ) : null}

      {view === 'rules' ? (
        <div className="app-actions">
          <p className="app-modal-question">Regras de atendimento</p>
          <ul className="app-rules">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <AppButton variant="secondary" full onClick={() => setView('main')}>
            Voltar
          </AppButton>
        </div>
      ) : null}

      {view === 'cancel' ? (
        <div className="app-actions">
          <p className="app-modal-question">Tem certeza que quer cancelar?</p>
          <AppButton variant="danger" full onClick={() => onCancel(appointment.id)}>
            Sim, cancelar
          </AppButton>
          <AppButton variant="secondary" full onClick={() => setView('main')}>
            Não, manter o horário
          </AppButton>
        </div>
      ) : null}
    </section>
  )
}
