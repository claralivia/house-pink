import { instagramUrl, whatsappUrl } from '../../lib/links.js'
import ExternalLink from '../ui/ExternalLink.jsx'

export default function ContactRow({ label, instagram, pro }) {
  return (
    <div className="row">
      <b>{label}</b>
      <ExternalLink href={instagramUrl(instagram)}>Instagram</ExternalLink>
      {pro ? <ExternalLink href={whatsappUrl(pro)}>WhatsApp</ExternalLink> : null}
    </div>
  )
}
