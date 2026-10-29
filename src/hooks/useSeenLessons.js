import { useState } from 'react'

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

// Aulas já vistas ficam só neste aparelho: é um lembrete, não um dado importante.
export function useSeenLessons(audience) {
  const key = `house-pink-help-${audience}`
  const [seen, setSeen] = useState(() => read(key))

  const toggle = (id) => {
    const next = seen.includes(id) ? seen.filter((item) => item !== id) : [...seen, id]
    setSeen(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // sem armazenamento (janela anônima): a marcação vale só até fechar a página
    }
  }

  return { seen, toggle }
}
