import { useState } from 'react'

const STEPS = [
  {
    day: 'Tag 1',
    label: 'Dekodieren',
    desc: 'Dialog lesen — die Birkenbihl-Übersetzung (Wort-für-Wort) danebenlegen und die Satzstruktur aufnehmen.',
  },
  {
    day: 'Tag 1–2',
    label: 'Aktives Hören',
    desc: 'Polly-Audio anhören und dabei den Originaltext mitlesen. Aussprache und Rhythmus verinnerlichen.',
  },
  {
    day: 'Tag 2–4',
    label: 'Passives Hören',
    desc: 'Audio im Hintergrund laufen lassen — beim Kochen, Spazieren, Putzen. Kein aktives Mitlesen nötig.',
  },
  {
    day: 'Ab Tag 3',
    label: 'Shadowing',
    desc: 'Audio abspielen und leicht zeitversetzt mitsprechen — nicht synchron, sondern mit kleinem Abstand.',
  },
  {
    day: 'Tag 5',
    label: 'Frei sprechen',
    desc: 'Ohne Audio eine Rolle aus dem Gedächtnis nachstellen. Fehler sind erwünscht — es geht ums Fließen.',
  },
]

export function RoutineBox() {
  const [open, setOpen] = useState(false)

  return (
    <div className="routine-box">
      <button
        className="routine-box__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>Übungsroutine (5 Tage)</span>
        <svg
          className={`routine-box__chevron ${open ? 'routine-box__chevron--open' : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="routine-box__body">
          <ol className="routine-steps">
            {STEPS.map((step, i) => (
              <li key={i} className="routine-step">
                <div className="routine-step__header">
                  <span className="routine-step__day">{step.day}</span>
                  <span className="routine-step__label">{step.label}</span>
                </div>
                <p className="routine-step__desc">{step.desc}</p>
              </li>
            ))}
          </ol>

          <div className="routine-box__tip">
            <p>
              <strong>Zur Sprechhemmung:</strong> Wenn dir beim freien Sprechen ein Wort fehlt, sag laut{' '}
              <em>„ähm, what's the word —"</em> und mach weiter. Genau dieses Weiterreden trotz Lücke ist die eigentliche Zielfertigkeit, nicht Fehlerfreiheit.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
