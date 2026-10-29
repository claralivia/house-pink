import { useState } from 'react'
import {
  addDays,
  dateOf,
  dateRange,
  dayOfMonth,
  longDate,
  shortDate,
  shortWeekday,
  todayIso,
  weekStart,
} from '../../lib/dates.js'
import { formatPrice } from '../../lib/money.js'
import Icon from '../app/Icon.jsx'
import AppointmentRow from './AppointmentRow.jsx'
import AppointmentSheet from './AppointmentSheet.jsx'
import WeekView from './WeekView.jsx'

const MIN_DAYS = 13
const OPEN = ['pending', 'confirmed']
const MODES = [
  { id: 'day', label: 'Dia' },
  { id: 'week', label: 'Semana' },
]

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

export default function AgendaList({ appointments, pro, onStatus, onPay, onDeposit, onChanged }) {
  const today = todayIso()
  const [mode, setMode] = useState('day')
  const [selected, setSelected] = useState(today)
  const [weekFrom, setWeekFrom] = useState(weekStart(today))
  const [openId, setOpenId] = useState(null)

  const days = dateRange(today, Math.max(MIN_DAYS, pro.booking_window_days ?? 0))
  const byDay = Object.groupBy(appointments, ({ starts_at }) => dateOf(starts_at))
  const items = byDay[selected] ?? []
  const open = items.filter(({ status }) => OPEN.includes(status))
  const toConfirm = items.filter(({ status }) => status === 'pending').length
  const expected = open.reduce((total, item) => total + (item.price_cents ?? 0), 0)
  const current = appointments.find((item) => item.id === openId)

  return (
    <>
      <div className="app-methods three two" role="group" aria-label="Como ver a agenda">
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="app-slot"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'day' ? (
        <>
          <div className="app-strip" role="group" aria-label="Dias">
            {days.map((date) => {
              const count = (byDay[date] ?? []).filter(
                ({ status }) => status !== 'cancelled',
              ).length
              return (
                <button
                  key={date}
                  type="button"
                  className="app-daychip"
                  aria-pressed={selected === date}
                  onClick={() => setSelected(date)}
                >
                  <small>{date === today ? 'hoje' : shortWeekday(date)}</small>
                  <strong>{dayOfMonth(date)}</strong>
                  <span
                    className={count ? 'dot on' : 'dot'}
                    aria-label={plural(count, 'horário', 'horários')}
                  />
                </button>
              )
            })}
          </div>

          <section className="app-daybrief">
            <h2 className="app-title">{longDate(selected)}</h2>
            <p className="app-help">
              {open.length
                ? `${plural(open.length, 'atendimento', 'atendimentos')} · previsto ${formatPrice(expected)}${
                    toConfirm ? ` · ${toConfirm} para confirmar` : ''
                  }`
                : 'Dia livre'}
            </p>
          </section>

          {items.length ? (
            <ul className="app-group app-timeline">
              {items.map((appointment) => (
                <AppointmentRow key={appointment.id} appointment={appointment} onOpen={setOpenId} />
              ))}
            </ul>
          ) : (
            <p className="app-lead">Nenhum horário marcado neste dia.</p>
          )}
        </>
      ) : (
        <>
          <div className="app-cal-bar app-month">
            <button
              type="button"
              className="app-nav"
              aria-label="Semana anterior"
              onClick={() => setWeekFrom(addDays(weekFrom, -7))}
            >
              <Icon name="chevron-left" />
            </button>
            <h2 className="app-period">
              {shortDate(weekFrom)} a {shortDate(addDays(weekFrom, 6))}
            </h2>
            <button
              type="button"
              className="app-nav"
              aria-label="Próxima semana"
              onClick={() => setWeekFrom(addDays(weekFrom, 7))}
            >
              <Icon name="chevron-right" />
            </button>
          </div>
          {weekFrom !== weekStart(today) ? (
            <button
              type="button"
              className="app-back"
              onClick={() => setWeekFrom(weekStart(today))}
            >
              Voltar para esta semana
            </button>
          ) : null}
          <WeekView appointments={appointments} start={weekFrom} today={today} onOpen={setOpenId} />
        </>
      )}

      {current ? (
        <AppointmentSheet
          appointment={current}
          pro={pro}
          onStatus={onStatus}
          onPay={onPay}
          onDeposit={onDeposit}
          onChanged={onChanged}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </>
  )
}
