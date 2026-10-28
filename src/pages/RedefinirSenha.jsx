import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AppShell from '../components/app/AppShell.jsx'
import Field from '../components/app/Field.jsx'
import Notice from '../components/app/Notice.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { useSession } from '../hooks/useSession.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { changePassword, fetchMyProfessional } from '../lib/api.js'

const MIN_LENGTH = 8

const homeFor = (professional) => (professional ? '/painel' : '/conta')

export default function RedefinirSenha() {
  usePageTitle(PAGE_TITLES.redefinir)

  const navigate = useNavigate()
  const { loading, session } = useSession()
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setFailed(false)
    try {
      await changePassword(password)
      navigate(homeFor(await fetchMyProfessional()))
    } catch {
      setFailed(true)
      setSaving(false)
    }
  }

  return (
    <AppShell hideAccount credit>
      <h1 className="app-headline">Senha nova</h1>
      {loading ? <p className="app-lead">Carregando...</p> : null}
      {!loading && !session ? (
        <>
          <Notice tone="warning" title="Link inválido ou vencido">
            Peça um link novo para criar a sua senha.
          </Notice>
          <Link className="app-btn secondary full" to="/recuperar" style={{ marginTop: 16 }}>
            Pedir novo link
          </Link>
        </>
      ) : null}
      {session ? (
        <form onSubmit={submit}>
          <Field
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            minLength={MIN_LENGTH}
            required
            help={`Use pelo menos ${MIN_LENGTH} caracteres.`}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {failed ? (
            <Notice tone="danger" title="Não foi possível salvar a senha">
              Tente outra senha.
            </Notice>
          ) : null}
          <AppButton full type="submit" disabled={saving} style={{ marginTop: 24 }}>
            {saving ? 'Salvando...' : 'Salvar senha'}
          </AppButton>
        </form>
      ) : null}
    </AppShell>
  )
}
