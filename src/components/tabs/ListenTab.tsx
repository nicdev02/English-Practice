import { useState, useCallback, useMemo, useRef } from 'react'
import type { Lesson, LessonAudio, SpeechMark } from '../../types/lesson'
import { AudioPlayer } from '../AudioPlayer'
import type { AudioPlayerHandle } from '../AudioPlayer'

type SpeakerFilter = 'both' | 'A' | 'B'

interface Props {
  lesson: Lesson
  audio: LessonAudio | null
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9']/g, '')
}

// Maps each speech mark index to its displayed-word index.
// Speech marks for words not shown (e.g. speaker labels sent to Polly) get -1.
// Polly splits underscore-joined identifiers (e.g. df_income_filtered → df_, income_, filtered),
// so consecutive marks with trailing _ are accumulated before matching.
function buildMarkToWordIdx(marks: SpeechMark[], displayedWords: string[]): number[] {
  const result = new Array(marks.length).fill(-1)
  let wordPtr = 0
  let i = 0
  while (i < marks.length && wordPtr < displayedWords.length) {
    while (wordPtr < displayedWords.length && normalize(displayedWords[wordPtr]) === '') {
      wordPtr++
    }
    if (wordPtr >= displayedWords.length) break
    let combined = marks[i].value
    let j = i
    while (combined.endsWith('_') && j + 1 < marks.length) {
      j++
      combined += marks[j].value
    }
    if (normalize(combined) === normalize(displayedWords[wordPtr])) {
      result[i] = wordPtr
      i = j + 1
      wordPtr++
    } else {
      i++
    }
  }
  return result
}

export function ListenTab({ lesson, audio }: Props) {
  const [activeWordIdx, setActiveWordIdx] = useState(-1)
  const [speakerFilter, setSpeakerFilter] = useState<SpeakerFilter>('both')
  const audioPlayerRef = useRef<AudioPlayerHandle>(null)

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

  const wordToMarkTime = useMemo(() => {
    if (!audio?.speechMarks) return []
    const result: number[] = []
    audio.speechMarks.forEach((mark, i) => {
      const wordIdx = markToWordIdx[i]
      if (wordIdx !== -1) result[wordIdx] = mark.time
    })
    return result
  }, [audio, markToWordIdx])

  const handleWordClick = useCallback(
    (wordIdx: number) => {
      const timeMs = wordToMarkTime[wordIdx]
      if (timeMs == null) return
      audioPlayerRef.current?.seek(timeMs / 1000)
      audioPlayerRef.current?.play()
    },
    [wordToMarkTime]
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
          <p className="no-audio-box__title">No audio available</p>
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
          className={`listen-word${activeWordIdx === currentIdx ? ' listen-word--active' : ''}${audio ? ' listen-word--clickable' : ''}`}
          onClick={audio ? () => handleWordClick(currentIdx) : undefined}
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
        <AudioPlayer ref={audioPlayerRef} src={audio.audioUrl} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
      </div>
    </div>
  )
}
