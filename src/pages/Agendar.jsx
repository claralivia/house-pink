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
  createAppointments,
  createJointAppointment,
  fetchMyClient,
} from '../lib/api.js'
import { timestamp } from '../lib/dates.js'
import { whatsappUrl } from '../lib/links.js'
import { joinDays } from '../lib/slots.js'

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
  const [mode, setMode] = useState('apart')
  const [stepName, setStepName] = useState(null)
  const [times, setTimes] = useState([])
  const [whenIndex, setWhenIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState(null)
  const [booking, setBooking] = useState(null)
  const [guest, setGuest] = useState(false)

  const choices = picked ?? (preset ? [preset] : [])
  const together = choices.length > 1 && mode === 'together'
  // Cada grupo é marcado uma vez: as duas juntas, ou um serviço de cada vez.
  const groups = together ? [choices] : choices.map((choice) => [choice])
  const index = Math.min(whenIndex, Math.max(0, groups.length - 1))
  const { date = null, minutes = null } = times[index] ?? {}
  const step = stepName ?? (preset ? 'when' : 'catalog')
  const needsAccess = !account.loading && !signedIn && !guest && !preset && !booking
  const total = 2 + groups.length

  const first = useAvailability(choices[0]?.pro, choices[0]?.type.duration_minutes ?? 0)
  const second = useAvailability(choices[1]?.pro, choices[1]?.type.duration_minutes ?? 0)
  const joined = {
    days: joinDays(first.days, second.days),
    error: first.error || second.error,
    loading: first.loading || second.loading,
    reload: () => {
      first.reload()
      second.reload()
    },
  }
  let availability = first
  if (together) availability = joined
  else if (index === 1) availability = second

  const setTime = (patch) =>
    setTimes((current) => {
      const next = [...current]
      next[index] = { ...next[index], ...patch }
      return next
    })

  // Um serviço por profissional: tocar em outro da mesma troca; tocar no escolhido tira.
  const pick = (next) => {
    const rest = choices.filter(({ pro }) => pro.id !== next.pro.id)
    const already = choices.some(({ type }) => type.id === next.type.id)
    setPicked(already ? rest : [...rest, next])
    setTimes([])
    setWhenIndex(0)
  }

  const pickMode = (next) => {
    setMode(next)
    setTimes([])
    setWhenIndex(0)
  }

  const restart = () => {
    setPicked([])
    setTimes([])
    setWhenIndex(0)
    setNotice(null)
    setBooking(null)
    setStepName('catalog')
  }

  const items = groups.flatMap((group, i) => group.map((choice) => ({ choice, ...times[i] })))
  const ready = groups.every(
    (_, i) => times[i]?.minutes !== undefined && times[i]?.minutes !== null,
  )

  const next = () => {
    if (index < groups.length - 1) setWhenIndex(index + 1)
    else setStepName('who')
  }

  const back = () => {
    if (index > 0) setWhenIndex(index - 1)
    else setStepName('catalog')
  }

  const submit = async (client) => {
    setSubmitting(true)
    try {
      const startsAt = items.map((item) => timestamp(item.date, item.minutes))
      const typeIds = items.map(({ choice }) => choice.type.id)
      if (together) {
        await createJointAppointment({ serviceTypeIds: typeIds, startsAt: startsAt[0], ...client })
      } else if (items.length > 1) {
        await createAppointments({ serviceTypeIds: typeIds, startsAt, ...client })
      } else {
        await createAppointment({ serviceTypeId: typeIds[0], startsAt: startsAt[0], ...client })
      }
      setBooking({ items, joint: together })
    } catch (failure) {
      setNotice(bookingErrorMessage(failure))
      setTimes((current) => current.map((time) => ({ ...time, minutes: null })))
      setWhenIndex(0)
      first.reload()
      second.reload()
      setStepName('when')
    } finally {
      setSubmitting(false)
    }
  }

  const screens = {
    catalog: catalog.data ? (
      <CatalogScreen
        catalog={catalog.data}
        selected={choices}
        mode={mode}
        onMode={pickMode}
        onPick={pick}
        onNext={() => {
          setWhenIndex(0)
          setStepName('when')
        }}
      />
    ) : null,
    when: choices.length ? (
      <WhenScreen
        choices={groups[index]}
        availability={availability}
        date={date}
        minutes={minutes}
        notice={notice}
        step={`Passo ${2 + index} de ${total}`}
        backLabel={index > 0 ? `Horário com a ${groups[index - 1][0].pro.first}` : 'Serviço'}
        onBack={back}
        onDate={(value) => {
          setTime({ date: value, minutes: null })
          setNotice(null)
        }}
        onMinutes={(value) => setTime({ minutes: value })}
        onNext={next}
      />
    ) : null,
    who:
      choices.length && ready ? (
        <WhoScreen
          items={items}
          joint={together}
          step={`Passo ${total} de ${total}`}
          submitting={submitting}
          initial={myClient.data}
          onBack={() => {
            setWhenIndex(groups.length - 1)
            setStepName('when')
          }}
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
