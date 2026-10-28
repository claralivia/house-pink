import { formatPrice } from '../../lib/money.js'
import Icon from '../app/Icon.jsx'

export default function PriceTag({ cents, from }) {
  return Number.isInteger(cents) ? (
    <span className="app-price">
      {from ? <small className="app-help">a partir de </small> : null}
      {formatPrice(cents)}
    </span>
  ) : (
    <span className="app-locked">
      <Icon name="lock" width="16" height="16" />
      Entre para ver
    </span>
  )
}
