import { useState } from 'react'
import { updateAppointment } from '../../lib/api.js'
import { dateOf, shortDate, timeOf, timestamp, toMinutes } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import { toCents, toReais } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import Field from '../app/Field.jsx'
import Notice from '../app/Notice.jsx'
import Select from '../app/Select.jsx'

const CONFLICT_CODE = '23P01'
const METHOD_OPTIONS = [
  { value: '', text: 'Sem sinal pago' },
  { value: 'pix', text: 'Sinal pago no Pix' },
  { value: 'card', text: 'Sinal pago no cartão' },
  { value: 'cash', text: 'Sinal pago em dinheiro' },
]

const durationOf = ({ starts_at, ends_at }) => (new Date(ends_at) - new Date(starts_at)) / 60000

const moved = ({ clients }, date, time) =>
  `Oi, ${clients.name}! Seu horário na House Pink foi alterado para ${shortDate(date)}, às ${time}. Está tudo bem para você?`

export default function EditAppointment({ appointment, pro, onSaved, onClose }) {
  const [date, setDate] = useState(dateOf(appointment.starts_at))
  const [time, setTime] = useState(timeOf(appointment.starts_at))
  const [duration, setDuration] = useState(String(durationOf(appointment)))
  const [price, setPrice] = useState(toReais(appointment.price_cents ?? 0))
  const [deposit, setDeposit] = useState(toReais(appointment.deposit_paid_cents))
  const [depositMethod, setDepositMethod] = useState(appointment.deposit_payment ?? '')
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const minutes = toMinutes(time)
    const length = Number(duration)
    const priceCents = toCents(price)
    const depositCents = depositMethod ? toCents(deposit) : 0
    if (priceCents === null || depositCents === null || !(length > 0)) {
      return setError('Confira os valores digitados.')
    }
    try {
      await updateAppointment(appointment.id, {
        starts_at: timestamp(date, minutes),
        ends_at: timestamp(date, minutes + length),
        price_cents: priceCents,
        deposit_paid_cents: depositCents,
        deposit_payment: depositMethod || null,
      })
      setError(null)
      setSaved(true)
      onSaved()
    } catch (failure) {
      setError(
        failure.code === CONFLICT_CODE
          ? 'Você já tem um horário nesse período. Escolha outro horário.'
          : 'Não foi possível salvar. Tente de novo.',
      )
    }
  }

  return (
    <form className="app-edit" onSubmit={submit}>
      <h3 className="app-title">Editar horário</h3>
      <Field
        label="Data"
        type="date"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Field
        label="Hora"
        type="time"
        step="300"
        required
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <Field
        label="Duração, em minutos"
        type="number"
        inputMode="numeric"
        min="5"
        step="5"
        required
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <Field
        label="Valor, em reais"
        inputMode="decimal"
        required
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Select
        label="Sinal"
        options={METHOD_OPTIONS}
        value={depositMethod}
        onChange={(e) => setDepositMethod(e.target.value)}
      />
      {depositMethod ? (
        <Field
          label="Valor do sinal, em reais"
          inputMode="decimal"
          help={pro.deposit_cents ? `Sinal padrão: ${toReais(pro.deposit_cents)}` : undefined}
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />
      ) : null}
      {error ? <Notice tone="danger" title={error} /> : null}
      {saved ? (
        <Notice tone="success" title="Horário atualizado">
          <AppButton
            variant="secondary"
            href={whatsappUrl(appointment.clients, moved(appointment, date, time))}
            style={{ marginTop: 8 }}
          >
            Avisar a cliente no WhatsApp
          </AppButton>
        </Notice>
      ) : null}
      <div className="app-row-actions">
        <AppButton type="submit">Salvar</AppButton>
        <AppButton variant="ghost" onClick={onClose}>
          Fechar
        </AppButton>
      </div>
    </form>
  )
}
