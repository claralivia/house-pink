import { sessionMinutes } from '../../lib/booking.js'
import { clock, formatDuration, shortDate } from '../../lib/dates.js'

const when = ({ date, minutes }) => `${shortDate(date)}, ${clock(minutes)}`

export default function BookingSummary({ items, joint }) {
  const choices = items.map(({ choice }) => choice)
  const single = items.length === 1
  const rows = []

  if (single || joint) {
    choices.forEach(({ pro, service, type }) => {
      rows.push(
        single
          ? ['Serviço', `${service.name}, ${type.name}`]
          : [pro.first, `${service.name}, ${type.name}`],
      )
      if (single)
        rows.push([
          'Com',
          <span key="pro" className={`app-who ${pro.key}`}>
            {pro.first}
          </span>,
        ])
    })
    rows.push(['Quando', when(items[0])])
    rows.push([
      'Duração',
      `${formatDuration(sessionMinutes(choices))}${joint ? ', ao mesmo tempo' : ''}`,
    ])
  } else {
    items.forEach((item) => {
      const { pro, service, type } = item.choice
      rows.push([
        pro.first,
        <span key={type.id}>
          {service.name}, {type.name}
          <br />
          <b>{when(item)}</b>, {formatDuration(type.duration_minutes)}
        </span>,
      ])
    })
  }

  return (
    <div className="app-group app-spaced">
      <div className="app-sheet">
        {rows.map(([label, value]) => (
          <div key={label} className="app-sheet-row">
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
