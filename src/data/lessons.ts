import type { Lesson, SpeechMark } from '../types/lesson'
import lesson01 from './lessons/01-messy-dataset.json'
import lesson02 from './lessons/02-explaining-project.json'
import lesson03 from './lessons/03-weekend-plans.json'
import rawMarks01 from '../../public/speech-marks/speech_20260621140627971_word.marks?raw'

function parseMarks(raw: string): SpeechMark[] {
  return raw.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l) as SpeechMark)
}

export const lessons: Lesson[] = [
  {
    ...(lesson01 as Lesson),
    defaultAudio: {
      audioUrl: 'audio/speech_20260621140553933.mp3',
      speechMarks: parseMarks(rawMarks01),
    },
  },
  lesson02 as Lesson,
  lesson03 as Lesson,
]
