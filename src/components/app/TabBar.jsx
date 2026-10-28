import Icon from './Icon.jsx'

export default function TabBar({ tabs, current, onChange }) {
  return (
    <nav className="app-tabs" aria-label="Principal">
      {tabs.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          className="app-tab"
          aria-current={current === id ? 'page' : undefined}
          onClick={() => onChange(id)}
        >
          <Icon name={icon} />
          {label}
        </button>
      ))}
    </nav>
  )
}
