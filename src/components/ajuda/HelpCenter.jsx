import { useState } from 'react'
import { HELP_MODULES } from '../../data/help.js'
import { useSeenLessons } from '../../hooks/useSeenLessons.js'
import AppButton from '../app/AppButton.jsx'
import BackButton from '../app/BackButton.jsx'
import Icon from '../app/Icon.jsx'
import LessonVideo from './LessonVideo.jsx'

export default function HelpCenter({ audience, backLabel, onBack }) {
  const modules = HELP_MODULES[audience]
  const lessons = modules.flatMap((module) => module.lessons)
  const { seen, toggle } = useSeenLessons(audience)
  const [openId, setOpenId] = useState(null)
  const lesson = lessons.find(({ id }) => id === openId)
  const next = lesson ? lessons[lessons.indexOf(lesson) + 1] : null

  if (lesson) {
    const done = seen.includes(lesson.id)
    return (
      <>
        <BackButton onClick={() => setOpenId(null)}>Todas as aulas</BackButton>
        <h2 className="app-headline">{lesson.title}</h2>
        <p className="app-lead">{lesson.summary}</p>
        {lesson.video ? <LessonVideo audience={audience} file={lesson.video} /> : null}
        <ol className="app-steps-list app-lesson-steps">
          {lesson.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="app-actions app-spaced">
          <AppButton
            full
            variant={done ? 'secondary' : 'primary'}
            onClick={() => toggle(lesson.id)}
          >
            {done ? 'Aula vista. Toque para desmarcar' : 'Já vi esta aula'}
          </AppButton>
          {next ? (
            <AppButton
              full
              variant="secondary"
              onClick={() => {
                setOpenId(next.id)
                window.scrollTo({ top: 0 })
              }}
            >
              Próxima aula: {next.title}
            </AppButton>
          ) : null}
        </div>
      </>
    )
  }

  const seenCount = lessons.filter(({ id }) => seen.includes(id)).length

  return (
    <>
      {onBack ? <BackButton onClick={onBack}>{backLabel}</BackButton> : null}
      <p className="app-lead">
        {seenCount} de {lessons.length} aulas vistas
      </p>
      {modules.map((module) => (
        <section key={module.id}>
          <h2 className="app-label">{module.title}</h2>
          <div className="app-group">
            {module.lessons.map(({ id, title, summary }) => (
              <button key={id} type="button" className="app-item" onClick={() => setOpenId(id)}>
                <span>
                  <span className="app-item-name">{title}</span>
                  <span className="app-item-meta">{summary}</span>
                </span>
                <span className="app-item-end">
                  {seen.includes(id) ? <Icon name="check" className="app-lesson-seen" /> : null}
                  <Icon name="chevron-right" />
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
