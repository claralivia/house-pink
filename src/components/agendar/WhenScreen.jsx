import { clock, shortDate } from '../../lib/dates.js'
import AppButton from '../app/AppButton.jsx'
import BackButton from '../app/BackButton.jsx'
import BottomBar from '../app/BottomBar.jsx'
import Notice from '../app/Notice.jsx'
import Calendar from './Calendar.jsx'

export default function WhenScreen({
  choice,
  availability,
  date,
  minutes,
  notice,
  onBack,
  onDate,
  onMinutes,
  onNext,
}) {
  const slots = availability.days.find((day) => day.date === date)?.slots ?? []
  const pending = `Escolha ${date ? 'um horário' : 'uma data'} para continuar`

  return (
    <>
      <BackButton onClick={onBack}>Serviço</BackButton>
      <p className="app-step">Passo 2 de 3</p>
      <h1 className="app-headline">Escolha a data</h1>
      <p className="app-lead">
        {choice.type.name} com a{' '}
        <span className={`app-who ${choice.pro.key}`}>{choice.pro.first}</span>
      </p>
      {availability.loading ? <p className="app-lead">Carregando horários...</p> : null}
      {availability.error ? (
        <Notice tone="danger" title="Não foi possível carregar os horários">
          Atualize a página e tente de novo.
        </Notice>
      ) : null}
      {availability.days.length ? (
        <div className="app-spaced">
          <Calendar pro={choice.pro} days={availability.days} selected={date} onSelect={onDate} />
        </div>
      ) : null}
      {date ? (
        <>
          <h2 className="app-label">{shortDate(date)}</h2>
          <div className="app-slots">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                className="app-slot"
                aria-pressed={minutes === slot}
                onClick={() => onMinutes(slot)}
              >
                {clock(slot)}
              </button>
            ))}
          </div>
        </>
      ) : null}
      {notice ? (
        <Notice tone="danger" title="Horário indisponível">
          {notice}
        </Notice>
      ) : null}
      <BottomBar>
        <AppButton full disabled={minutes === null} onClick={onNext}>
          {minutes === null ? pending : `Continuar com ${clock(minutes)}`}
        </AppButton>
      </BottomBar>
    </>
  )
}
