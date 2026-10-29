import { normalizeWhatsapp } from './phone.js'

const DELIMITERS = ['\t', ';', ',']
const MIN_PHONE_DIGITS = 8

const digitsIn = (text) => (text.match(/\d/g) ?? []).length
const looksLikePhone = (text) => digitsIn(text) >= MIN_PHONE_DIGITS

const splitLine = (line) => {
  const delimiter = DELIMITERS.find((item) => line.includes(item))
  return (delimiter ? line.split(delimiter) : [line]).map((cell) =>
    cell.replace(/^"|"$/g, '').trim(),
  )
}

const toClient = (cells) => {
  const phoneCell = cells.find(looksLikePhone)
  const name = cells
    .filter((cell) => cell && cell !== phoneCell && !looksLikePhone(cell))
    .join(' ')
    .trim()
  const whatsapp = phoneCell ? normalizeWhatsapp(phoneCell) : null
  return name && whatsapp ? { name, whatsapp } : null
}

export const parseClients = (text) => {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(splitLine)
  const hasHeader = rows.length > 0 && !rows[0].some(looksLikePhone)
  const body = hasHeader ? rows.slice(1) : rows

  const seen = new Set()
  const valid = []
  const invalid = []

  body.forEach((cells) => {
    const client = toClient(cells)
    if (!client) return invalid.push(cells.filter(Boolean).join(' · '))
    if (seen.has(client.whatsapp)) return undefined
    seen.add(client.whatsapp)
    return valid.push(client)
  })

  return { valid, invalid }
}
