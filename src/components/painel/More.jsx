import { useState } from 'react'
import { signOut } from '../../lib/api.js'
import AppButton from '../app/AppButton.jsx'
import BackButton from '../app/BackButton.jsx'
import Icon from '../app/Icon.jsx'
import PasswordForm from './PasswordForm.jsx'
import Reviews from './Reviews.jsx'
import Settings from './Settings.jsx'

const ITEMS = [
  {
    id: 'avaliacoes',
    title: 'Avaliações das clientes',
    text: 'Notas e comentários dos atendimentos',
  },
  {
    id: 'ajustes',
    title: 'Ajustes da agenda',
    text: 'Dias à frente, horários, folgas, sinal e regras',
  },
  { id: 'conta', title: 'Minha conta', text: 'Trocar a senha e sair' },
]

const TITLES = Object.fromEntries(ITEMS.map(({ id, title }) => [id, title]))

export default function More({ professional, email, onSaved }) {
  const [view, setView] = useState('menu')

  return (
    <>
      {view === 'menu' ? (
        <>
          <h1 className="app-headline">Mais</h1>
          <div className="app-group app-spaced">
            {ITEMS.map(({ id, title, text }) => (
              <button key={id} type="button" className="app-item" onClick={() => setView(id)}>
                <span>
                  <span className="app-item-name">{title}</span>
                  <span className="app-item-meta">{text}</span>
                </span>
                <span className="app-item-end">
                  <Icon name="chevron-right" />
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <BackButton onClick={() => setView('menu')}>Mais</BackButton>
          <h1 className="app-headline">{TITLES[view]}</h1>
        </>
      )}

      {view === 'avaliacoes' ? <Reviews professional={professional} /> : null}
      {view === 'ajustes' ? <Settings professional={professional} onSaved={onSaved} /> : null}
      {view === 'conta' ? (
        <>
          <p className="app-lead">{email}</p>
          <PasswordForm />
          <AppButton variant="secondary" full onClick={signOut} style={{ marginTop: 24 }}>
            Sair
          </AppButton>
        </>
      ) : null}
    </>
  )
}
