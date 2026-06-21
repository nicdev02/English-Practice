import type { Lesson, SpeechMark } from '../types/lesson'
import lesson01 from './lessons/01-messy-dataset.json'
import lesson02 from './lessons/02-explaining-project.json'
import lesson03 from './lessons/03-weekend-plans.json'
import lesson04 from './lessons/04-code-review.json'
import lesson05 from './lessons/05-canceling-plans.json'
import rawMarks01 from '../../public/speech-marks/speech_20260621152910590_v3.marks?raw'
import rawMarks02 from '../../public/speech-marks/speech_20260621154036967_lesson2.marks?raw'
import rawMarks03 from '../../public/speech-marks/speech_20260621160432134_lesson3.marks?raw'
import rawMarks04 from '../../public/speech-marks/speech_20260621162713499_lesson4.marks?raw'
import rawMarks05 from '../../public/speech-marks/speech_20260621164615381_landlord.marks?raw'

function parseMarks(raw: string): SpeechMark[] {
  return raw.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l) as SpeechMark)
}

export const lessons: Lesson[] = [
  {
    ...(lesson01 as Lesson),
    defaultAudio: {
      audioUrl: 'audio/speech_20260621152836485_v3.mp3',
      speechMarks: parseMarks(rawMarks01),
    },
  },
  {
    ...(lesson02 as Lesson),
    defaultAudio: {
      audioUrl: 'audio/speech_20260621154059087_lesson2.mp3',
      speechMarks: parseMarks(rawMarks02),
    },
  },
  {
    ...(lesson03 as Lesson),
    defaultAudio: {
      audioUrl: 'audio/speech_20260621160408683_lesson3.mp3',
      speechMarks: parseMarks(rawMarks03),
    },
  },
  {
    ...(lesson04 as Lesson),
    defaultAudio: {
      audioUrl: 'audio/speech_20260621162735997_lesson4.mp3',
      speechMarks: parseMarks(rawMarks04),
    },
  },
  {
    ...(lesson05 as Lesson),
    defaultAudio: {
      audioUrl: 'audio/speech_20260621164556508_landlord.mp3',
      speechMarks: parseMarks(rawMarks05),
    },
  },
]
