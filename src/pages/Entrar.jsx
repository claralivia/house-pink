import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AuthLayout from '../components/app/AuthLayout.jsx'
import Field from '../components/app/Field.jsx'
import Notice from '../components/app/Notice.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { fetchMyProfessional, signIn } from '../lib/api.js'

const homeFor = (professional) => (professional ? '/painel' : '/conta')

export default function Entrar() {
  usePageTitle(PAGE_TITLES.entrar)

  const navigate = useNavigate()
  const [params] = useSearchParams()
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
      const professional = await fetchMyProfessional()
      navigate(
        !professional && params.get('volta') === 'agendar' ? '/agendar' : homeFor(professional),
      )
    } catch {
      setFailed(true)
      setSending(false)
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      lead="Clientes e profissionais entram por aqui, com o mesmo e-mail e senha."
    >
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
        <p className="auth-form-extra">
          <Link to="/recuperar">Esqueci a senha</Link>
        </p>
      </form>
      <p className="auth-switch">
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        <span className="app-help" style={{ display: 'block' }}>
          Com conta, você acompanha os seus horários e agenda de novo com um toque.
        </span>
      </p>
    </AuthLayout>
  )
}
