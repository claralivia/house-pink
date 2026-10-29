import { Link } from 'react-router-dom'
import { DEVELOPER, SALON } from '../../data/site.js'

export default function AppFooter() {
  return (
    <footer className="app-foot">
      <p>
        <Link className="app-foot-help" to="/ajuda">
          Precisa de ajuda?
        </Link>
      </p>
      <p>
        © {new Date().getFullYear()} {SALON.name}. Todos os direitos reservados.
      </p>
      <p>
        Desenvolvido por <b>{DEVELOPER}</b>
      </p>
    </footer>
  )
}
