import { useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import AgendaList from '../components/painel/AgendaList.jsx'
import PasswordForm from '../components/painel/PasswordForm.jsx'
import Footer from '../components/layout/Footer.jsx'
import Header from '../components/layout/Header.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Site from '../components/ui/Site.jsx'
import { PAGE_TITLES } from '../data/site.js'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useSession } from '../hooks/useSession.js'
import { fetchAgenda, fetchMyProfessional, setAppointmentStatus, signOut } from '../lib/api.js'

export default function Painel() {
  usePageTitle(PAGE_TITLES.painel)

  const { loading, session } = useSession()
  const profile = useAsync(fetchMyProfessional, session?.user.id)
  const professional = profile.data
  const loadAgenda = useCallback(() => fetchAgenda(professional.id), [professional])
  const agenda = useAsync(loadAgenda, professional?.id)

  const changeStatus = async (id, status) => {
    await setAppointmentStatus(id, status)
    agenda.reload()
  }

  const content = () => {
    if (profile.loading || agenda.loading) return <p className="bk-note">Carregando...</p>
    if (profile.error || agenda.error)
      return <p className="bk-error">Não foi possível carregar a agenda. Atualize a página.</p>
    if (!professional)
      return (
        <p className="lead">
          O e-mail {session.user.email} não está cadastrado como profissional do salão.
        </p>
      )
    return (
      <>
        <AgendaList appointments={agenda.data ?? []} onStatus={changeStatus} />
        <PasswordForm />
      </>
    )
  }

  return loading || session ? (
    <Site>
      <div className="subpage">
        <Header />
        <main className="wrap sec page">
          <SectionHeading
            kicker="Profissionais"
            title={professional ? `Agenda de ${professional.name}` : 'Agenda'}
            as="h1"
            titleClassName="page-title"
          />
          {loading ? <p className="bk-note">Carregando...</p> : content()}
          {session ? (
            <button type="button" className="back" onClick={signOut}>
              Sair
            </button>
          ) : null}
        </main>
      </div>
      <Footer />
    </Site>
  ) : (
    <Navigate to="/entrar" replace />
  )
}
