import { useState } from 'react'
import type { Lesson } from '../../types/lesson'

type View = 'original' | 'wordForWord' | 'translation'

interface Props {
  lesson: Lesson
}

export function ReadTab({ lesson }: Props) {
  const [view, setView] = useState<View>('original')

  return (
    <div className="read-tab">
      <div className="view-toggle" role="group" aria-label="Text view">
        <button
          className={`view-toggle__btn ${view === 'original' ? 'view-toggle__btn--active' : ''}`}
          onClick={() => setView('original')}
        >
          Original
        </button>
        <button
          className={`view-toggle__btn ${view === 'wordForWord' ? 'view-toggle__btn--active' : ''}`}
          onClick={() => setView('wordForWord')}
        >
          Wort für Wort
        </button>
        <button
          className={`view-toggle__btn ${view === 'translation' ? 'view-toggle__btn--active' : ''}`}
          onClick={() => setView('translation')}
        >
          Übersetzung
        </button>
      </div>

      {view === 'original' && (
        <div className="dialog">
          {lesson.lines.map((line, i) => (
            <div key={i} className={`dialog-line dialog-line--${line.speaker.toLowerCase()}`}>
              <span className="dialog-line__speaker">{line.speakerName}</span>
              <p className="dialog-line__text">{line.text}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'wordForWord' && (
        <div className="dialog">
          <p className="read-tab__hint">
            Wortwörtliche Übersetzung nach der Birkenbihl-Methode — bewusst holprig, um die englische Satzstruktur sichtbar zu machen.
          </p>
          {lesson.decoded.map((line, i) => (
            <div key={i} className={`dialog-line dialog-line--${line.speaker.toLowerCase()}`}>
              <div className="dialog-line__pair">
                <p className="dialog-line__original">{line.original}</p>
                <p className="dialog-line__decoded">{line.wordForWord}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'translation' && (
        <div className="dialog">
          {lesson.cleanTranslation.map((line, i) => {
            const original = lesson.lines[i]
            return (
              <div key={i} className={`dialog-line dialog-line--${line.speaker.toLowerCase()}`}>
                <span className="dialog-line__speaker">
                  {original?.speakerName ?? line.speaker}
                </span>
                <p className="dialog-line__text">{line.text}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
