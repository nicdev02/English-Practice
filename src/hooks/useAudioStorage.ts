import { useState, useCallback } from 'react'
import type { LessonAudio, SpeechMark } from '../types/lesson'

function storageKey(lessonId: string) {
  return `lesson-audio-${lessonId}`
}

export function useAudioStorage(lessonId: string) {
  const load = useCallback((): LessonAudio | null => {
    try {
      const raw = localStorage.getItem(storageKey(lessonId))
      if (!raw) return null
      return JSON.parse(raw) as LessonAudio
    } catch {
      return null
    }
  }, [lessonId])

  const [audio, setAudio] = useState<LessonAudio | null>(load)

  const save = useCallback(
    (audioUrl: string, speechMarks: SpeechMark[]) => {
      const data: LessonAudio = { audioUrl, speechMarks }
      localStorage.setItem(storageKey(lessonId), JSON.stringify(data))
      setAudio(data)
    },
    [lessonId]
  )

  const clear = useCallback(() => {
    localStorage.removeItem(storageKey(lessonId))
    setAudio(null)
  }, [lessonId])

  return { audio, save, clear }
}
