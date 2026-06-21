import type { Lesson } from '../../types/lesson'

interface Props {
  lesson: Lesson
}

export function VocabTab({ lesson }: Props) {
  if (lesson.vocab.length === 0) {
    return <p className="empty-state">No vocabulary for this lesson yet.</p>
  }

  return (
    <div className="vocab-tab">
      <table className="vocab-table">
        <thead>
          <tr>
            <th>English</th>
            <th>Deutsch</th>
          </tr>
        </thead>
        <tbody>
          {lesson.vocab.map((item, i) => (
            <tr key={i}>
              <td className="vocab-table__en">{item.en}</td>
              <td className="vocab-table__de">{item.de}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
