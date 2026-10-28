import { clock, formatDuration, shortDate } from '../../lib/dates.js'

export default function BookingSummary({ choice, date, minutes }) {
  const { pro, service, type } = choice
  const rows = [
    ['Serviço', `${service.name}, ${type.name}`],
    [
      'Com',
      <span key="pro" className={`app-who ${pro.key}`}>
        {pro.first}
      </span>,
    ],
    ['Quando', `${shortDate(date)}, ${clock(minutes)}`],
    ['Duração', formatDuration(type.duration_minutes)],
  ]

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
