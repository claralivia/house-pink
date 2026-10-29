import { useState } from 'react'
import { signOut } from '../../lib/api.js'
import AppButton from '../app/AppButton.jsx'
import BackButton from '../app/BackButton.jsx'
import Icon from '../app/Icon.jsx'
import HelpCenter from '../ajuda/HelpCenter.jsx'
import MyProfile from './MyProfile.jsx'
import PasswordForm from './PasswordForm.jsx'
import Reviews from './Reviews.jsx'
import Settings from './Settings.jsx'

const ITEMS = [
  { id: 'perfil', title: 'Meu perfil', text: 'Foto, apresentação e Instagram do site' },
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
  { id: 'aulas', title: 'Aulas', text: 'Aprenda a usar o painel, passo a passo' },
  { id: 'conta', title: 'Minha conta', text: 'Trocar a senha e sair' },
]

const TITLES = Object.fromEntries(ITEMS.map(({ id, title }) => [id, title]))

export default function More({ start, professional, userId, email, onSaved }) {
  const [view, setView] = useState(start)

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

      {view === 'aulas' ? <HelpCenter audience="pro" /> : null}
      {view === 'perfil' ? (
        <MyProfile userId={userId} professional={professional} onSaved={onSaved} />
      ) : null}
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
