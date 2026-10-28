import { Link } from 'react-router-dom'
import { LOGO } from '../../data/assets.js'
import { SALON } from '../../data/site.js'
import { useAccount } from '../../hooks/useAccount.js'

const ACCOUNT_LINK = {
  pro: { to: '/painel', label: 'Minha agenda' },
  client: { to: '/conta', label: 'Minha conta' },
}
const LOGIN_LINK = { to: '/entrar', label: 'Entrar' }

export default function AppHeader({ hideAccount }) {
  const { role } = useAccount()
  const account = ACCOUNT_LINK[role] ?? LOGIN_LINK

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
