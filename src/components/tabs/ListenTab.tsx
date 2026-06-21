import { useState, useCallback, useMemo } from 'react'
import type { Lesson, LessonAudio, SpeechMark } from '../../types/lesson'
import { AudioPlayer } from '../AudioPlayer'

type SpeakerFilter = 'both' | 'A' | 'B'

interface Props {
  lesson: Lesson
  audio: LessonAudio | null
  onGoToSetup: () => void
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9']/g, '')
}

// Maps each speech mark index to its displayed-word index.
// Speech marks for words not shown (e.g. speaker labels sent to Polly) get -1.
function buildMarkToWordIdx(marks: SpeechMark[], displayedWords: string[]): number[] {
  const result = new Array(marks.length).fill(-1)
  let wordPtr = 0
  for (let i = 0; i < marks.length && wordPtr < displayedWords.length; i++) {
    if (normalize(marks[i].value) === normalize(displayedWords[wordPtr])) {
      result[i] = wordPtr
      wordPtr++
    }
  }
  return result
}

export function ListenTab({ lesson, audio, onGoToSetup }: Props) {
  const [activeWordIdx, setActiveWordIdx] = useState(-1)
  const [speakerFilter, setSpeakerFilter] = useState<SpeakerFilter>('both')

  const speakerNames = {
    A: lesson.lines.find((l) => l.speaker === 'A')?.speakerName ?? 'A',
    B: lesson.lines.find((l) => l.speaker === 'B')?.speakerName ?? 'B',
  }

  const allWords = useMemo(() => {
    const words: string[] = []
    lesson.lines.forEach((line) => {
      line.text.split(/\s+/).forEach((w) => { if (w) words.push(w) })
    })
    return words
  }, [lesson])

  const markToWordIdx = useMemo(
    () => (audio?.speechMarks ? buildMarkToWordIdx(audio.speechMarks, allWords) : []),
    [audio, allWords]
  )

  const handleTimeUpdate = useCallback(
    (timeMs: number) => {
      if (!audio?.speechMarks?.length) return
      const marks = audio.speechMarks
      let lastMark = -1
      for (let i = 0; i < marks.length; i++) {
        if (marks[i].time <= timeMs) lastMark = i
        else break
      }
      if (lastMark === -1) { setActiveWordIdx(-1); return }
      for (let i = lastMark; i >= 0; i--) {
        if (markToWordIdx[i] !== -1) {
          setActiveWordIdx(markToWordIdx[i])
          return
        }
      }
      setActiveWordIdx(-1)
    },
    [audio, markToWordIdx]
  )

  const handleEnded = useCallback(() => setActiveWordIdx(-1), [])

  if (!audio) {
    return (
      <div className="listen-tab__no-audio">
        <div className="no-audio-box">
          <p className="no-audio-box__title">No audio connected yet</p>
          <p className="no-audio-box__body">
            Generate audio with Amazon Polly and add the URL + Speech Marks in the Setup tab.
          </p>
          <button className="btn btn--primary" onClick={onGoToSetup}>
            Go to Setup
          </button>
        </div>
      </div>
    )
  }

  let wordIdx = 0
  const lineElements = lesson.lines.map((line, lineIdx) => {
    const isDimmed = speakerFilter !== 'both' && line.speaker !== speakerFilter
    const wordSpans = line.text.split(/(\s+)/).map((chunk, chunkIdx) => {
      if (/^\s+$/.test(chunk) || chunk === '') {
        return <span key={`ws-${lineIdx}-${chunkIdx}`}>{chunk}</span>
      }
      const currentIdx = wordIdx++
      return (
        <span
          key={`w-${lineIdx}-${chunkIdx}`}
          className={`listen-word${activeWordIdx === currentIdx ? ' listen-word--active' : ''}`}
        >
          {chunk}
        </span>
      )
    })

    return (
      <div
        key={lineIdx}
        className={`listen-line listen-line--${line.speaker.toLowerCase()}${isDimmed ? ' listen-line--dimmed' : ''}`}
      >
        <span className="listen-line__speaker">{line.speakerName}</span>
        <p className="listen-line__text">{wordSpans}</p>
      </div>
    )
  })

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

      <div className="listen-tab__lines" aria-live="polite" aria-label="Transcript">
        {lineElements}
      </div>

      <div className="listen-tab__player">
        <AudioPlayer src={audio.audioUrl} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
      </div>
    </div>
  )
}
