import { formatDuration } from '../../lib/dates.js'
import AppButton from '../app/AppButton.jsx'
import BackButton from '../app/BackButton.jsx'
import BottomBar from '../app/BottomBar.jsx'
import Icon from '../app/Icon.jsx'
import PriceTag from './PriceTag.jsx'

export default function TypeScreen({ choice, signedIn, onBack, onPick, onNext }) {
  const { service, type } = choice

  return (
    <>
      <BackButton onClick={onBack}>Serviços</BackButton>
      <p className="app-step">Passo 2 de 4</p>
      <h1 className="app-headline">{service.name}</h1>
      <p className="app-lead">Escolha o tipo.</p>
      <div className="app-group app-spaced" role="radiogroup" aria-label="Tipo">
        {service.service_types.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={type?.id === option.id}
            className={`app-item${type?.id === option.id ? ' on' : ''}`}
            onClick={() => onPick(option)}
          >
            <span>
              <span className="app-item-name">{option.name}</span>
              <span className="app-item-meta">{formatDuration(option.duration_minutes)}</span>
              {option.description ? (
                <span className="app-item-meta app-item-about">{option.description}</span>
              ) : null}
            </span>
            <span className="app-item-end">
              <PriceTag cents={option.service_prices?.price_cents} signedIn={signedIn} />
              {type?.id === option.id ? <Icon name="check" className="check" /> : null}
            </span>
          </button>
        ))}
      </div>
      <BottomBar>
        <AppButton full disabled={!type} onClick={onNext}>
          {type ? 'Escolher data' : 'Escolha um tipo para continuar'}
        </AppButton>
      </BottomBar>
    </>
  )
}
