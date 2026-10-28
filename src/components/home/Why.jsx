import { WHY_ITEMS } from '../../data/content.js'
import Butterfly from '../ui/Butterfly.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

export default function Why() {
  return (
    <section className="panel why">
      <div className="wrap">
        <SectionHeading kicker="Por que a House Pink" title="Mais prático para você" light />
        <div className="its">
          {WHY_ITEMS.map(({ title, text }) => (
            <div className="it" key={title}>
              <Butterfly />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
