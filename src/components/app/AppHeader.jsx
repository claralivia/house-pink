import { Link } from 'react-router-dom'
import { LOGO } from '../../data/assets.js'
import { SALON } from '../../data/site.js'
import { useAccount } from '../../hooks/useAccount.js'
import Avatar from './Avatar.jsx'

const ACCOUNT_PAGE = { pro: '/painel', client: '/conta' }

export default function AppHeader({ hideAccount }) {
  const { role, person } = useAccount()
  const to = ACCOUNT_PAGE[role] ?? '/entrar'

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
            <Link className="app-header-link account" to={to}>
              {person ? (
                <>
                  <Avatar
                    src={person.photo}
                    name={person.name}
                    size="sm"
                    className={person.isPro ? 'pro' : ''}
                  />
                  {person.first ?? 'Minha conta'}
                </>
              ) : (
                'Entrar'
              )}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
