import { useState, useRef, useCallback } from 'react'
import type { Lesson, LessonAudio } from '../../types/lesson'
import { AudioPlayer } from '../AudioPlayer'

type SpeakerFilter = 'both' | 'A' | 'B'

interface Props {
  lesson: Lesson
  audio: LessonAudio | null
  onGoToSetup: () => void
}

export function ListenTab({ lesson, audio, onGoToSetup }: Props) {
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1)
  const [speakerFilter, setSpeakerFilter] = useState<SpeakerFilter>('both')
  const wordSpansRef = useRef<(HTMLSpanElement | null)[]>([])

  const handleTimeUpdate = useCallback(
    (timeMs: number) => {
      if (!audio?.speechMarks) return
      const marks = audio.speechMarks
      let idx = -1
      for (let i = 0; i < marks.length; i++) {
        if (marks[i].time <= timeMs) idx = i
        else break
      }
      setActiveWordIdx(idx)
    },
    [audio]
  )

  const handleEnded = useCallback(() => {
    setActiveWordIdx(-1)
  }, [])

  if (!audio) {
    return (
      <div className="listen-tab__no-audio">
        <div className="no-audio-box">
          <p className="no-audio-box__title">No audio connected yet</p>
          <p className="no-audio-box__body">
            Generate audio with Amazon Polly and paste the URL + Speech Marks in the Setup tab.
          </p>
          <button className="btn btn--primary" onClick={onGoToSetup}>
            Go to Setup
          </button>
        </div>
      </div>
    )
  }

  const speakerNames = {
    A: lesson.lines.find((l) => l.speaker === 'A')?.speakerName ?? 'A',
    B: lesson.lines.find((l) => l.speaker === 'B')?.speakerName ?? 'B',
  }

  const wordElements: React.ReactNode[] = []
  let wordIdx = 0
  let charPos = 0

  lesson.lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) {
      wordElements.push(<span key={`space-${lineIdx}`}> </span>)
      charPos++
    }

    const words = line.text.split(/(\s+)/)
    const isDimmed = speakerFilter !== 'both' && line.speaker !== speakerFilter

    words.forEach((chunk, chunkIdx) => {
      if (/^\s+$/.test(chunk)) {
        wordElements.push(<span key={`ws-${lineIdx}-${chunkIdx}`}>{chunk}</span>)
        charPos += chunk.length
        return
      }

      const currentWordIdx = wordIdx
      const isHighlighted = activeWordIdx === currentWordIdx

      wordElements.push(
        <span
          key={`w-${lineIdx}-${chunkIdx}`}
          ref={(el) => { wordSpansRef.current[currentWordIdx] = el }}
          className={[
            'listen-word',
            isHighlighted ? 'listen-word--active' : '',
            isDimmed ? 'listen-word--dimmed' : '',
          ].join(' ')}
        >
          {chunk}
        </span>
      )
      charPos += chunk.length
      wordIdx++
    })
  })

  void charPos  // consumed while building wordElements

  return (
    <div className="listen-tab">
      <div className="listen-tab__speaker-filter">
        <span className="listen-tab__filter-label">Show:</span>
        {(['both', 'A', 'B'] as SpeakerFilter[]).map((f) => (
          <button
            key={f}
            className={`filter-btn ${speakerFilter === f ? 'filter-btn--active' : ''}`}
            onClick={() => setSpeakerFilter(f)}
          >
            {f === 'both' ? 'Both' : speakerNames[f]}
          </button>
        ))}
      </div>

      <div className="listen-tab__text" aria-live="polite" aria-label="Transcript">
        {wordElements}
      </div>

      <div className="listen-tab__player">
        <AudioPlayer
          src={audio.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>
    </div>
  )
}
