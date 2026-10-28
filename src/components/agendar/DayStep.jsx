import { dayOfMonth, shortWeekday } from '../../lib/dates.js'
import { whatsappUrl } from '../../lib/links.js'
import Chip from '../ui/Chip.jsx'
import ExternalLink from '../ui/ExternalLink.jsx'

export default function DayStep({ pro, days, selected, onSelect }) {
  return (
    <>
      <div className="bk-chips">
        {days.map(({ date, slots }) => (
          <Chip
            key={date}
            className="day"
            active={selected === date}
            disabled={slots.length === 0}
            onClick={() => onSelect(date)}
          >
            <span>{shortWeekday(date)}</span>
            <strong>{dayOfMonth(date)}</strong>
          </Chip>
        ))}
      </div>
      <p className="bk-note">
        Dias apagados não têm horário livre. Para outra data, chame a {pro.first} no{' '}
        <ExternalLink href={whatsappUrl(pro)}>WhatsApp</ExternalLink>.
      </p>
    </>
  )
}
