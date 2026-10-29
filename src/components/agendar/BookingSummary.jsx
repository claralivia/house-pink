import { sessionMinutes } from '../../lib/booking.js'
import { clock, formatDuration, shortDate } from '../../lib/dates.js'

export default function BookingSummary({ choices, date, minutes }) {
  const joint = choices.length > 1
  const rows = [
    ...choices.flatMap(({ pro, service, type }) =>
      joint
        ? [[pro.first, `${service.name}, ${type.name}`]]
        : [
            ['Serviço', `${service.name}, ${type.name}`],
            [
              'Com',
              <span key="pro" className={`app-who ${pro.key}`}>
                {pro.first}
              </span>,
            ],
          ],
    ),
    ['Quando', `${shortDate(date)}, ${clock(minutes)}`],
    ['Duração', `${formatDuration(sessionMinutes(choices))}${joint ? ', ao mesmo tempo' : ''}`],
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
