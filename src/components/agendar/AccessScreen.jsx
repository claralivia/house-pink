import { Link } from 'react-router-dom'
import Notice from '../app/Notice.jsx'

export default function AccessScreen({ onGuest }) {
  return (
    <>
      <p className="app-step">Agendar</p>
      <h1 className="app-headline">Como você quer continuar?</h1>

      <div className="app-access">
        <Link className="app-access-card recommended" to="/entrar?volta=agendar">
          <span className="app-access-tag">Recomendado</span>
          <strong>Sou cliente</strong>
          <span>Entre ou crie a sua conta para acompanhar os seus horários.</span>
        </Link>
        <button type="button" className="app-access-card" onClick={onGuest}>
          <strong>Sou visitante</strong>
          <span>Agende só com o seu nome e o seu WhatsApp, sem criar conta.</span>
        </button>
        <Link className="app-access-card" to="/entrar">
          <strong>Sou profissional</strong>
          <span>Entre para ver e cuidar da sua agenda.</span>
        </Link>
      </div>

      <Notice tone="info" title="Como funciona para visitantes">
        Visitantes agendam só com nome e WhatsApp. No final, você precisa confirmar o horário com a
        profissional pelo WhatsApp, porque alguns serviços dependem de sinal. Com uma conta, você
        acompanha os seus horários e agenda de novo com um toque.
      </Notice>
    </>
  )
}
