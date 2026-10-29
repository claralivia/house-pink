import { DEVELOPER, SALON } from '../../data/site.js'

export default function AppFooter() {
  return (
    <footer className="app-foot">
      <p>
        © {new Date().getFullYear()} {SALON.name}. Todos os direitos reservados.
      </p>
      <p>
        Desenvolvido por <b>{DEVELOPER}</b>
      </p>
    </footer>
  )
}
