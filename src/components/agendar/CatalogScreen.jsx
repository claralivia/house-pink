import { useState } from 'react'
import { sessionMinutes } from '../../lib/booking.js'
import { formatDuration } from '../../lib/dates.js'
import AppButton from '../app/AppButton.jsx'
import BottomBar from '../app/BottomBar.jsx'
import Icon from '../app/Icon.jsx'
import PriceTag from './PriceTag.jsx'

const priceOf = (type) => type.service_prices?.price_cents

export default function CatalogScreen({ catalog, signedIn, selected, onPick, onNext }) {
  const [filter, setFilter] = useState('all')
  const services = catalog.flatMap((pro) => pro.services.map((service) => ({ pro, service })))
  const shown =
    filter === 'all' ? services : services.filter(({ service }) => service.id === filter)

  return (
    <>
      <p className="app-step">Passo 1 de 3</p>
      <h1 className="app-headline">O que você quer fazer?</h1>
      <p className="app-lead">
        {signedIn
          ? 'Escolha o serviço e veja os valores.'
          : 'Escolha o serviço. Sem criar conta: só o seu nome e o seu WhatsApp.'}
      </p>

      {catalog.length > 1 ? (
        <p className="app-help">
          Quer unhas e cílios na mesma visita? Escolha um serviço de cada profissional: elas atendem
          ao mesmo tempo.
        </p>
      ) : null}

      <div className="app-filter" role="group" aria-label="Filtrar serviços">
        {[{ id: 'all', name: 'Todos' }, ...services.map(({ service }) => service)].map((option) => (
          <button
            key={option.id}
            type="button"
            className="app-slot"
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
          >
            {option.name}
          </button>
        ))}
      </div>

      {shown.map(({ pro, service }) => (
        <section key={service.id}>
          <h2 className="app-label">
            {service.name} · com a <span className={`app-who ${pro.key}`}>{pro.first}</span>
          </h2>
          <div className="app-cards" role="group" aria-label={service.name}>
            {service.service_types.map((type) => {
              const on = selected.some((item) => item.type.id === type.id)
              return (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={on}
                  className={`app-card${on ? ' on' : ''}`}
                  onClick={() => onPick({ pro, service, type })}
                >
                  {type.image_url ? (
                    <img className="app-card-photo" src={type.image_url} alt="" loading="lazy" />
                  ) : null}
                  <span className="app-card-body">
                    <span className="app-card-top">
                      <span className="app-item-name">{type.name}</span>
                      {on ? <Icon name="check" className="check" /> : null}
                    </span>
                    <span className="app-item-meta">{formatDuration(type.duration_minutes)}</span>
                    {type.description ? (
                      <span className="app-card-about">{type.description}</span>
                    ) : null}
                    <PriceTag cents={priceOf(type)} signedIn />
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <BottomBar>
        {selected.length ? (
          <p className="app-bar-note">
            {selected.map(({ type }) => type.name).join(' + ')} ·{' '}
            {formatDuration(sessionMinutes(selected))}
            {selected.length > 1 ? ', ao mesmo tempo' : ''}
          </p>
        ) : null}
        <AppButton full disabled={!selected.length} onClick={onNext}>
          {selected.length ? 'Escolher data e horário' : 'Escolha um serviço para continuar'}
        </AppButton>
      </BottomBar>
    </>
  )
}
