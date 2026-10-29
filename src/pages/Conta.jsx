import { useCallback, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AppShell from '../components/app/AppShell.jsx'
import Notice from '../components/app/Notice.jsx'
import TabBar from '../components/app/TabBar.jsx'
import ClientHistory from '../components/conta/ClientHistory.jsx'
import ClientHome from '../components/conta/ClientHome.jsx'
import ProfileForm from '../components/conta/ProfileForm.jsx'
import PasswordForm from '../components/painel/PasswordForm.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { useAccount } from '../hooks/useAccount.js'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { cancelMyAppointment, fetchMyAppointments, fetchMyClient, signOut } from '../lib/api.js'

const TABS = [
  { id: 'inicio', label: 'Início', icon: 'cal' },
  { id: 'historico', label: 'Histórico', icon: 'list' },
  { id: 'perfil', label: 'Perfil', icon: 'user' },
]

const firstName = (name) => name?.trim().split(' ')[0]

export default function Conta() {
  usePageTitle(PAGE_TITLES.conta)

  const account = useAccount()
  const [tab, setTab] = useState('inicio')
  const [cancelFailed, setCancelFailed] = useState(false)
  const userId = account.session?.user.id
  const clientKey = account.role === 'client' ? userId : null
  const loadClient = useCallback(() => fetchMyClient(userId), [userId])
  const client = useAsync(loadClient, clientKey)
  const appointments = useAsync(fetchMyAppointments, clientKey)

  if (!account.loading && !account.session) return <Navigate to="/entrar" replace />
  if (account.role === 'pro') return <Navigate to="/painel" replace />

  const cancel = async (id) => {
    setCancelFailed(false)
    try {
      await cancelMyAppointment(id)
      appointments.reload()
    } catch {
      setCancelFailed(true)
    }
  }

  const failed = client.error || appointments.error
  const loading = account.loading || client.loading || appointments.loading
  const titles = {
    inicio: firstName(client.data?.name) ? `Olá, ${firstName(client.data.name)}` : 'Olá',
    historico: 'Histórico',
    perfil: 'Perfil',
  }

  return (
    <AppShell hideAccount withBar bottom={<TabBar tabs={TABS} current={tab} onChange={setTab} />}>
      <h1 className="app-headline">{titles[tab]}</h1>
      {loading ? <p className="app-lead">Carregando...</p> : null}
      {failed ? (
        <Notice tone="danger" title="Não foi possível carregar a sua conta">
          Atualize a página.
        </Notice>
      ) : null}
      {cancelFailed ? (
        <Notice tone="danger" title="Não foi possível cancelar">
          O horário já passou ou já foi cancelado. Se precisar, chame a profissional no WhatsApp.
        </Notice>
      ) : null}
      {tab === 'inicio' && appointments.data ? (
        <ClientHome appointments={appointments.data} onCancel={cancel} />
      ) : null}
      {tab === 'historico' && appointments.data ? (
        <ClientHistory appointments={appointments.data} />
      ) : null}
      {tab === 'perfil' && client.data ? (
        <>
          <ProfileForm userId={userId} client={client.data} />
          <PasswordForm />
          <AppButton variant="secondary" full onClick={signOut} style={{ marginTop: 24 }}>
            Sair
          </AppButton>
        </>
      ) : null}
    </AppShell>
  )
}
