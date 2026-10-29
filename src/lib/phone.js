const COUNTRY_CODE = '55'
const LOCAL_LENGTHS = [10, 11]

export const normalizeWhatsapp = (value) => {
  const digits = value.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  return LOCAL_LENGTHS.includes(digits.length) ? `${COUNTRY_CODE}${digits}` : null
}

export const formatPhone = (whatsapp) => {
  const local = whatsapp.replace(/^55/, '')
  const ddd = local.slice(0, 2)
  const rest = local.slice(2)
  const split = rest.length > 8 ? 5 : 4
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`
}
