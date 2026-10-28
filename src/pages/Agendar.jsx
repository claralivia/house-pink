import { useCallback, useState } from 'react'
import AppShell from '../components/app/AppShell.jsx'
import Notice from '../components/app/Notice.jsx'
import Confirmation from '../components/agendar/Confirmation.jsx'
import ServiceScreen from '../components/agendar/ServiceScreen.jsx'
import TypeScreen from '../components/agendar/TypeScreen.jsx'
import WhenScreen from '../components/agendar/WhenScreen.jsx'
import WhoScreen from '../components/agendar/WhoScreen.jsx'
import AppButton from '../components/app/AppButton.jsx'
import { PAGE_TITLES, PROS } from '../data/site.js'
import { useAvailability } from '../hooks/useAvailability.js'
import { useAccount } from '../hooks/useAccount.js'
import { useAsync } from '../hooks/useAsync.js'
import { useCatalog } from '../hooks/useCatalog.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { bookingErrorMessage, createAppointment, fetchMyClient } from '../lib/api.js'
import { timestamp } from '../lib/dates.js'
import { whatsappUrl } from '../lib/links.js'

export default function Agendar() {
  usePageTitle(PAGE_TITLES.agendar)

  const catalog = useCatalog()
  const account = useAccount()
  const userId = account.session?.user.id
  const loadClient = useCallback(() => fetchMyClient(userId), [userId])
  const myClient = useAsync(loadClient, account.role === 'client' ? userId : null)
  const [step, setStep] = useState('service')
  const [choice, setChoice] = useState(null)
  const [date, setDate] = useState(null)
  const [minutes, setMinutes] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState(null)
  const [booking, setBooking] = useState(null)

  const availability = useAvailability(choice?.pro, choice?.type?.duration_minutes ?? 0)

  const pickService = (pro, service) => {
    setChoice({ pro, service, type: null })
    setDate(null)
    setMinutes(null)
    setStep('type')
  }

  const pickType = (type) => {
    setChoice((current) => ({ ...current, type }))
    setDate(null)
    setMinutes(null)
  }

  const pickDate = (next) => {
    setDate(next)
    setMinutes(null)
    setNotice(null)
  }

  const restart = () => {
    setChoice(null)
    setDate(null)
    setMinutes(null)
    setNotice(null)
    setBooking(null)
    setStep('service')
  }

  const submit = async (client) => {
    setSubmitting(true)
    try {
      await createAppointment({
        serviceTypeId: choice.type.id,
        startsAt: timestamp(date, minutes),
        ...client,
      })
      setBooking({ ...choice, date, minutes })
    } catch (failure) {
      setNotice(bookingErrorMessage(failure))
      setMinutes(null)
      availability.reload()
      setStep('when')
    } finally {
      setSubmitting(false)
    }
  }

  const screens = {
    service: catalog.data ? <ServiceScreen catalog={catalog.data} onPick={pickService} /> : null,
    type: choice ? (
      <TypeScreen
        choice={choice}
        onBack={() => setStep('service')}
        onPick={pickType}
        onNext={() => setStep('when')}
      />
    ) : null,
    when: choice?.type ? (
      <WhenScreen
        choice={choice}
        availability={availability}
        date={date}
        minutes={minutes}
        notice={notice}
        onBack={() => setStep('type')}
        onDate={pickDate}
        onMinutes={setMinutes}
        onNext={() => setStep('who')}
      />
    ) : null,
    who:
      choice?.type && minutes !== null ? (
        <WhoScreen
          choice={choice}
          date={date}
          minutes={minutes}
          submitting={submitting}
          initial={myClient.data}
          onBack={() => setStep('when')}
          onSubmit={submit}
        />
      ) : null,
  }

  return (
    <AppShell
      credit={!booking && step === 'service'}
      withBar={Boolean(booking) || step !== 'service'}
    >
      {booking ? <Confirmation booking={booking} onRestart={restart} /> : screens[step]}
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
