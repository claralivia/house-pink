export const EXTERNAL_PROPS = { target: '_blank', rel: 'noopener noreferrer' }

export const instagramUrl = (handle) => `https://instagram.com/${handle}`

const defaultMessage = ({ first }) =>
  `Oi, ${first}! Vim pelo site da House Pink e gostaria de agendar um horário.`

export const whatsappUrl = (pro, message = defaultMessage(pro)) =>
  `https://wa.me/${pro.whatsapp}?text=${encodeURIComponent(message)}`
