import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer.jsx'
import Header from '../components/layout/Header.jsx'
import Butterfly from '../components/ui/Butterfly.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Site from '../components/ui/Site.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { signIn } from '../lib/api.js'

export default function Entrar() {
  usePageTitle(PAGE_TITLES.entrar)

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    setSending(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      navigate('/painel')
    } catch {
      setError('E-mail ou senha incorretos.')
      setSending(false)
    }
  }

  return (
    <Site>
      <div className="subpage">
        <Header />
        <main className="wrap sec page">
          <SectionHeading kicker="Profissionais" title="Entrar" as="h1" titleClassName="page-title">
            <p className="lead">Acesse a sua agenda com o e-mail e a senha cadastrados.</p>
          </SectionHeading>
          <form className="bk-form" onSubmit={submit}>
            <label className="bk-field">
              <span>Seu e-mail</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="bk-field">
              <span>Sua senha</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error ? <p className="bk-error">{error}</p> : null}
            <button type="submit" className="btn wide" disabled={sending}>
              {sending ? 'Entrando...' : 'Entrar'}
              <Butterfly tone="white" className="bf" />
            </button>
          </form>
          <Link className="back" to="/">
            Voltar para a página inicial
          </Link>
        </main>
      </div>
      <Footer />
    </Site>
  )
}
