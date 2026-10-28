import { DEVELOPER, SALON } from '../../data/site.js'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p>
          © {new Date().getFullYear()} {SALON.name}. Todos os direitos reservados.
        </p>
        <p>
          Desenvolvido por <b>{DEVELOPER}</b>
        </p>
      </div>
    </footer>
  )
}
