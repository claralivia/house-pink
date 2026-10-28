import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AppShell from '../components/app/AppShell.jsx'
import Field from '../components/app/Field.jsx'
import Notice from '../components/app/Notice.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { signIn } from '../lib/api.js'

export default function Entrar() {
  usePageTitle(PAGE_TITLES.entrar)

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSending(true)
    setFailed(false)
    try {
      await signIn(email.trim(), password)
      navigate('/painel')
    } catch {
      setFailed(true)
      setSending(false)
    }
  }

  return (
    <AppShell hideAccount credit>
      <h1 className="app-headline">Entrar na agenda</h1>
      <p className="app-lead">Acesso das profissionais do salão.</p>
      <form onSubmit={submit}>
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {failed ? (
          <Notice tone="danger" title="E-mail ou senha incorretos">
            Confira os dados e tente de novo.
          </Notice>
        ) : null}
        <AppButton full type="submit" disabled={sending} style={{ marginTop: 24 }}>
          {sending ? 'Entrando...' : 'Entrar'}
        </AppButton>
      </form>
      <Link className="app-back" to="/" style={{ marginTop: 8 }}>
        Voltar para a página inicial
      </Link>
    </AppShell>
  )
}
