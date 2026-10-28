import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer.jsx'
import Header from '../components/layout/Header.jsx'
import Butterfly from '../components/ui/Butterfly.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Site from '../components/ui/Site.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { sendLoginLink } from '../lib/api.js'

export default function Entrar() {
  usePageTitle(PAGE_TITLES.entrar)

  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    setSending(true)
    setError(null)
    try {
      await sendLoginLink(email.trim())
      setSent(true)
    } catch {
      setError('Não foi possível enviar o link agora. Tente de novo em alguns minutos.')
    } finally {
      setSending(false)
    }
  }

  return (
    <Site>
      <div className="subpage">
        <Header />
        <main className="wrap sec page">
          <SectionHeading kicker="Profissionais" title="Entrar" as="h1" titleClassName="page-title">
            <p className="lead">
              {sent
                ? `Enviamos um link de acesso para ${email}. Abra o e-mail neste aparelho e toque no link.`
                : 'Digite o seu e-mail e enviaremos um link para entrar, sem senha.'}
            </p>
          </SectionHeading>
          {sent ? null : (
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
              {error ? <p className="bk-error">{error}</p> : null}
              <button type="submit" className="btn wide" disabled={sending}>
                {sending ? 'Enviando...' : 'Enviar link de acesso'}
                <Butterfly tone="white" className="bf" />
              </button>
            </form>
          )}
          <Link className="back" to="/">
            Voltar para a página inicial
          </Link>
        </main>
      </div>
      <Footer />
    </Site>
  )
}
