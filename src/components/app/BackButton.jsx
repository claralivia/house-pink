import Icon from './Icon.jsx'

export default function BackButton({ onClick, children }) {
  return (
    <button type="button" className="app-back" onClick={onClick}>
      <Icon name="chevron-left" />
      {children}
    </button>
  )
}
