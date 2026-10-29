import { formatPrice } from './money.js'

export const METHOD_LABEL = { pix: 'Pix', card: 'Cartão', cash: 'Dinheiro' }

const sum = (entries) => entries.reduce((total, entry) => total + entry.cents, 0)

export const entriesOf = (item) => {
  const deposit = item.deposit_paid_cents
  const rest = Math.max((item.price_cents ?? 0) - deposit, 0)
  return [
    deposit > 0 &&
      item.deposit_payment && { method: item.deposit_payment, cents: deposit, kind: 'Sinal' },
    rest > 0 && item.payment && { method: item.payment, cents: rest, kind: 'Restante' },
  ].filter(Boolean)
}

export const summarize = (items, method) => {
  const entries = items
    .flatMap(entriesOf)
    .filter((entry) => method === 'all' || entry.method === method)
  const byKind = (kind) => sum(entries.filter((entry) => entry.kind === kind))
  const byMethod = (id) => sum(entries.filter((entry) => entry.method === id))

  return {
    total: sum(entries),
    deposits: byKind('Sinal'),
    rests: byKind('Restante'),
    byMethod: Object.fromEntries(Object.keys(METHOD_LABEL).map((id) => [id, byMethod(id)])),
    count: items.filter((item) => entriesOf(item).length).length,
    unpaid: items.filter((item) => !entriesOf(item).length).length,
  }
}

export const closingText = ({ name, title, summary }) =>
  [
    `Fechamento, ${name}`,
    title,
    '',
    `Atendimentos: ${summary.count}`,
    `Total recebido: ${formatPrice(summary.total)}`,
    ...Object.entries(METHOD_LABEL).map(
      ([id, label]) => `${label}: ${formatPrice(summary.byMethod[id])}`,
    ),
    '',
    `Sinais: ${formatPrice(summary.deposits)}`,
    `Restante: ${formatPrice(summary.rests)}`,
  ].join('\n')
