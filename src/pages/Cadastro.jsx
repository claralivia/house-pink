import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AuthLayout from '../components/app/AuthLayout.jsx'
import Field from '../components/app/Field.jsx'
import Notice from '../components/app/Notice.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { signUp } from '../lib/api.js'
import { normalizeWhatsapp } from '../lib/phone.js'

const MIN_LENGTH = 8

export default function Cadastro() {
  usePageTitle(PAGE_TITLES.cadastro)

  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '', password: '' })
  const [sending, setSending] = useState(false)
  const [invalidPhone, setInvalidPhone] = useState(false)
  const [error, setError] = useState(false)
  const [pendingEmail, setPendingEmail] = useState(null)

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    const whatsapp = normalizeWhatsapp(form.whatsapp)
    setInvalidPhone(!whatsapp)
    if (!whatsapp) return
    setSending(true)
    setError(false)
    try {
      const { session } = await signUp({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        whatsapp,
      })
      session ? navigate('/conta') : setPendingEmail(form.email.trim())
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      lead="Para acompanhar os seus horários e agendar de novo com um toque. Agendar continua sem precisar de conta."
    >
      {pendingEmail ? (
        <Notice tone="success" title="Confirme o seu e-mail">
          Enviamos um link para {pendingEmail}. Abra o e-mail e toque no link para ativar a conta.
        </Notice>
      ) : (
        <form onSubmit={submit}>
          <Field
            label="Nome completo"
            autoComplete="name"
            required
            value={form.name}
            onChange={update('name')}
          />
          <Field
            label="WhatsApp"
            prefix="+55"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(85) 99999-9999"
            required
            invalid={invalidPhone}
            help={invalidPhone ? 'Confira o número: use o DDD e os 9 dígitos.' : undefined}
            value={form.whatsapp}
            onChange={update('whatsapp')}
          />
          <Field
            label="E-mail"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={update('email')}
          />
          <Field
            label="Senha"
            type="password"
            autoComplete="new-password"
            minLength={MIN_LENGTH}
            required
            help={`Use pelo menos ${MIN_LENGTH} caracteres.`}
            value={form.password}
            onChange={update('password')}
          />
          {error ? (
            <Notice tone="danger" title="Não foi possível criar a conta">
              Confira os dados. Se você já tem conta, entre com o seu e-mail.
            </Notice>
          ) : null}
          <AppButton full type="submit" disabled={sending} style={{ marginTop: 24 }}>
            {sending ? 'Criando...' : 'Criar conta'}
          </AppButton>
        </form>
      )}
      <p className="auth-switch">
        Já tem conta? <Link to="/entrar">Entrar</Link>
      </p>
    </AuthLayout>
  )
}
