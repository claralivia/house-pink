import Butterfly from '../ui/Butterfly.jsx'

export default function Curtain() {
  return (
    <div className="curtain" aria-hidden="true">
      <i className="cl" />
      <i className="cr" />
      <Butterfly tone="white" />
    </div>
  )
}
