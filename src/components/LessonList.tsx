import type { Lesson } from '../types/lesson'

interface Props {
  lessons: Lesson[]
  onSelect: (lesson: Lesson) => void
}

export function LessonList({ lessons, onSelect }: Props) {
  return (
    <div className="lesson-list-page">
      <header className="site-header">
        <p className="site-eyebrow">Personal Language Practice</p>
        <h1 className="site-title">English Speaking Practice</h1>
        <p className="site-subtitle">
          Birkenbihl method · Shadowing · Amazon Polly audio
        </p>
      </header>

      <main className="lesson-list">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onSelect={onSelect} />
        ))}
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
        <span className="lesson-card__tag">{lesson.tag}</span>
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
