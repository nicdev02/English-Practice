import { useState } from 'react'
import type { Lesson } from '../types/lesson'
import { useAudioStorage } from '../hooks/useAudioStorage'
import { ReadTab } from './tabs/ReadTab'
import { ListenTab } from './tabs/ListenTab'
import { VocabTab } from './tabs/VocabTab'
import { SetupTab } from './tabs/SetupTab'
import { RoutineBox } from './RoutineBox'

type Tab = 'read' | 'listen' | 'vocab' | 'setup'

interface Props {
  lesson: Lesson
  onBack: () => void
}

export function LessonDetail({ lesson, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('read')
  const { audio, save, clear } = useAudioStorage(lesson.id)
  const effectiveAudio = audio ?? lesson.defaultAudio ?? null

  function goToSetup() {
    setTab('setup')
  }

  return (
    <div className="lesson-detail-page">
      <div className="lesson-detail-header">
        <button className="back-btn" onClick={onBack} aria-label="Back to lessons">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All lessons
        </button>
        <div className="lesson-detail-header__meta">
          <p className="lesson-detail-header__eyebrow">{lesson.eyebrow}</p>
          <h1 className="lesson-detail-header__title">{lesson.title}</h1>
          <span className="lesson-card__tag">{lesson.tag}</span>
        </div>
      </div>

      <RoutineBox />

      <nav className="tab-nav" role="tablist">
        {([
          { key: 'read', label: 'Read' },
          { key: 'listen', label: 'Listen & follow' },
          { key: 'vocab', label: 'Vocabulary' },
          { key: 'setup', label: 'Setup' },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={`tab-nav__btn ${tab === key ? 'tab-nav__btn--active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
            {key === 'listen' && !effectiveAudio && (
              <span className="tab-nav__badge" title="No audio connected">·</span>
            )}
          </button>
        ))}
      </nav>

      <div className="tab-panel" role="tabpanel">
        {tab === 'read' && <ReadTab lesson={lesson} />}
        {tab === 'listen' && (
          <ListenTab lesson={lesson} audio={effectiveAudio} onGoToSetup={goToSetup} />
        )}
        {tab === 'vocab' && <VocabTab lesson={lesson} />}
        {tab === 'setup' && (
          <SetupTab
            lessonId={lesson.id}
            audio={audio}
            defaultAudio={lesson.defaultAudio}
            save={save}
            clear={clear}
          />
        )}
      </div>
    </div>
  )
}
