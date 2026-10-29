import { useState } from 'react'
import { addMonths, monthDays, monthOf, monthTitle, shortDate, weekdayOf } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import AppButton from '../app/AppButton.jsx'
import Icon from '../app/Icon.jsx'

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

export default function Calendar({ pro, joint, days, selected, onSelect }) {
  const today = days[0].date
  const windowEnd = days.at(-1).date
  const [month, setMonth] = useState(monthOf(today))
  const byDate = Object.fromEntries(days.map((day) => [day.date, day]))
  const cells = monthDays(month)
  const beyondWindow = cells.at(-1) > windowEnd

  return (
    <div className="app-cal">
      <div className="app-cal-bar">
        <button
          type="button"
          className="app-nav"
          aria-label="Mês anterior"
          disabled={month <= monthOf(today)}
          onClick={() => setMonth(addMonths(month, -1))}
        >
          <Icon name="chevron-left" />
        </button>
        <h2>{monthTitle(month)}</h2>
        <button
          type="button"
          className="app-nav"
          aria-label="Próximo mês"
          disabled={month >= addMonths(monthOf(windowEnd), 1)}
          onClick={() => setMonth(addMonths(month, 1))}
        >
          <Icon name="chevron-right" />
        </button>
      </div>
      <div className="app-cal-grid">
        {WEEKDAYS.map((name) => (
          <div key={name} className="app-cal-wd" aria-label={name}>
            {name.charAt(0).toUpperCase()}
          </div>
        ))}
        {Array.from({ length: weekdayOf(cells[0]) }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {cells.map((date) => {
          const info = byDate[date]
          return (
            <button
              key={date}
              type="button"
              className={`app-day${date === today ? ' today' : ''}${info?.closed ? ' closed' : ''}`}
              aria-pressed={selected === date}
              disabled={!info || info.slots.length === 0}
              onClick={() => onSelect(date)}
            >
              {Number(date.slice(8))}
            </button>
          )
        })}
      </div>
      <p className="app-legend">
        {joint
          ? 'Dias riscados: uma das duas não atende (dia da semana, folga ou férias).'
          : `Dias riscados: sem atendimento da ${pro.first} (dia da semana em que ela não atende, folga ou férias).`}
      </p>
      {beyondWindow ? (
        <div className="app-late">
          <div>
            <b>Datas depois de {shortDate(windowEnd)}</b>
            Para marcar mais adiante, fale com a {pro.first} e combinamos o melhor dia.
          </div>
          <AppButton variant="secondary" full href={whatsappUrl(pro)}>
            Chamar a {pro.first} no WhatsApp
          </AppButton>
        </div>
      ) : null}
    </div>
  )
}
