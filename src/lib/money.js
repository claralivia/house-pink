const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatPrice = (cents) => BRL.format(cents / 100)

export const toCents = (text) => {
  const value = Number(String(text).replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : null
}

export const toReais = (cents) => (cents / 100).toFixed(2).replace('.', ',')
