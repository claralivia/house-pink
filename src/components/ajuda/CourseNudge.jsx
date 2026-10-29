import { HELP_MODULES } from '../../data/help.js'
import { useSeenLessons } from '../../hooks/useSeenLessons.js'
import Icon from '../app/Icon.jsx'

const lessons = HELP_MODULES.pro.flatMap((module) => module.lessons)

// Atalho na agenda: some quando a profissional já viu todas as aulas.
export default function CourseNudge({ onOpen }) {
  const { seen } = useSeenLessons('pro')
  const count = lessons.filter(({ id }) => seen.includes(id)).length

  if (count === lessons.length) return null

  return (
    <button type="button" className="app-nudge" onClick={onOpen}>
      <span>
        <span className="app-item-name">Aprenda a usar o painel</span>
        <span className="app-item-meta">
          {count} de {lessons.length} aulas vistas
        </span>
      </span>
      <Icon name="chevron-right" />
    </button>
  )
}
