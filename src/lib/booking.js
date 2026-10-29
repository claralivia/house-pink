// Uma sessão pode ter um serviço de cada profissional, ao mesmo tempo: dura o maior tempo.
export const sessionMinutes = (choices) =>
  Math.max(0, ...choices.map(({ type }) => type.duration_minutes))

export const proNames = (choices) => choices.map(({ pro }) => pro.first).join(' e ')
