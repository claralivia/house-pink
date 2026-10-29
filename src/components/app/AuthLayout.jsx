import { DUO_PHOTO } from '../../data/assets.js'
import { SALON } from '../../data/site.js'
import AppShell from './AppShell.jsx'
import Butterfly from '../ui/Butterfly.jsx'

export default function AuthLayout({ title, lead, children }) {
  return (
    <AppShell hideAccount wide>
      <div className="auth">
        <div className="auth-photo">
          <img src={DUO_PHOTO} alt={`Bruna e Herlany, do ${SALON.name}`} />
          <Butterfly tone="pink" className="auth-bf auth-bf-a" />
          <Butterfly tone="pink" className="auth-bf auth-bf-b" />
        </div>
        <div className="auth-body">
          <p className="auth-kicker">
            <Butterfly tone="pink" />
            House Pink
          </p>
          <h1 className="auth-title">
            <span>{title}</span>
          </h1>
          {lead ? <p className="app-lead">{lead}</p> : null}
          {children}
        </div>
      </div>
    </AppShell>
  )
}
