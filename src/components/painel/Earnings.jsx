import { useCallback, useState } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { fetchEarnings } from '../../lib/api.js'
import { closingText, entriesOf, METHOD_LABEL, summarize } from '../../lib/closing.js'
import {
  dateOf,
  periodOf,
  periodTitle,
  shiftPeriod,
  shortDate,
  timeOf,
  timestamp,
  todayIso,
} from '../../lib/dates.js'
import { shareUrl } from '../../lib/links.js'
import { formatPrice } from '../../lib/money.js'
import AppButton from '../app/AppButton.jsx'
import Icon from '../app/Icon.jsx'

const MODES = [
  { id: 'day', label: 'Dia' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
]
const METHODS = [
  { id: 'all', label: 'Todos' },
  ...Object.entries(METHOD_LABEL).map(([id, label]) => ({ id, label })),
]

export default function Earnings({ professional }) {
  const today = todayIso()
  const [mode, setMode] = useState('month')
  const [anchor, setAnchor] = useState(today)
  const [method, setMethod] = useState('all')
  const [copied, setCopied] = useState(false)

  const { from, to } = periodOf(mode, anchor)
  const title = periodTitle(mode, anchor)
  const nextAnchor = shiftPeriod(mode, anchor, 1)
  const canGoNext = periodOf(mode, nextAnchor).from <= today

  const load = useCallback(
    () => fetchEarnings(professional.id, timestamp(from, 0), timestamp(to, 0)),
    [professional.id, from, to],
  )
  const earnings = useAsync(load, `${professional.id}:${from}:${to}`)

  const items = earnings.data ?? []
  const summary = summarize(items, method)
  const text = closingText({ name: professional.name, title, summary: summarize(items, 'all') })

  const changeMode = (next) => {
    setMode(next)
    setAnchor(today)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <>
      <div className="app-methods three" role="group" aria-label="Período">
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="app-slot"
            aria-pressed={mode === id}
            onClick={() => changeMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="app-cal-bar app-month">
        <button
          type="button"
          className="app-nav"
          aria-label="Período anterior"
          onClick={() => setAnchor(shiftPeriod(mode, anchor, -1))}
        >
          <Icon name="chevron-left" />
        </button>
        <h2 className="app-period">{title}</h2>
        <button
          type="button"
          className="app-nav"
          aria-label="Próximo período"
          disabled={!canGoNext}
          onClick={() => setAnchor(nextAnchor)}
        >
          <Icon name="chevron-right" />
        </button>
      </div>

      <div className="app-total">
        <span className="app-help">
          {method === 'all' ? 'Recebido no período' : `Recebido em ${METHOD_LABEL[method]}`}
        </span>
        <strong>{formatPrice(summary.total)}</strong>
        <span className="app-help">
          {summary.count} {summary.count === 1 ? 'atendimento' : 'atendimentos'} · sinais{' '}
          {formatPrice(summary.deposits)} · restante {formatPrice(summary.rests)}
        </span>
      </div>

      <div className="app-methods" role="group" aria-label="Forma de pagamento">
        {METHODS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className="app-slot"
            aria-pressed={method === id}
            onClick={() => setMethod(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {method === 'all' ? (
        <ul className="app-group app-spaced">
          {Object.entries(METHOD_LABEL).map(([id, label]) => (
            <li key={id} className="app-sheet-row app-split">
              <span>{label}</span>
              <span>{formatPrice(summary.byMethod[id])}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {summary.unpaid ? (
        <p className="app-help app-spaced">
          {summary.unpaid}{' '}
          {summary.unpaid === 1 ? 'atendimento concluído' : 'atendimentos concluídos'} sem forma de
          pagamento registrada, fora do total.
        </p>
      ) : null}

      {earnings.loading ? <p className="app-lead">Carregando...</p> : null}
      {earnings.error ? <p className="app-lead">Não foi possível carregar os ganhos.</p> : null}
      {!earnings.loading && !items.length ? (
        <p className="app-lead">Nenhum atendimento concluído neste período.</p>
      ) : null}

      {items.length ? (
        <>
          <h2 className="app-label">Atendimentos</h2>
          <ul className="app-group">
            {items
              .filter((item) =>
                entriesOf(item).some((entry) => method === 'all' || entry.method === method),
              )
              .map((item) => (
                <li key={item.id} className="app-row client">
                  <div>
                    <div className="app-name">{item.clients.name}</div>
                    <div className="app-item-meta">
                      {shortDate(dateOf(item.starts_at))}, {timeOf(item.starts_at)} ·{' '}
                      {item.service_types.name}
                    </div>
                    <div className="app-item-meta">
                      {entriesOf(item)
                        .map(
                          (entry) =>
                            `${entry.kind} ${formatPrice(entry.cents)} (${METHOD_LABEL[entry.method]})`,
                        )
                        .join(' · ')}
                    </div>
                  </div>
                  <span className="app-price">{formatPrice(item.price_cents ?? 0)}</span>
                </li>
              ))}
          </ul>
        </>
      ) : null}

      <section className="app-closing">
        <h2 className="app-title">Fechamento</h2>
        <p className="app-help">Resumo do período para guardar ou enviar.</p>
        <pre className="app-closing-text">{text}</pre>
        <div className="app-row-actions">
          <AppButton variant="secondary" onClick={copy}>
            {copied ? 'Resumo copiado' : 'Copiar resumo'}
          </AppButton>
          <AppButton variant="ghost" href={shareUrl(text)}>
            Enviar no WhatsApp
          </AppButton>
        </div>
      </section>
    </>
  )
}
