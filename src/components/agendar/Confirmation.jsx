import { proNames } from '../../lib/booking.js'
import { clock, shortDate } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import { formatPrice } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import BottomBar from '../app/BottomBar.jsx'
import Notice from '../app/Notice.jsx'
import BookingSummary from './BookingSummary.jsx'

const confirmationMessage = ({ pro, type }, date, minutes) =>
  `Oi, ${pro.first}! Acabei de agendar ${type.name} para ${shortDate(date)}, às ${clock(minutes)}, pelo site da House Pink.`

export default function Confirmation({ booking, onRestart }) {
  const { choices, date, minutes } = booking
  const joint = choices.length > 1

  return (
    <>
      <h1 className="app-headline">Horário reservado</h1>
      <Notice tone="success" title="Reserva recebida">
        {shortDate(date)}, às {clock(minutes)}
        {joint ? ', com as duas ao mesmo tempo.' : '.'}
      </Notice>
      <BookingSummary choices={choices} date={date} minutes={minutes} />
      {choices
        .filter(({ pro }) => pro.deposit_cents)
        .map(({ pro }) => (
          <Notice
            key={pro.id}
            tone="warning"
            title={`Sinal de ${formatPrice(pro.deposit_cents)} da ${pro.first}`}
          >
            A {pro.first} confirma o horário mediante sinal, que é abatido do valor do procedimento.
            Combine o pagamento com ela pelo WhatsApp.
          </Notice>
        ))}
      <p className="app-lead">
        Para fechar, avise a {proNames(choices)} pelo WhatsApp.{' '}
        {joint ? 'Cada uma confirma o seu horário por lá.' : 'Ela confirma o seu horário por lá.'}
      </p>
      <BottomBar>
        {choices.map((choice, index) => (
          <AppButton
            key={choice.pro.id}
            full
            variant={index ? 'secondary' : 'primary'}
            href={whatsappUrl(choice.pro, confirmationMessage(choice, date, minutes))}
            style={{ marginBottom: 8 }}
          >
            Avisar a {choice.pro.first} no WhatsApp
          </AppButton>
        ))}
        <AppButton variant="ghost" full onClick={onRestart}>
          Fazer outro agendamento
        </AppButton>
      </BottomBar>
    </>
  )
}
