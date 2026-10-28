import Icon from './Icon.jsx'

const ICON = { danger: 'warn', warning: 'clock', success: 'ok', info: 'info' }

export default function Notice({ tone = 'info', title, children }) {
  return (
    <div className={`app-notice ${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon name={ICON[tone]} />
      <div>
        {title ? <b>{title}</b> : null}
        {children}
      </div>
    </div>
  )
}
