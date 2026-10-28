import { useCallback, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AppShell from '../components/app/AppShell.jsx'
import Notice from '../components/app/Notice.jsx'
import TabBar from '../components/app/TabBar.jsx'
import ClientAppointments from '../components/conta/ClientAppointments.jsx'
import ProfileForm from '../components/conta/ProfileForm.jsx'
import PasswordForm from '../components/painel/PasswordForm.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { useAccount } from '../hooks/useAccount.js'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { fetchMyAppointments, fetchMyClient, signOut } from '../lib/api.js'

const TABS = [
  { id: 'horarios', label: 'Horários', icon: 'cal' },
  { id: 'perfil', label: 'Perfil', icon: 'user' },
]

export default function Conta() {
  usePageTitle(PAGE_TITLES.conta)

  const account = useAccount()
  const [tab, setTab] = useState('horarios')
  const userId = account.session?.user.id
  const clientKey = account.role === 'client' ? userId : null
  const loadClient = useCallback(() => fetchMyClient(userId), [userId])
  const client = useAsync(loadClient, clientKey)
  const appointments = useAsync(fetchMyAppointments, clientKey)

  if (!account.loading && !account.session) return <Navigate to="/entrar" replace />
  if (account.role === 'pro') return <Navigate to="/painel" replace />

  const failed = client.error || appointments.error
  const loading = account.loading || client.loading || appointments.loading

  return (
    <AppShell hideAccount withBar bottom={<TabBar tabs={TABS} current={tab} onChange={setTab} />}>
      <h1 className="app-headline">{tab === 'horarios' ? 'Meus horários' : 'Perfil'}</h1>
      {client.data?.name ? <p className="app-lead">{client.data.name}</p> : null}
      {loading ? <p className="app-lead">Carregando...</p> : null}
      {failed ? (
        <Notice tone="danger" title="Não foi possível carregar a sua conta">
          Atualize a página.
        </Notice>
      ) : null}
      {tab === 'horarios' && appointments.data ? (
        <>
          <Link className="app-btn primary full" to="/agendar" style={{ marginTop: 16 }}>
            Agendar novo horário
          </Link>
          <ClientAppointments appointments={appointments.data} />
        </>
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
