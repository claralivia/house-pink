import { PROS } from '../../data/site.js'
import { instagramUrl, whatsappUrl } from '../../lib/links.js'
import Button from '../ui/Button.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

export default function Team() {
  return (
    <section className="wrap sec" id="equipe">
      <SectionHeading kicker="Quem cuida de você" title="Conheça as profissionais">
        <p className="lead">Cada uma atende a sua área, com agenda e contato próprios.</p>
      </SectionHeading>

      <div className="team">
        {Object.values(PROS).map((pro) => (
          <article key={pro.key} className="member">
            <span className="member-photo">
              <img src={pro.photo} alt={`Foto de ${pro.name}`} loading="lazy" />
            </span>
            <h3>{pro.name}</h3>
            <p className="member-area">{pro.area}</p>
            <p className="member-bio">{pro.bio}</p>
            <div className="member-links">
              <Button href={whatsappUrl(pro)} external variant="dark" tone="white">
                WhatsApp
              </Button>
              <Button href={instagramUrl(pro.instagram)} external variant="outline">
                @{pro.instagram}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
