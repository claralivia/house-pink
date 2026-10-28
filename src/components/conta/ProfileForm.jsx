import { useState } from 'react'
import { updateMyClient } from '../../lib/api.js'
import { normalizeWhatsapp } from '../../lib/phone.js'
import AppButton from '../app/AppButton.jsx'
import Field from '../app/Field.jsx'
import Notice from '../app/Notice.jsx'

const localNumber = (whatsapp) => whatsapp.replace(/^55/, '')

export default function ProfileForm({ userId, client }) {
  const [name, setName] = useState(client.name)
  const [whatsapp, setWhatsapp] = useState(localNumber(client.whatsapp))
  const [result, setResult] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    const normalized = normalizeWhatsapp(whatsapp)
    if (!normalized) return setResult('invalid')
    try {
      await updateMyClient(userId, { name: name.trim(), whatsapp: normalized })
      setResult('success')
    } catch {
      setResult('danger')
    }
  }

  return (
    <form onSubmit={submit}>
      <h2 className="app-title">Seus dados</h2>
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
        required
        invalid={result === 'invalid'}
        help={result === 'invalid' ? 'Confira o número: use o DDD e os 9 dígitos.' : undefined}
        value={whatsapp}
        onChange={(event) => setWhatsapp(event.target.value)}
      />
      {result === 'success' ? <Notice tone="success" title="Dados salvos" /> : null}
      {result === 'danger' ? <Notice tone="danger" title="Não foi possível salvar" /> : null}
      <AppButton full type="submit" style={{ marginTop: 16 }}>
        Salvar dados
      </AppButton>
    </form>
  )
}
