import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer.jsx'
import Header from '../components/layout/Header.jsx'
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Site from '../components/ui/Site.jsx'
import { PAGE_TITLES, PROS } from '../data/site.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { whatsappUrl } from '../lib/links.js'

const { bruna, herlany } = PROS

export default function Agendar() {
  usePageTitle(PAGE_TITLES.agendar)

  return (
    <Site>
      <div className="subpage">
        <Header />
        <main className="wrap sec page">
          <SectionHeading
            kicker="Agendamento"
            title="O agendamento online chega em breve"
            as="h1"
            titleClassName="page-title"
          >
            <p className="lead">
              Enquanto isso, chame direto no WhatsApp a profissional do serviço que você quer: unhas
              com a {bruna.first}, cílios e sobrancelhas com a {herlany.first}.
            </p>
          </SectionHeading>
          <div className="wa-actions">
            {Object.values(PROS).map((pro) => (
              <Button key={pro.key} href={whatsappUrl(pro)} external tone="white">
                Falar com a {pro.first}
              </Button>
            ))}
          </div>
          <Link className="back" to="/">
            Voltar para a página inicial
          </Link>
        </main>
      </div>
      <Footer />
    </Site>
  )
}
