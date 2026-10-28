import { SERVICES } from '../../data/content.js'
import SectionHeading from '../ui/SectionHeading.jsx'
import ServiceCard from './ServiceCard.jsx'

const SHAPES = ['arch', 'square', 'arch']

export default function Services() {
  return (
    <section className="wrap sec" id="servicos">
      <SectionHeading kicker="O que a gente faz" title="Do detalhe ao destaque">
        <p className="lead">
          Escolha o seu serviço e agende direto, com a profissional que cuida de cada detalhe.
        </p>
      </SectionHeading>

      <div className="svcs">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.key} service={service} shape={SHAPES[index]} />
        ))}
      </div>
    </section>
  )
}
