export type Speaker = 'A' | 'B'

export interface DialogLine {
  speaker: Speaker
  speakerName: string
  text: string
}

export interface DecodedLine {
  speaker: Speaker
  original: string
  wordForWord: string
}

export interface TranslationLine {
  speaker: Speaker
  text: string
}

export interface VocabItem {
  en: string
  de: string
  note?: string
}

export interface SpeechMark {
  time: number
  type: 'word'
  start: number
  end: number
  value: string
}

export interface Lesson {
  id: string
  title: string
  eyebrow: string
  tag: string
  locked?: boolean
  lines: DialogLine[]
  decoded: DecodedLine[]
  cleanTranslation: TranslationLine[]
  vocab: VocabItem[]
  defaultAudio?: LessonAudio
}

export interface LessonAudio {
  audioUrl: string
  speechMarks: SpeechMark[]
}
