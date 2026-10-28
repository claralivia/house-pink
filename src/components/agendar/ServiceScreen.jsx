import { formatDuration } from '../../lib/dates.js'
import Icon from '../app/Icon.jsx'
import PriceTag from './PriceTag.jsx'

const priceOf = (type) => type.service_prices?.price_cents

const lowestPrice = (types) => {
  const prices = types.map(priceOf).filter(Number.isInteger)
  return prices.length ? Math.min(...prices) : undefined
}

const shortestDuration = (types) => Math.min(...types.map((type) => type.duration_minutes))

export default function ServiceScreen({ catalog, onPick }) {
  return (
    <>
      <p className="app-step">Passo 1 de 4</p>
      <h1 className="app-headline">Escolha o serviço</h1>
      <p className="app-lead">Sem criar conta: só o seu nome e o seu WhatsApp.</p>
      {catalog.map((pro) => (
        <section key={pro.id}>
          <h2 className={`app-cat ${pro.key}`}>{pro.short}</h2>
          <div className="app-group">
            {pro.services.map((service) => (
              <button
                key={service.id}
                type="button"
                className="app-item"
                onClick={() => onPick(pro, service)}
              >
                <span>
                  <span className="app-item-name">{service.name}</span>
                  <span className="app-item-meta">
                    {service.service_types.length === 1
                      ? '1 tipo'
                      : `${service.service_types.length} tipos`}{' '}
                    · {formatDuration(shortestDuration(service.service_types))}
                  </span>
                </span>
                <span className="app-item-end">
                  <PriceTag cents={lowestPrice(service.service_types)} from />
                  <Icon name="chevron-right" />
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
