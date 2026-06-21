import { useState } from 'react'
import type { Lesson } from './types/lesson'
import { lessons } from './data/lessons'
import { LessonList } from './components/LessonList'
import { LessonDetail } from './components/LessonDetail'

export default function App() {
  const [selected, setSelected] = useState<Lesson | null>(null)

  if (selected) {
    return (
      <div className="app">
        <LessonDetail lesson={selected} onBack={() => setSelected(null)} />
      </div>
    )
  }

  return (
    <div className="app">
      <LessonList lessons={lessons} onSelect={setSelected} />
    </div>
  )
}
