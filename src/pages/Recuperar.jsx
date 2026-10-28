import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AppShell from '../components/app/AppShell.jsx'
import Field from '../components/app/Field.jsx'
import Notice from '../components/app/Notice.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sendPasswordReset } from '../lib/api.js'

export default function Recuperar() {
  usePageTitle(PAGE_TITLES.recuperar)

  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    setSending(true)
    try {
      await sendPasswordReset(email.trim())
      setResult('success')
    } catch {
      setResult('danger')
    } finally {
      setSending(false)
    }
  }

  return (
    <AppShell hideAccount credit>
      <h1 className="app-headline">Esqueci a senha</h1>
      <p className="app-lead">Digite o seu e-mail e enviamos um link para criar uma senha nova.</p>
      <form onSubmit={submit}>
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {result === 'success' ? (
          <Notice tone="success" title="Confira o seu e-mail">
            Se houver uma conta com {email}, o link chega em alguns minutos. Olhe também o spam.
          </Notice>
        ) : null}
        {result === 'danger' ? (
          <Notice tone="danger" title="Não foi possível enviar o link">
            Tente de novo em alguns minutos.
          </Notice>
        ) : null}
        <AppButton full type="submit" disabled={sending} style={{ marginTop: 24 }}>
          {sending ? 'Enviando...' : 'Enviar link'}
        </AppButton>
      </form>
      <Link className="app-back" to="/entrar" style={{ marginTop: 8 }}>
        Voltar para entrar
      </Link>
    </AppShell>
  )
}
