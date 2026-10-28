import { useCallback, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AppShell from '../components/app/AppShell.jsx'
import Notice from '../components/app/Notice.jsx'
import TabBar from '../components/app/TabBar.jsx'
import AgendaList from '../components/painel/AgendaList.jsx'
import PasswordForm from '../components/painel/PasswordForm.jsx'
import { PAGE_TITLES, PROS } from '../data/site.js'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useSession } from '../hooks/useSession.js'
import { fetchAgenda, fetchMyProfessional, setAppointmentStatus, signOut } from '../lib/api.js'

const TABS = [
  { id: 'agenda', label: 'Agenda', icon: 'cal' },
  { id: 'conta', label: 'Conta', icon: 'user' },
]

export default function Painel() {
  usePageTitle(PAGE_TITLES.painel)

  const { loading, session } = useSession()
  const [tab, setTab] = useState('agenda')
  const profile = useAsync(fetchMyProfessional, session?.user.id)
  const professional = profile.data && { ...PROS[profile.data.key], ...profile.data }
  const loadAgenda = useCallback(() => fetchAgenda(profile.data.id), [profile.data])
  const agenda = useAsync(loadAgenda, profile.data?.id)

  const changeStatus = async (id, status) => {
    await setAppointmentStatus(id, status)
    agenda.reload()
  }

  const agendaView = () => {
    if (profile.loading || agenda.loading) return <p className="app-lead">Carregando...</p>
    if (profile.error || agenda.error)
      return (
        <Notice tone="danger" title="Não foi possível carregar a agenda">
          Atualize a página.
        </Notice>
      )
    if (!professional)
      return (
        <Notice tone="warning" title="E-mail sem acesso">
          {session.user.email} não está cadastrado como profissional do salão.
        </Notice>
      )
    return (
      <AgendaList appointments={agenda.data ?? []} pro={professional} onStatus={changeStatus} />
    )
  }

  return loading || session ? (
    <AppShell withBar bottom={<TabBar tabs={TABS} current={tab} onChange={setTab} />}>
      {tab === 'agenda' ? (
        <>
          <h1 className="app-headline">Agenda</h1>
          {professional ? (
            <p className="app-lead">
              <span className={`app-who ${professional.key}`}>{professional.first}</span> · próximos
              horários
            </p>
          ) : null}
          {loading ? null : agendaView()}
        </>
      ) : (
        <>
          <h1 className="app-headline">Conta</h1>
          {session ? <p className="app-lead">{session.user.email}</p> : null}
          <PasswordForm />
          <AppButton variant="secondary" full onClick={signOut} style={{ marginTop: 24 }}>
            Sair
          </AppButton>
        </>
      )}
    </AppShell>
  ) : (
    <Navigate to="/entrar" replace />
  )
}
