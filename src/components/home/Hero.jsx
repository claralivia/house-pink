import { TEAM_WITH } from '../../data/site.js'
import Header from '../layout/Header.jsx'
import Butterfly from '../ui/Butterfly.jsx'
import Button from '../ui/Button.jsx'
import Curtain from './Curtain.jsx'
import HeroStage from './HeroStage.jsx'
import HeroTitle from './HeroTitle.jsx'

const FLYERS = ['a', 'b', 'c']

export default function Hero({ seen }) {
  return (
    <section className="hero" id="topo">
      {seen ? null : <Curtain />}
      {FLYERS.map((id) => (
        <div key={id} className={`fl fl-${id}`}>
          <Butterfly />
        </div>
      ))}

      <Header />

      <div className="wrap hero-in">
        <div className="copy">
          <HeroTitle />
          <p className="sub">
            Unhas de porcelana, cílios e sobrancelhas {TEAM_WITH}. Agende online em 1 minuto, sem
            criar conta.
          </p>
          <div className="ctas">
            <Button to="/agendar" tone="white">
              Quero agendar
            </Button>
            <Button href="#servicos" variant="outline">
              Serviços
            </Button>
          </div>
        </div>
        <HeroStage />
      </div>
    </section>
  )
}
