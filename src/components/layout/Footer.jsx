import { Link } from 'react-router-dom'
import { DEVELOPER, SALON } from '../../data/site.js'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p>
          © {new Date().getFullYear()} {SALON.name}. Todos os direitos reservados.
        </p>
        <p>
          <Link to="/ajuda">Precisa de ajuda?</Link> · <Link to="/entrar">Entrar</Link>
        </p>
        <p>
          Desenvolvido por <b>{DEVELOPER}</b>
        </p>
      </div>
    </footer>
  )
}
