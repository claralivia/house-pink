import { formatPrice } from '../../lib/money.js'
import Notice from '../app/Notice.jsx'

export default function BookingNotes({ pro }) {
  return pro.booking_notes.length ? (
    <>
      {pro.deposit_cents ? (
        <Notice tone="warning" title={`Sinal de ${formatPrice(pro.deposit_cents)}`}>
          Confirma o horário e é abatido do valor do procedimento.
        </Notice>
      ) : null}
      <details className="app-details">
        <summary>Regras de atendimento da {pro.first}</summary>
        <ul>
          {pro.booking_notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </details>
    </>
  ) : null
}
