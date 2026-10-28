import { addressLines } from '../../lib/address.js'
import { SALON } from '../../data/site.js'

export default function Address() {
  return (
    <address className="addr">
      {addressLines(SALON.address, SALON.hours).map((line) => (
        <span key={line}>{line}</span>
      ))}
    </address>
  )
}
