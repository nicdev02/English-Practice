import type { Lesson } from '../types/lesson'

interface Props {
  lessons: Lesson[]
  onSelect: (lesson: Lesson) => void
}

const CATEGORIES = [
  { title: 'Lektion 1', subtitle: 'Data Science', tag: 'Uni / Data Science' },
  { title: 'Lektion 2', subtitle: 'Konferenz', tag: 'Konferenz' },
  { title: 'Lektion 3', subtitle: 'Alltag', tag: 'Alltag' },
]

export function LessonList({ lessons, onSelect }: Props) {
  return (
    <div className="lesson-list-page">
      <header className="site-header">
        <p className="site-eyebrow">Personal Language Practice</p>
        <h1 className="site-title">English Speaking Practice</h1>
        <p className="site-subtitle">
          Speak English, you must · Fear not the words, hmm
        </p>
      </header>

      <main className="lesson-list">
        {CATEGORIES.map((cat) => {
          const catLessons = lessons.filter((l) => l.tag === cat.tag)
          if (catLessons.length === 0) return null
          return (
            <section key={cat.tag} className="lesson-category">
              <div className="lesson-category__header">
                <p className="lesson-category__number">{cat.title}</p>
                <h2 className="lesson-category__label">{cat.subtitle}</h2>
              </div>
              <div className="lesson-category__cards">
                {catLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} onSelect={onSelect} />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}

function LessonCard({ lesson, onSelect }: { lesson: Lesson; onSelect: (l: Lesson) => void }) {
  const locked = lesson.locked === true

  return (
    <article
      className={`lesson-card ${locked ? 'lesson-card--locked' : ''}`}
      onClick={() => !locked && onSelect(lesson)}
      role={locked ? undefined : 'button'}
      tabIndex={locked ? undefined : 0}
      onKeyDown={(e) => {
        if (!locked && (e.key === 'Enter' || e.key === ' ')) onSelect(lesson)
      }}
      aria-disabled={locked}
    >
      <div className="lesson-card__body">
        <p className="lesson-card__eyebrow">{lesson.eyebrow}</p>
        <h2 className="lesson-card__title">{lesson.title}</h2>
      </div>
      {locked && (
        <div className="lesson-card__lock" aria-label="Coming soon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Coming soon</span>
        </div>
      )}
    </article>
  )
}
