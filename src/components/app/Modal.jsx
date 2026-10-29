import { useEffect } from 'react'
import Icon from './Icon.jsx'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="app-modal" onClick={onClose}>
      <div
        className="app-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="app-modal-close" aria-label="Fechar" onClick={onClose}>
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>
  )
}
