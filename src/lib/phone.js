const COUNTRY_CODE = '55'
const LOCAL_LENGTHS = [10, 11]

export const normalizeWhatsapp = (value) => {
  const digits = value.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  return LOCAL_LENGTHS.includes(digits.length) ? `${COUNTRY_CODE}${digits}` : null
}
