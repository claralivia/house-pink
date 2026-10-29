import { formatPrice } from '../../lib/money.js'
import Icon from '../app/Icon.jsx'

export default function PriceTag({ cents, from, signedIn }) {
  if (Number.isInteger(cents)) {
    return (
      <span className="app-price">
        {from ? <small className="app-help">a partir de </small> : null}
        {formatPrice(cents)}
      </span>
    )
  }

  return signedIn ? (
    <span className="app-locked">Valor a combinar</span>
  ) : (
    <span className="app-locked">
      <Icon name="lock" width="16" height="16" />
      Entre para ver
    </span>
  )
}
