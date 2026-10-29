const OPEN = ['pending', 'confirmed']

export const STATUS_LABEL = {
  pending: 'Aguardando confirmação',
  confirmed: 'Confirmado',
  done: 'Concluído',
  cancelled: 'Cancelado',
}

export const isUpcoming = ({ starts_at, status }) =>
  OPEN.includes(status) && new Date(starts_at) >= new Date()

export const split = (appointments) => {
  const upcoming = appointments
    .filter(isUpcoming)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
  const past = appointments.filter((appointment) => !isUpcoming(appointment))
  return { upcoming, past }
}

export const lastWorth = (past) => past.find(({ status }) => status !== 'cancelled') ?? null

export const spending = (appointments, month) => {
  const done = appointments.filter(
    ({ status, starts_at }) => status === 'done' && starts_at.startsWith(month),
  )
  return {
    cents: done.reduce((total, item) => total + (item.price_cents ?? 0), 0),
    count: done.length,
  }
}

export const totalDone = (appointments) => {
  const done = appointments.filter(({ status }) => status === 'done')
  return {
    cents: done.reduce((total, item) => total + (item.price_cents ?? 0), 0),
    count: done.length,
  }
}
