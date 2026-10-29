import { useCallback, useState } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { fetchEarnings } from '../../lib/api.js'
import {
  addMonths,
  dateOf,
  monthOf,
  monthTitle,
  shortDate,
  timeOf,
  timestamp,
  todayIso,
} from '../../lib/dates.js'
import { formatPrice } from '../../lib/money.js'
import Icon from '../app/Icon.jsx'

const METHODS = [
  { id: 'all', label: 'Todos' },
  { id: 'pix', label: 'Pix' },
  { id: 'card', label: 'Cartão' },
  { id: 'cash', label: 'Dinheiro' },
]
const METHOD_LABEL = { pix: 'Pix', card: 'Cartão', cash: 'Dinheiro' }

const sum = (items) => items.reduce((total, item) => total + (item.price_cents ?? 0), 0)

export default function Earnings({ professionalId }) {
  const thisMonth = monthOf(todayIso())
  const [month, setMonth] = useState(thisMonth)
  const [method, setMethod] = useState('all')
  const load = useCallback(
    () =>
      fetchEarnings(
        professionalId,
        timestamp(`${month}-01`, 0),
        timestamp(`${addMonths(month, 1)}-01`, 0),
      ),
    [professionalId, month],
  )
  const earnings = useAsync(load, `${professionalId}:${month}`)

  const items = earnings.data ?? []
  const paid = items.filter((item) => item.payment)
  const unpaid = items.length - paid.length
  const shown = method === 'all' ? paid : paid.filter((item) => item.payment === method)

  return (
    <>
      <div className="app-cal-bar app-month">
        <button
          type="button"
          className="app-nav"
          aria-label="Mês anterior"
          onClick={() => setMonth(addMonths(month, -1))}
        >
          <Icon name="chevron-left" />
        </button>
        <h2>{monthTitle(month)}</h2>
        <button
          type="button"
          className="app-nav"
          aria-label="Próximo mês"
          disabled={month >= thisMonth}
          onClick={() => setMonth(addMonths(month, 1))}
        >
          <Icon name="chevron-right" />
        </button>
      </div>

      <div className="app-total">
        <span className="app-help">
          {method === 'all' ? 'Recebido no mês' : `Recebido em ${METHOD_LABEL[method]}`}
        </span>
        <strong>{formatPrice(sum(shown))}</strong>
        <span className="app-help">
          {shown.length} {shown.length === 1 ? 'atendimento' : 'atendimentos'}
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

      {method === 'all' && paid.length ? (
        <ul className="app-group app-spaced">
          {Object.entries(METHOD_LABEL).map(([id, label]) => (
            <li key={id} className="app-sheet-row app-split">
              <span>{label}</span>
              <span>{formatPrice(sum(paid.filter((item) => item.payment === id)))}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {unpaid ? (
        <p className="app-help app-spaced">
          {unpaid} {unpaid === 1 ? 'atendimento concluído' : 'atendimentos concluídos'} sem forma de
          pagamento registrada, fora do total.
        </p>
      ) : null}

      {earnings.loading ? <p className="app-lead">Carregando...</p> : null}
      {earnings.error ? <p className="app-lead">Não foi possível carregar os ganhos.</p> : null}

      {shown.length ? (
        <>
          <h2 className="app-label">Atendimentos</h2>
          <ul className="app-group">
            {shown.map((item) => (
              <li key={item.id} className="app-row client">
                <div>
                  <div className="app-name">{item.clients.name}</div>
                  <div className="app-item-meta">
                    {shortDate(dateOf(item.starts_at))}, {timeOf(item.starts_at)} ·{' '}
                    {item.service_types.name} · {METHOD_LABEL[item.payment]}
                  </div>
                </div>
                <span className="app-price">{formatPrice(item.price_cents ?? 0)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {!earnings.loading && !items.length ? (
        <p className="app-lead">Nenhum atendimento concluído neste mês.</p>
      ) : null}
    </>
  )
}
