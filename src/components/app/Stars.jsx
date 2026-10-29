import Icon from './Icon.jsx'

const SCALE = [1, 2, 3, 4, 5]

export default function Stars({ value, onChange, label }) {
  return (
    <div
      className="app-stars"
      role={onChange ? 'radiogroup' : 'img'}
      aria-label={label ?? `${value} de 5 estrelas`}
    >
      {SCALE.map((star) =>
        onChange ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
            className={star <= value ? 'on big' : 'big'}
            onClick={() => onChange(star)}
          >
            <Icon name="star" />
          </button>
        ) : (
          <span key={star} className={star <= value ? 'on' : ''}>
            <Icon name="star" />
          </span>
        ),
      )}
    </div>
  )
}
