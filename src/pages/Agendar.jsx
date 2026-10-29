import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppShell from '../components/app/AppShell.jsx'
import Notice from '../components/app/Notice.jsx'
import CatalogScreen from '../components/agendar/CatalogScreen.jsx'
import AccessScreen from '../components/agendar/AccessScreen.jsx'
import Confirmation from '../components/agendar/Confirmation.jsx'
import WhenScreen from '../components/agendar/WhenScreen.jsx'
import WhoScreen from '../components/agendar/WhoScreen.jsx'
import AppButton from '../components/app/AppButton.jsx'
import { PAGE_TITLES, PROS } from '../data/site.js'
import { useAvailability } from '../hooks/useAvailability.js'
import { useAccount } from '../hooks/useAccount.js'
import { useAsync } from '../hooks/useAsync.js'
import { useCatalog } from '../hooks/useCatalog.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import {
  bookingErrorMessage,
  createAppointment,
  createJointAppointment,
  fetchMyClient,
} from '../lib/api.js'
import { joinDays } from '../lib/slots.js'
import { timestamp } from '../lib/dates.js'
import { whatsappUrl } from '../lib/links.js'

const findType = (catalog, typeId) =>
  catalog
    ?.flatMap((pro) => pro.services.map((service) => ({ pro, service })))
    .flatMap(({ pro, service }) =>
      service.service_types
        .filter((type) => type.id === typeId)
        .map((type) => ({ pro, service, type })),
    )[0] ?? null

export default function Agendar() {
  usePageTitle(PAGE_TITLES.agendar)

  const [params] = useSearchParams()
  const catalog = useCatalog()
  const account = useAccount()
  const userId = account.session?.user.id
  const loadClient = useCallback(() => fetchMyClient(userId), [userId])
  const signedIn = Boolean(account.session)
  const myClient = useAsync(loadClient, account.role === 'client' ? userId : null)
  const preset = useMemo(() => findType(catalog.data, params.get('tipo')), [catalog.data, params])

  const [picked, setPicked] = useState(null)
  const [stepName, setStepName] = useState(null)
  const [date, setDate] = useState(null)
  const [minutes, setMinutes] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState(null)
  const [booking, setBooking] = useState(null)
  const [guest, setGuest] = useState(false)

  const choices = picked ?? (preset ? [preset] : [])
  const step = stepName ?? (preset ? 'when' : 'catalog')
  const needsAccess = !account.loading && !signedIn && !guest && !preset && !booking
  const first = useAvailability(choices[0]?.pro, choices[0]?.type.duration_minutes ?? 0)
  const second = useAvailability(choices[1]?.pro, choices[1]?.type.duration_minutes ?? 0)
  const availability = choices[1]
    ? {
        days: joinDays(first.days, second.days),
        error: first.error || second.error,
        loading: first.loading || second.loading,
        reload: () => {
          first.reload()
          second.reload()
        },
      }
    : first

  // Um serviço por profissional: tocar em outro da mesma troca; tocar no escolhido tira.
  const pick = (next) => {
    const rest = choices.filter(({ pro }) => pro.id !== next.pro.id)
    const already = choices.some(({ type }) => type.id === next.type.id)
    setPicked(already ? rest : [...rest, next])
    setDate(null)
    setMinutes(null)
  }

  const pickDate = (next) => {
    setDate(next)
    setMinutes(null)
    setNotice(null)
  }

  const restart = () => {
    setPicked([])
    setDate(null)
    setMinutes(null)
    setNotice(null)
    setBooking(null)
    setStepName('catalog')
  }

  const submit = async (client) => {
    setSubmitting(true)
    try {
      const startsAt = timestamp(date, minutes)
      if (choices.length > 1) {
        await createJointAppointment({
          serviceTypeIds: choices.map(({ type }) => type.id),
          startsAt,
          ...client,
        })
      } else {
        await createAppointment({ serviceTypeId: choices[0].type.id, startsAt, ...client })
      }
      setBooking({ choices, date, minutes })
    } catch (failure) {
      setNotice(bookingErrorMessage(failure))
      setMinutes(null)
      availability.reload()
      setStepName('when')
    } finally {
      setSubmitting(false)
    }
  }

  const screens = {
    catalog: catalog.data ? (
      <CatalogScreen
        catalog={catalog.data}
        signedIn={signedIn}
        selected={choices}
        onPick={pick}
        onNext={() => setStepName('when')}
      />
    ) : null,
    when: choices.length ? (
      <WhenScreen
        choices={choices}
        availability={availability}
        date={date}
        minutes={minutes}
        notice={notice}
        onBack={() => setStepName('catalog')}
        onDate={pickDate}
        onMinutes={setMinutes}
        onNext={() => setStepName('who')}
      />
    ) : null,
    who:
      choices.length && minutes !== null ? (
        <WhoScreen
          choices={choices}
          date={date}
          minutes={minutes}
          submitting={submitting}
          initial={myClient.data}
          onBack={() => setStepName('when')}
          onSubmit={submit}
        />
      ) : null,
  }

  return (
    <AppShell withBar>
      {needsAccess ? <AccessScreen onGuest={() => setGuest(true)} /> : null}
      {!needsAccess && booking ? <Confirmation booking={booking} onRestart={restart} /> : null}
      {!needsAccess && !booking ? screens[step] : null}
      {catalog.loading ? <p className="app-lead">Carregando...</p> : null}
      {catalog.error ? (
        <>
          <Notice tone="danger" title="Não conseguimos carregar a agenda">
            Chame direto no WhatsApp da profissional.
          </Notice>
          {Object.values(PROS).map((pro) => (
            <AppButton
              key={pro.key}
              variant="secondary"
              full
              href={whatsappUrl(pro)}
              style={{ marginTop: 8 }}
            >
              Falar com a {pro.first}
            </AppButton>
          ))}
        </>
      ) : null}
    </AppShell>
  )
}
