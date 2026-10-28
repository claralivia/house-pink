import { LANES } from '../../data/content.js'
import { PROS } from '../../data/site.js'
import Button from '../ui/Button.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Lane from './Lane.jsx'

const { bruna, herlany } = PROS

export default function Dual() {
  return (
    <section className="panel dual" id="diferencial">
      <div className="wrap dual-in">
        <div>
          <SectionHeading kicker="Nosso diferencial" title="Duas especialistas. Uma só sessão.">
            <p className="lead sm">
              Enquanto a {bruna.first} cuida das suas unhas, a {herlany.first} cuida do seu olhar.
              Você economiza tempo e sai com tudo pronto.
            </p>
          </SectionHeading>
          <Button to="/agendar" tone="white">
            Agendar minha sessão
          </Button>
        </div>
        <div role="group" aria-label="Exemplo de sessão com as duas profissionais ao mesmo tempo">
          {LANES.map((lane) => (
            <Lane key={lane.pro.key} {...lane} />
          ))}
          <div className="tot">
            <span>Juntas, ao mesmo tempo</span>
            <span>1 só visita</span>
          </div>
        </div>
      </div>
    </section>
  )
}
