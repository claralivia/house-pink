import { DUO_PHOTO } from '../../data/assets.js'
import { PROS } from '../../data/site.js'
import Pin from './Pin.jsx'

const SIDES = ['left', 'right']
const { bruna, herlany } = PROS

export default function HeroStage() {
  return (
    <div className="stage">
      <img
        className="photo"
        src={DUO_PHOTO}
        alt={`${bruna.name} e ${herlany.name} de preto, em frente ao espelho do salão`}
        fetchPriority="high"
      />
      {Object.values(PROS).map((pro, index) => (
        <Pin key={pro.key} pro={pro} side={SIDES[index]} />
      ))}
    </div>
  )
}
