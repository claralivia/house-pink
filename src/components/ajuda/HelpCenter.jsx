import { useState } from 'react'
import { HELP_MODULES } from '../../data/help.js'
import { useSeenLessons } from '../../hooks/useSeenLessons.js'
import AppButton from '../app/AppButton.jsx'
import BackButton from '../app/BackButton.jsx'
import Icon from '../app/Icon.jsx'
import LessonVideo from './LessonVideo.jsx'

const HERO_LABEL = { pro: 'Seu curso', client: 'Guia rápido' }

const finishLabel = (next, done) => {
  if (!next) return 'Já vi, voltar às aulas'
  return done ? 'Próxima aula' : 'Já vi, próxima aula'
}

function Progress({ value, total }) {
  return (
    <div
      className="app-course-bar"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax={total}
      aria-valuenow={value}
    >
      <span style={{ width: `${(value / total) * 100}%` }} />
    </div>
  )
}

export default function HelpCenter({ audience, initialLesson }) {
  const modules = HELP_MODULES[audience]
  const lessons = modules.flatMap((module) => module.lessons)
  const { seen, mark, unmark } = useSeenLessons(audience)
  const [openId, setOpenId] = useState(initialLesson ?? null)

  const open = (id) => {
    setOpenId(id)
    window.scrollTo({ top: 0 })
  }
  const lesson = lessons.find(({ id }) => id === openId)

  if (lesson) {
    const position = lessons.indexOf(lesson)
    const previous = lessons[position - 1]
    const next = lessons[position + 1]
    const done = seen.includes(lesson.id)

    const finish = () => {
      mark(lesson.id)
      if (next) open(next.id)
      else open(null)
    }

    return (
      <>
        <BackButton onClick={() => open(null)}>Todas as aulas</BackButton>

        <div className="app-course-nav">
          <button
            type="button"
            aria-label="Aula anterior"
            disabled={!previous}
            onClick={() => open(previous.id)}
          >
            <Icon name="chevron-left" />
          </button>
          <span>
            Aula {position + 1} de {lessons.length}
          </span>
          <button
            type="button"
            aria-label="Próxima aula"
            disabled={!next}
            onClick={() => open(next.id)}
          >
            <Icon name="chevron-right" />
          </button>
        </div>
        <Progress value={position + 1} total={lessons.length} />

        <h2 className="app-headline app-course-title">{lesson.title}</h2>
        {lesson.video ? <LessonVideo audience={audience} file={lesson.video} /> : null}

        <section className="app-course-steps">
          <h3 className="app-label">Passo a passo</h3>
          <ol>
            {lesson.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <div className="app-actions app-spaced">
          <AppButton full onClick={finish}>
            {finishLabel(next, done)}
          </AppButton>
          {done ? (
            <AppButton variant="ghost" full onClick={() => unmark(lesson.id)}>
              Marcar como não vista
            </AppButton>
          ) : null}
        </div>
      </>
    )
  }

  const seenCount = lessons.filter(({ id }) => seen.includes(id)).length
  const nextLesson = lessons.find(({ id }) => !seen.includes(id))
  const heroAction = () => {
    if (!nextLesson) return 'Rever desde o começo'
    return seenCount ? `Continuar: ${nextLesson.title}` : 'Começar pela primeira aula'
  }

  return (
    <>
      <section className="app-course-hero">
        <p className="app-step">{HERO_LABEL[audience]}</p>
        <p className="app-course-count">
          <b>{seenCount}</b> de {lessons.length} aulas vistas
        </p>
        <Progress value={seenCount} total={lessons.length} />
        <AppButton full onClick={() => open((nextLesson ?? lessons[0]).id)}>
          {heroAction()}
        </AppButton>
      </section>

      {modules.map((module) => (
        <section key={module.id}>
          <h2 className="app-label">{module.title}</h2>
          <div className="app-group">
            {module.lessons.map(({ id, title, summary, video }) => {
              const done = seen.includes(id)
              return (
                <button key={id} type="button" className="app-course-row" onClick={() => open(id)}>
                  <span className={`app-course-badge${done ? ' done' : ''}`}>
                    {done ? <Icon name="check" /> : lessons.findIndex((item) => item.id === id) + 1}
                  </span>
                  <span className="app-course-text">
                    <span className="app-item-name">{title}</span>
                    <span className="app-item-meta">{summary}</span>
                  </span>
                  {video ? <span className="app-course-tag">Vídeo</span> : null}
                  <Icon name="chevron-right" />
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}
