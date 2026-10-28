import { Link } from 'react-router-dom'
import { LOGO } from '../../data/assets.js'
import { SALON } from '../../data/site.js'
import { useSession } from '../../hooks/useSession.js'

export default function AppHeader({ hideAccount }) {
  const { session } = useSession()
  const account = session
    ? { to: '/painel', label: 'Minha agenda' }
    : { to: '/entrar', label: 'Entrar' }

  return (
    <header className="app-header">
      <div className="app-header-in">
        <Link className="app-header-logo" to="/" aria-label={`${SALON.name}, voltar para o site`}>
          <img src={LOGO.pink} alt="" />
        </Link>
        <nav className="app-header-nav" aria-label="Site">
          <Link className="app-header-link" to="/">
            Site
          </Link>
          {hideAccount ? null : (
            <Link className="app-header-link account" to={account.to}>
              {account.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
