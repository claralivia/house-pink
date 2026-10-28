import { clock, longDate } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import Button from '../ui/Button.jsx'

const confirmationMessage = ({ pro, type, date, minutes }) =>
  `Oi, ${pro.first}! Acabei de agendar ${type.name} para ${longDate(date)}, às ${clock(minutes)}, pelo site da House Pink.`

export default function Confirmation({ booking, onRestart }) {
  const { pro, service, type, date, minutes } = booking

  return (
    <div className="bk-done">
      <h2 className="page-title">Horário reservado</h2>
      <p className="lead">
        {service.name}, {type.name}, com a {pro.first}, para {longDate(date)}, às {clock(minutes)}.
      </p>
      <p className="lead sm">
        Para fechar, avise a {pro.first} pelo WhatsApp. Ela confirma o seu horário por lá.
      </p>
      <div className="wa-actions">
        <Button href={whatsappUrl(pro, confirmationMessage(booking))} external tone="white">
          Avisar a {pro.first}
        </Button>
        <button type="button" className="btn outline wide" onClick={onRestart}>
          Fazer outro agendamento
        </button>
      </div>
    </div>
  )
}
