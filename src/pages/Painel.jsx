import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AppShell from '../components/app/AppShell.jsx'
import Greeting from '../components/app/Greeting.jsx'
import Notice from '../components/app/Notice.jsx'
import TabBar from '../components/app/TabBar.jsx'
import Earnings from '../components/painel/Earnings.jsx'
import OwnServices from '../components/painel/OwnServices.jsx'
import AgendaList from '../components/painel/AgendaList.jsx'
import Clients from '../components/painel/Clients.jsx'
import More from '../components/painel/More.jsx'
import { PAGE_TITLES, PROS } from '../data/site.js'
import { useAccount } from '../hooks/useAccount.js'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { dateOf, todayIso } from '../lib/dates.js'
import {
  fetchAgenda,
  setAppointmentPayment,
  setAppointmentStatus,
  updateAppointment,
} from '../lib/api.js'

const TABS = [
  { id: 'agenda', label: 'Agenda', icon: 'cal' },
  { id: 'clientes', label: 'Clientes', icon: 'user' },
  { id: 'ganhos', label: 'Ganhos', icon: 'wallet' },
  { id: 'servicos', label: 'Serviços', icon: 'list' },
  { id: 'mais', label: 'Mais', icon: 'more' },
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

  const reloadAgenda = agenda.reload
  useEffect(() => {
    const refresh = () => document.visibilityState === 'visible' && reloadAgenda()
    document.addEventListener('visibilitychange', refresh)
    return () => document.removeEventListener('visibilitychange', refresh)
  }, [reloadAgenda])

  const changeTab = (next) => {
    setTab(next)
    if (next === 'agenda') reloadAgenda()
  }

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

  const deposit = async (id, method) => {
    await updateAppointment(id, {
      deposit_paid_cents: professional.deposit_cents,
      deposit_payment: method,
    })
    agenda.reload()
  }

  const today = todayIso()
  const todayCount = (agenda.data ?? []).filter(
    ({ starts_at, status }) =>
      dateOf(starts_at) === today && (status === 'pending' || status === 'confirmed'),
  ).length
  const todaySummary = todayCount
    ? `Hoje você tem ${todayCount} ${todayCount === 1 ? 'atendimento' : 'atendimentos'}.`
    : 'Hoje você não tem atendimentos marcados.'

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
        onDeposit={deposit}
        onChanged={agenda.reload}
      />
    )
  }

  return (
    <AppShell
      hideAccount
      withBar
      bottom={<TabBar tabs={TABS} current={tab} onChange={changeTab} />}
    >
      {tab === 'agenda' ? (
        <>
          <Greeting person={account.person}>{todaySummary}</Greeting>
          {agendaView()}
        </>
      ) : null}
      {tab === 'ganhos' ? (
        <>
          <h1 className="app-headline">Ganhos</h1>
          {professional ? <Earnings professional={professional} /> : null}
        </>
      ) : null}
      {tab === 'servicos' ? (
        <>
          <h1 className="app-headline">Serviços</h1>
          {professional ? <OwnServices professionalId={professional.id} /> : null}
        </>
      ) : null}
      {tab === 'clientes' ? (
        <>
          <h1 className="app-headline">Clientes</h1>
          {professional ? (
            <Clients professional={professional} onAppointmentSaved={agenda.reload} />
          ) : null}
        </>
      ) : null}
      {tab === 'mais' && professional ? (
        <More
          professional={professional}
          email={account.session?.user.email}
          onSaved={account.reload}
        />
      ) : null}
    </AppShell>
  )
}
