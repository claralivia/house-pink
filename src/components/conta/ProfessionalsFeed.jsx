import { Link } from 'react-router-dom'
import { useCatalog } from '../../hooks/useCatalog.js'
import { formatDuration } from '../../lib/dates.js'
import { instagramUrl } from '../../lib/links.js'
import Avatar from '../app/Avatar.jsx'
import PriceTag from '../agendar/PriceTag.jsx'

export default function ProfessionalsFeed() {
  const catalog = useCatalog()

  if (!catalog.data) return null

  return (
    <section className="app-feed">
      <h2 className="app-title">Nossas profissionais</h2>
      {catalog.data.map((pro) => (
        <article key={pro.id} className="app-feed-pro">
          <header>
            <Avatar src={pro.photo} name={pro.name} size="lg" className="pro" />
            <div>
              <h3 className="app-name">{pro.name}</h3>
              <p className="app-help">{pro.area}</p>
              <a
                className="app-feed-link"
                href={instagramUrl(pro.instagram)}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{pro.instagram}
              </a>
            </div>
          </header>
          <p className="app-feed-bio">{pro.bio}</p>

          {pro.services.map((service) => (
            <div key={service.id}>
              <h4 className="app-label">{service.name}</h4>
              <ul className="app-feed-types">
                {service.service_types.map((type) => (
                  <li key={type.id}>
                    <Link to={`/agendar?tipo=${type.id}`} className="app-feed-type">
                      {type.image_url ? <img src={type.image_url} alt="" loading="lazy" /> : null}
                      <span>
                        <span className="app-item-name">{type.name}</span>
                        <span className="app-item-meta">
                          {formatDuration(type.duration_minutes)}
                        </span>
                        <PriceTag cents={type.service_prices?.price_cents} signedIn />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </article>
      ))}
    </section>
  )
}
