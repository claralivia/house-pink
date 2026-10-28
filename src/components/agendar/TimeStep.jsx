import { clock } from '../../lib/dates.js'
import Chip from '../ui/Chip.jsx'

export default function TimeStep({ slots, selected, onSelect }) {
  return (
    <div className="bk-chips">
      {slots.map((minutes) => (
        <Chip key={minutes} active={selected === minutes} onClick={() => onSelect(minutes)}>
          {clock(minutes)}
        </Chip>
      ))}
    </div>
  )
}
