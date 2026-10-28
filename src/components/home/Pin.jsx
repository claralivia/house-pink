import { cx } from '../../lib/cx.js'
import Butterfly from '../ui/Butterfly.jsx'

export default function Pin({ pro, side }) {
  return (
    <div className={cx('pin', side)}>
      <Butterfly tone="white" />
      <span>
        {pro.first}
        <small>{pro.short}</small>
      </span>
    </div>
  )
}
