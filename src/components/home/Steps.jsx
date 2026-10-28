import { STEPS } from '../../data/content.js'
import Butterfly from '../ui/Butterfly.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'

export default function Steps() {
  return (
    <section className="panel steps" id="como">
      <div className="wrap">
        <SectionHeading kicker="Como funciona" title="Três toques e pronto" />
        <div className="stl-wrap">
          <div className="fly" aria-hidden="true">
            <Butterfly />
          </div>
          <ol className="stl">
            {STEPS.map((text, index) => (
              <li className="st" key={text}>
                <b>{index + 1}</b>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
