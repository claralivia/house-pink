import { useState } from 'react'
import { Link } from 'react-router-dom'
import Confirmation from '../components/agendar/Confirmation.jsx'
import ClientForm from '../components/agendar/ClientForm.jsx'
import DayStep from '../components/agendar/DayStep.jsx'
import ServiceStep from '../components/agendar/ServiceStep.jsx'
import Step from '../components/agendar/Step.jsx'
import TimeStep from '../components/agendar/TimeStep.jsx'
import Footer from '../components/layout/Footer.jsx'
import Header from '../components/layout/Header.jsx'
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Site from '../components/ui/Site.jsx'
import { PAGE_TITLES, PROS } from '../data/site.js'
import { useAvailability } from '../hooks/useAvailability.js'
import { useCatalog } from '../hooks/useCatalog.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { bookingErrorMessage, createAppointment } from '../lib/api.js'
import { timestamp } from '../lib/dates.js'
import { whatsappUrl } from '../lib/links.js'

const WhatsappFallback = () => (
  <div className="wa-actions">
    {Object.values(PROS).map((pro) => (
      <Button key={pro.key} href={whatsappUrl(pro)} external tone="white">
        Falar com a {pro.first}
      </Button>
    ))}
  </div>
)

export default function Agendar() {
  usePageTitle(PAGE_TITLES.agendar)

  const catalog = useCatalog()
  const [choice, setChoice] = useState(null)
  const [date, setDate] = useState(null)
  const [minutes, setMinutes] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [booking, setBooking] = useState(null)

  const availability = useAvailability(choice?.pro, choice?.type.duration_minutes)
  const slots = availability.days.find((day) => day.date === date)?.slots ?? []

  const chooseService = (next) => {
    setChoice(next)
    setDate(null)
    setMinutes(null)
    setError(null)
  }

  const chooseDate = (next) => {
    setDate(next)
    setMinutes(null)
    setError(null)
  }

  const restart = () => {
    chooseService(null)
    setBooking(null)
  }

  const submit = async (client) => {
    setSubmitting(true)
    setError(null)
    try {
      await createAppointment({
        serviceTypeId: choice.type.id,
        startsAt: timestamp(date, minutes),
        ...client,
      })
      setBooking({ ...choice, date, minutes })
    } catch (failure) {
      setError(bookingErrorMessage(failure))
      availability.reload()
      setMinutes(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Site>
      <div className="subpage">
        <Header />
        <main className="wrap sec page">
          {booking ? (
            <Confirmation booking={booking} onRestart={restart} />
          ) : (
            <>
              <SectionHeading
                kicker="Agendamento"
                title="Escolha o seu horário"
                as="h1"
                titleClassName="page-title"
              >
                <p className="lead">Sem criar conta: só o seu nome e o seu WhatsApp.</p>
              </SectionHeading>

              {catalog.loading ? <p className="bk-note">Carregando...</p> : null}
              {catalog.error ? (
                <>
                  <p className="lead">
                    Não conseguimos carregar a agenda agora. Chame direto no WhatsApp:
                  </p>
                  <WhatsappFallback />
                </>
              ) : null}

              {catalog.data ? (
                <>
                  <Step number="1" title="Serviço">
                    <ServiceStep
                      catalog={catalog.data}
                      selected={choice}
                      onSelect={chooseService}
                    />
                  </Step>

                  {choice ? (
                    <Step number="2" title="Dia">
                      {availability.loading ? (
                        <p className="bk-note">Carregando horários...</p>
                      ) : null}
                      {availability.error ? (
                        <p className="bk-error">
                          Não conseguimos carregar os horários. Tente de novo.
                        </p>
                      ) : null}
                      {availability.days.length ? (
                        <DayStep
                          pro={choice.pro}
                          days={availability.days}
                          selected={date}
                          onSelect={chooseDate}
                        />
                      ) : null}
                    </Step>
                  ) : null}

                  {date ? (
                    <Step number="3" title="Horário">
                      <TimeStep slots={slots} selected={minutes} onSelect={setMinutes} />
                      {error ? <p className="bk-error">{error}</p> : null}
                    </Step>
                  ) : null}

                  {minutes !== null ? (
                    <Step number="4" title="Seus dados">
                      <ClientForm submitting={submitting} onSubmit={submit} />
                    </Step>
                  ) : null}
                </>
              ) : null}
            </>
          )}
          <Link className="back" to="/">
            Voltar para a página inicial
          </Link>
        </main>
      </div>
      <Footer />
    </Site>
  )
}
