import { Fragment } from 'react'
import { MARQUEE_WORDS } from '../../data/content.js'
import Butterfly from '../ui/Butterfly.jsx'

const REPEATS = 4
const WORDS = Array.from({ length: REPEATS }, () => MARQUEE_WORDS).flat()

export default function Marquee() {
  return (
    <div className="mq" aria-hidden="true">
      <div className="tr">
        {WORDS.map((word, index) => (
          <Fragment key={index}>
            <span>{word}</span>
            <Butterfly tone="white" />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
