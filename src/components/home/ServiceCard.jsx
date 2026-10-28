import { cx } from '../../lib/cx.js'
import Butterfly from '../ui/Butterfly.jsx'
import Button from '../ui/Button.jsx'

export default function ServiceCard({ service, shape }) {
  const { key, title, pro, image, alt, text, cta } = service

  return (
    <article className="svc">
      <div className={cx('ph', shape)}>
        <img className="pic" src={image} alt={alt} loading="lazy" />
        <span className="by">
          <Butterfly />
          com a {pro.first}
        </span>
        <h3>{title}</h3>
      </div>
      <p>{text}</p>
      <Button to={`/agendar?servico=${key}`} variant="outline" tone="pink" wide>
        {cta}
      </Button>
    </article>
  )
}
