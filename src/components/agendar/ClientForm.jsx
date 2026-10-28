import { useState } from 'react'
import { normalizeWhatsapp } from '../../lib/phone.js'
import Butterfly from '../ui/Butterfly.jsx'

export default function ClientForm({ submitting, onSubmit }) {
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
    <form className="bk-form" onSubmit={handleSubmit}>
      <label className="bk-field">
        <span>Seu nome</span>
        <input
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="bk-field">
        <span>Seu WhatsApp, com DDD</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(85) 99999-9999"
          required
          aria-invalid={invalid}
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
        />
      </label>
      {invalid ? <p className="bk-error">Confira o número: use o DDD e os 9 dígitos.</p> : null}
      <button type="submit" className="btn wide" disabled={submitting}>
        {submitting ? 'Reservando...' : 'Confirmar agendamento'}
        <Butterfly tone="white" className="bf" />
      </button>
    </form>
  )
}
