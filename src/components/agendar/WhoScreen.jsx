import { useState } from 'react'
import { clock } from '../../lib/dates.js'
import { normalizeWhatsapp } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import BackButton from '../app/BackButton.jsx'
import BottomBar from '../app/BottomBar.jsx'
import Field from '../app/Field.jsx'
import BookingSummary from './BookingSummary.jsx'

const FORM_ID = 'booking-form'

export default function WhoScreen({ choice, date, minutes, submitting, onBack, onSubmit }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
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
      <p className="app-step">Passo 4 de 4</p>
      <h1 className="app-headline">Seus dados</h1>
      <BookingSummary choice={choice} date={date} minutes={minutes} />
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
              : `A ${choice.pro.first} confirma o seu horário por este WhatsApp.`
          }
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
        />
      </form>
      <BottomBar>
        <AppButton full type="submit" form={FORM_ID} disabled={submitting}>
          {submitting ? 'Reservando...' : `Confirmar horário às ${clock(minutes)}`}
        </AppButton>
      </BottomBar>
    </>
  )
}
