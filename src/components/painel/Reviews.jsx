import { useCallback } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { fetchFeedback } from '../../lib/api.js'
import { dateOf, shortDate } from '../../lib/dates.js'
import Avatar from '../app/Avatar.jsx'
import Notice from '../app/Notice.jsx'
import Stars from '../app/Stars.jsx'

const average = (items) =>
  (items.reduce((total, item) => total + item.rating, 0) / items.length)
    .toFixed(1)
    .replace('.', ',')

export default function Reviews({ professional }) {
  const load = useCallback(() => fetchFeedback(professional.id), [professional.id])
  const feedback = useAsync(load, professional.id)
  const items = feedback.data ?? []

  return (
    <>
      {feedback.loading ? <p className="app-lead">Carregando...</p> : null}
      {feedback.error ? (
        <Notice tone="danger" title="Não foi possível carregar as avaliações" />
      ) : null}

      {items.length ? (
        <div className="app-total">
          <span className="app-help">Nota média</span>
          <strong>{average(items)}</strong>
          <Stars value={Math.round(items.reduce((t, i) => t + i.rating, 0) / items.length)} />
          <span className="app-help">
            {items.length} {items.length === 1 ? 'avaliação' : 'avaliações'}
          </span>
        </div>
      ) : null}

      {items.length ? (
        <ul className="app-group app-spaced">
          {items.map((item) => (
            <li key={item.id} className="app-review">
              <Avatar src={item.clients.photo_url} name={item.clients.name} />
              <div>
                <p className="app-name">{item.clients.name || 'Cliente'}</p>
                <Stars value={item.rating} />
                {item.comment ? <p className="app-review-text">{item.comment}</p> : null}
                <p className="app-item-meta">
                  {item.appointments.service_types.name} ·{' '}
                  {shortDate(dateOf(item.appointments.starts_at))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {!feedback.loading && !items.length ? (
        <p className="app-lead">
          Quando as clientes avaliarem os atendimentos, as notas e os comentários aparecem aqui.
        </p>
      ) : null}
    </>
  )
}
