import { useState } from 'react'
import { proNames } from '../../lib/booking.js'
import { clock } from '../../lib/dates.js'
import { normalizeWhatsapp } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import BackButton from '../app/BackButton.jsx'
import BottomBar from '../app/BottomBar.jsx'
import Field from '../app/Field.jsx'
import BookingNotes from './BookingNotes.jsx'
import BookingSummary from './BookingSummary.jsx'

const FORM_ID = 'booking-form'

const confirmLabel = (items) =>
  items.every((item) => item.minutes === items[0].minutes && item.date === items[0].date)
    ? `Confirmar horário às ${clock(items[0].minutes)}`
    : 'Confirmar os dois horários'

export default function WhoScreen({ items, joint, step, submitting, initial, onBack, onSubmit }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp.replace(/^55/, '') ?? '')
  const [invalid, setInvalid] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalized = normalizeWhatsapp(whatsapp)
    setInvalid(!normalized)
    normalized && onSubmit({ name: name.trim(), whatsapp: normalized })
  }

  return (
    <>
      <BackButton onClick={onBack}>Data e horário</BackButton>
      <p className="app-step">{step}</p>
      <h1 className="app-headline">Seus dados</h1>
      <BookingSummary items={items} joint={joint} />
      {items.map(({ choice }) => (
        <BookingNotes key={choice.pro.id} pro={choice.pro} />
      ))}
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <Field
          label="Nome completo"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Field
          label="WhatsApp"
          prefix="+55"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(85) 99999-9999"
          required
          invalid={invalid}
          help={
            invalid
              ? 'Confira o número: use o DDD e os 9 dígitos.'
              : `${items.length > 1 ? 'Cada uma' : `A ${proNames(items.map(({ choice }) => choice))}`} confirma o seu horário por este WhatsApp.`
          }
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
        />
      </form>
      <BottomBar>
        <AppButton full type="submit" form={FORM_ID} disabled={submitting}>
          {submitting ? 'Reservando...' : confirmLabel(items)}
        </AppButton>
      </BottomBar>
    </>
  )
}
