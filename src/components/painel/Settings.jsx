import { useCallback, useState } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import {
  addTimeOff,
  countBookedBetween,
  fetchTimeOff,
  fetchWorkingHours,
  removeTimeOff,
  saveWorkingHours,
  updateProfessional,
} from '../../lib/api.js'
import { shortDate, timestamp, addDays } from '../../lib/dates.js'
import { toCents, toReais } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import Field from '../app/Field.jsx'
import Notice from '../app/Notice.jsx'

const WINDOW_PRESETS = [7, 15, 30, 60, 90]
const WEEK = [
  { weekday: 1, name: 'Segunda' },
  { weekday: 2, name: 'Terça' },
  { weekday: 3, name: 'Quarta' },
  { weekday: 4, name: 'Quinta' },
  { weekday: 5, name: 'Sexta' },
  { weekday: 6, name: 'Sábado' },
  { weekday: 0, name: 'Domingo' },
]

const hhmm = (time) => time.slice(0, 5)

function Section({ title, hint, children }) {
  return (
    <details className="app-details">
      <summary>{title}</summary>
      <div className="app-details-body">
        {hint ? <p className="app-help">{hint}</p> : null}
        {children}
      </div>
    </details>
  )
}

function useSaved() {
  const [state, setState] = useState(null)
  const run = async (action) => {
    try {
      await action()
      setState('success')
    } catch {
      setState('danger')
    }
  }
  const notices = {
    success: <Notice tone="success" title="Salvo" />,
    danger: <Notice tone="danger" title="Não foi possível salvar" />,
  }
  return { run, notice: notices[state] ?? null }
}

function BookingWindow({ professional, onSaved }) {
  const [days, setDays] = useState(String(professional.booking_window_days))
  const saved = useSaved()

  return (
    <Section
      title="Quantos dias à frente a cliente pode agendar"
      hint="Depois desse prazo, a cliente chama você pelo WhatsApp."
    >
      <div className="app-methods five" role="group" aria-label="Prazo">
        {WINDOW_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className="app-slot"
            aria-pressed={days === String(preset)}
            onClick={() => setDays(String(preset))}
          >
            {preset}
          </button>
        ))}
      </div>
      <Field
        label="Ou digite outro número de dias"
        type="number"
        inputMode="numeric"
        min="1"
        max="365"
        value={days}
        onChange={(event) => setDays(event.target.value)}
      />
      {saved.notice}
      <AppButton
        full
        style={{ marginTop: 16 }}
        onClick={() =>
          saved.run(async () => {
            await updateProfessional(professional.id, { booking_window_days: Number(days) })
            onSaved()
          })
        }
      >
        Salvar prazo
      </AppButton>
    </Section>
  )
}

function Deposit({ professional, onSaved }) {
  const [value, setValue] = useState(
    professional.deposit_cents ? toReais(professional.deposit_cents) : '',
  )
  const saved = useSaved()

  return (
    <Section
      title="Sinal"
      hint="Valor que a cliente paga para garantir o horário. Deixe vazio se você não cobra sinal."
    >
      <Field
        label="Valor do sinal, em reais"
        inputMode="decimal"
        placeholder="Ex.: 50,00"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {saved.notice}
      <AppButton
        full
        style={{ marginTop: 16 }}
        onClick={() =>
          saved.run(async () => {
            const cents = value.trim() ? toCents(value) : null
            if (cents === null && value.trim()) throw new Error('invalid')
            await updateProfessional(professional.id, { deposit_cents: cents || null })
            onSaved()
          })
        }
      >
        Salvar sinal
      </AppButton>
    </Section>
  )
}

function Rules({ professional, onSaved }) {
  const [text, setText] = useState(professional.booking_notes.join('\n'))
  const saved = useSaved()

  return (
    <Section
      title="Regras que a cliente vê ao agendar"
      hint="Uma regra por linha. Aparecem em “Regras de atendimento”, antes de confirmar."
    >
      <textarea
        className="app-control app-textarea"
        rows="8"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      {saved.notice}
      <AppButton
        full
        style={{ marginTop: 16 }}
        onClick={() =>
          saved.run(async () => {
            const notes = text
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
            await updateProfessional(professional.id, { booking_notes: notes })
            onSaved()
          })
        }
      >
        Salvar regras
      </AppButton>
    </Section>
  )
}

function HoursForm({ hours }) {
  const initial = Object.fromEntries(
    WEEK.map(({ weekday }) => {
      const blocks = hours.filter((block) => block.weekday === weekday)
      const on = blocks.length > 0
      return [
        weekday,
        {
          on,
          start: on ? hhmm(blocks.map((b) => b.starts_at).sort()[0]) : '09:00',
          end: on
            ? hhmm(
                blocks
                  .map((b) => b.ends_at)
                  .sort()
                  .at(-1),
              )
            : '18:00',
        },
      ]
    }),
  )
  const [rows, setRows] = useState(initial)
  const [error, setError] = useState(null)
  const saved = useSaved()

  const change = (weekday, patch) => setRows({ ...rows, [weekday]: { ...rows[weekday], ...patch } })

  const copyFirst = () => {
    const first = WEEK.map(({ weekday }) => rows[weekday]).find((row) => row.on)
    if (!first) return
    setRows(
      Object.fromEntries(
        Object.entries(rows).map(([weekday, row]) => [
          weekday,
          row.on ? { ...row, start: first.start, end: first.end } : row,
        ]),
      ),
    )
  }

  const save = () => {
    const active = WEEK.filter(({ weekday }) => rows[weekday].on)
    const invalid = active.find(({ weekday }) => rows[weekday].end <= rows[weekday].start)
    if (invalid) return setError(`${invalid.name}: o fim precisa ser depois do começo.`)
    setError(null)
    return saved.run(() =>
      saveWorkingHours(
        active.map(({ weekday }) => ({
          weekday,
          starts_at: rows[weekday].start,
          ends_at: rows[weekday].end,
        })),
      ),
    )
  }

  return (
    <>
      <ul className="app-hours">
        {WEEK.map(({ weekday, name }) => (
          <li key={weekday} className={rows[weekday].on ? 'on' : ''}>
            <label className="app-check">
              <input
                type="checkbox"
                checked={rows[weekday].on}
                onChange={(event) => change(weekday, { on: event.target.checked })}
              />
              {name}
            </label>
            {rows[weekday].on ? (
              <span className="app-hours-times">
                <input
                  className="app-control"
                  type="time"
                  aria-label={`${name}, começa`}
                  value={rows[weekday].start}
                  onChange={(event) => change(weekday, { start: event.target.value })}
                />
                <span>às</span>
                <input
                  className="app-control"
                  type="time"
                  aria-label={`${name}, termina`}
                  value={rows[weekday].end}
                  onChange={(event) => change(weekday, { end: event.target.value })}
                />
              </span>
            ) : (
              <span className="app-help">Não atende</span>
            )}
          </li>
        ))}
      </ul>
      <AppButton variant="ghost" onClick={copyFirst}>
        Usar o mesmo horário em todos os dias
      </AppButton>
      {error ? <Notice tone="danger" title={error} /> : null}
      {saved.notice}
      <AppButton full style={{ marginTop: 16 }} onClick={save}>
        Salvar horários
      </AppButton>
    </>
  )
}

function Hours({ professional }) {
  const load = useCallback(() => fetchWorkingHours(professional.id), [professional.id])
  const hours = useAsync(load, professional.id)

  return (
    <Section
      title="Horário de atendimento"
      hint="Ligue os dias em que você atende e defina o começo e o fim. A agenda pública usa esses horários."
    >
      {hours.loading ? <p className="app-help">Carregando...</p> : null}
      {hours.data ? <HoursForm hours={hours.data} /> : null}
    </Section>
  )
}

function TimeOff({ professional }) {
  const load = useCallback(() => fetchTimeOff(professional.id), [professional.id])
  const list = useAsync(load, professional.id)
  const [range, setRange] = useState({ starts_on: '', ends_on: '', reason: '' })
  const [warning, setWarning] = useState(null)
  const [failed, setFailed] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const ends = range.ends_on || range.starts_on
    setFailed(false)
    try {
      await addTimeOff(professional.id, { ...range, ends_on: ends })
      const booked = await countBookedBetween(
        professional.id,
        timestamp(range.starts_on, 0),
        timestamp(addDays(ends, 1), 0),
      )
      setWarning(booked)
      setRange({ starts_on: '', ends_on: '', reason: '' })
      list.reload()
    } catch {
      setFailed(true)
    }
  }

  const remove = async (id) => {
    await removeTimeOff(id)
    list.reload()
  }

  return (
    <Section
      title="Folgas e férias"
      hint="Os dias marcados somem da agenda pública. Horários já marcados nesses dias continuam na sua agenda para você remarcar."
    >
      {(list.data ?? []).length ? (
        <ul className="app-group">
          {list.data.map((item) => (
            <li key={item.id} className="app-row client">
              <div>
                <div className="app-name">
                  {item.starts_on === item.ends_on
                    ? shortDate(item.starts_on)
                    : `${shortDate(item.starts_on)} a ${shortDate(item.ends_on)}`}
                </div>
                {item.reason ? <div className="app-item-meta">{item.reason}</div> : null}
              </div>
              <AppButton variant="ghost" onClick={() => remove(item.id)}>
                Remover
              </AppButton>
            </li>
          ))}
        </ul>
      ) : (
        <p className="app-help">Nenhuma folga marcada.</p>
      )}
      <form onSubmit={submit}>
        <Field
          label="Primeiro dia"
          type="date"
          required
          value={range.starts_on}
          onChange={(event) => setRange({ ...range, starts_on: event.target.value })}
        />
        <Field
          label="Último dia (deixe vazio se for um dia só)"
          type="date"
          min={range.starts_on}
          value={range.ends_on}
          onChange={(event) => setRange({ ...range, ends_on: event.target.value })}
        />
        <Field
          label="Motivo (opcional)"
          value={range.reason}
          onChange={(event) => setRange({ ...range, reason: event.target.value })}
        />
        {warning ? (
          <Notice tone="warning" title={`Você tem ${warning} horário(s) marcado(s) nesse período`}>
            Eles não foram cancelados. Abra a agenda e use “Editar horário” para remarcar.
          </Notice>
        ) : null}
        {failed ? <Notice tone="danger" title="Não foi possível salvar a folga" /> : null}
        <AppButton full type="submit" style={{ marginTop: 16 }}>
          Adicionar folga
        </AppButton>
      </form>
    </Section>
  )
}

export default function Settings({ professional, onSaved }) {
  return (
    <>
      <BookingWindow professional={professional} onSaved={onSaved} />
      <Hours professional={professional} />
      <TimeOff professional={professional} />
      <Deposit professional={professional} onSaved={onSaved} />
      <Rules professional={professional} onSaved={onSaved} />
    </>
  )
}
