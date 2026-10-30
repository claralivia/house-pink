import { proNames } from '../../lib/booking.js'
import { clock, shortDate } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import { formatPrice } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import BottomBar from '../app/BottomBar.jsx'
import Notice from '../app/Notice.jsx'
import BookingSummary from './BookingSummary.jsx'

const confirmationMessage = ({ choice, date, minutes }) =>
  `Oi, ${choice.pro.first}! Acabei de agendar ${choice.type.name} para ${shortDate(date)}, às ${clock(minutes)}, pelo site da House Pink.`

export default function Confirmation({ booking, onRestart }) {
  const { items, joint } = booking
  const several = items.length > 1
  const names = proNames(items.map(({ choice }) => choice))

  let headline = `${shortDate(items[0].date)}, às ${clock(items[0].minutes)}.`
  if (joint)
    headline = `${shortDate(items[0].date)}, às ${clock(items[0].minutes)}, com as duas ao mesmo tempo.`
  else if (several) headline = 'Os dois horários foram reservados.'

  return (
    <>
      <h1 className="app-headline">{several ? 'Horários reservados' : 'Horário reservado'}</h1>
      <Notice tone="success" title="Reserva recebida">
        {headline}
      </Notice>
      <BookingSummary items={items} joint={joint} />
      {items
        .filter(({ choice }) => choice.pro.deposit_cents)
        .map(({ choice }) => (
          <Notice
            key={choice.pro.id}
            tone="warning"
            title={`Sinal de ${formatPrice(choice.pro.deposit_cents)} da ${choice.pro.first}`}
          >
            A {choice.pro.first} confirma o horário mediante sinal, que é abatido do valor do
            procedimento. Combine o pagamento com ela pelo WhatsApp.
          </Notice>
        ))}
      <p className="app-lead">
        Para fechar, avise a {names} pelo WhatsApp.{' '}
        {several ? 'Cada uma confirma o seu horário por lá.' : 'Ela confirma o seu horário por lá.'}
      </p>
      <BottomBar>
        {items.map((item, index) => (
          <AppButton
            key={item.choice.pro.id}
            full
            variant={index ? 'secondary' : 'primary'}
            href={whatsappUrl(item.choice.pro, confirmationMessage(item))}
            style={{ marginBottom: 8 }}
          >
            Avisar a {item.choice.pro.first} no WhatsApp
          </AppButton>
        ))}
        <AppButton variant="ghost" full onClick={onRestart}>
          Fazer outro agendamento
        </AppButton>
      </BottomBar>
    </>
  )
}
