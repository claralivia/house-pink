const HOUR = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Fortaleza',
  hour: '2-digit',
  hour12: false,
})

const PERIODS = [
  { until: 12, text: 'Bom dia' },
  { until: 18, text: 'Boa tarde' },
  { until: 24, text: 'Boa noite' },
]

export const greetingNow = (now = new Date()) => {
  const hour = Number(HOUR.format(now)) % 24
  return PERIODS.find(({ until }) => hour < until).text
}
