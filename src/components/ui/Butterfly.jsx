import { BUTTERFLY } from '../../data/assets.js'

export default function Butterfly({ tone = 'pink', ...rest }) {
  return <img src={BUTTERFLY[tone]} alt="" {...rest} />
}
