import { useCallback, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppButton from '../components/app/AppButton.jsx'
import AppShell from '../components/app/AppShell.jsx'
import Notice from '../components/app/Notice.jsx'
import TabBar from '../components/app/TabBar.jsx'
import Earnings from '../components/painel/Earnings.jsx'
import OwnServices from '../components/painel/OwnServices.jsx'
import AgendaList from '../components/painel/AgendaList.jsx'
import PasswordForm from '../components/painel/PasswordForm.jsx'
import { PAGE_TITLES, PROS } from '../data/site.js'
import { useAccount } from '../hooks/useAccount.js'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { fetchAgenda, setAppointmentPayment, setAppointmentStatus, signOut } from '../lib/api.js'

const TABS = [
  { id: 'agenda', label: 'Agenda', icon: 'cal' },
  { id: 'ganhos', label: 'Ganhos', icon: 'wallet' },
  { id: 'servicos', label: 'Serviços', icon: 'list' },
  { id: 'conta', label: 'Conta', icon: 'user' },
]

export default function Painel() {
  usePageTitle(PAGE_TITLES.painel)

  const account = useAccount()
  const [tab, setTab] = useState('agenda')
  const professional = useMemo(
    () => account.professional && { ...PROS[account.professional.key], ...account.professional },
    [account.professional],
  )
  const loadAgenda = useCallback(() => fetchAgenda(professional.id), [professional])
  const agenda = useAsync(loadAgenda, professional?.id)

  if (!account.loading && !account.session) return <Navigate to="/entrar" replace />
  if (account.role === 'client') return <Navigate to="/conta" replace />

  const changeStatus = async (id, status) => {
    await setAppointmentStatus(id, status)
    agenda.reload()
  }

  const pay = async (id, method) => {
    await setAppointmentPayment(id, method)
    agenda.reload()
  }

  const agendaView = () => {
    if (account.loading || agenda.loading) return <p className="app-lead">Carregando...</p>
    if (agenda.error)
      return (
        <Notice tone="danger" title="Não foi possível carregar a agenda">
          Atualize a página.
        </Notice>
      )
    return (
      <AgendaList
        appointments={agenda.data ?? []}
        pro={professional}
        onStatus={changeStatus}
        onPay={pay}
      />
    )
  }

  return (
    <AppShell hideAccount withBar bottom={<TabBar tabs={TABS} current={tab} onChange={setTab} />}>
      {tab === 'agenda' ? (
        <>
          <h1 className="app-headline">Agenda</h1>
          {professional ? (
            <p className="app-lead">
              <span className={`app-who ${professional.key}`}>{professional.first}</span> · próximos
              horários
            </p>
          ) : null}
          {agendaView()}
        </>
      ) : null}
      {tab === 'ganhos' ? (
        <>
          <h1 className="app-headline">Ganhos</h1>
          {professional ? <Earnings professionalId={professional.id} /> : null}
        </>
      ) : null}
      {tab === 'servicos' ? (
        <>
          <h1 className="app-headline">Serviços</h1>
          {professional ? <OwnServices professionalId={professional.id} /> : null}
        </>
      ) : null}
      {tab === 'conta' ? (
        <>
          <h1 className="app-headline">Conta</h1>
          {account.session ? <p className="app-lead">{account.session.user.email}</p> : null}
          <PasswordForm />
          <AppButton variant="secondary" full onClick={signOut} style={{ marginTop: 24 }}>
            Sair
          </AppButton>
        </>
      ) : null}
    </AppShell>
  )
}
