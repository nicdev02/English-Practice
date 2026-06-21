import type { Lesson } from '../types/lesson'
import lesson01 from './lessons/01-messy-dataset.json'
import lesson02 from './lessons/02-explaining-project.json'
import lesson03 from './lessons/03-weekend-plans.json'

export const lessons: Lesson[] = [
  lesson01 as Lesson,
  lesson02 as Lesson,
  lesson03 as Lesson,
]
