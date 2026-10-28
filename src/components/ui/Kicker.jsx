import { cx } from '../../lib/cx.js'
import Butterfly from './Butterfly.jsx'

export default function Kicker({ light, children }) {
  return (
    <div className={cx('kick', light && 'light')}>
      <Butterfly />
      {children}
    </div>
  )
}
