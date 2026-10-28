import { LOGO } from '../../data/assets.js'
import { NAV_LINKS } from '../../data/content.js'
import { SALON } from '../../data/site.js'
import Button from '../ui/Button.jsx'

export default function Header() {
  return (
    <header className="wrap top">
      <a href="/#topo" aria-label="House Pink, início">
        <img className="lg" src={LOGO.pink} alt={SALON.name} />
      </a>
      <nav className="nav" aria-label="Principal">
        {NAV_LINKS.map(({ label, hash }) => (
          <a key={hash} href={`/#${hash}`}>
            {label}
          </a>
        ))}
      </nav>
      <Button to="/agendar" size="sm">
        Agendar
      </Button>
    </header>
  )
}
