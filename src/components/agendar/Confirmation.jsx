import { clock, shortDate } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import AppButton from '../app/AppButton.jsx'
import BottomBar from '../app/BottomBar.jsx'
import Notice from '../app/Notice.jsx'
import BookingSummary from './BookingSummary.jsx'
import { formatPrice } from '../../lib/money.js'

const confirmationMessage = ({ pro, type, date, minutes }) =>
  `Oi, ${pro.first}! Acabei de agendar ${type.name} para ${shortDate(date)}, às ${clock(minutes)}, pelo site da House Pink.`

export default function Confirmation({ booking, onRestart }) {
  const { pro, date, minutes } = booking

  return (
    <>
      <h1 className="app-headline">Horário reservado</h1>
      <Notice tone="success" title="Reserva recebida">
        {shortDate(date)}, às {clock(minutes)}.
      </Notice>
      <BookingSummary choice={booking} date={date} minutes={minutes} />
      {pro.deposit_cents ? (
        <Notice tone="warning" title={`Sinal de ${formatPrice(pro.deposit_cents)}`}>
          A {pro.first} confirma o horário mediante sinal, que é abatido do valor do procedimento.
          Combine o pagamento com ela pelo WhatsApp.
        </Notice>
      ) : null}
      <p className="app-lead">
        Para fechar, avise a {pro.first} pelo WhatsApp. Ela confirma o seu horário por lá.
      </p>
      <BottomBar>
        <AppButton full href={whatsappUrl(pro, confirmationMessage(booking))}>
          Avisar a {pro.first} no WhatsApp
        </AppButton>
        <AppButton variant="ghost" full onClick={onRestart} style={{ marginTop: 8 }}>
          Fazer outro agendamento
        </AppButton>
      </BottomBar>
    </>
  )
}
