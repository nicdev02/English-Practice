import { useRef, useState } from 'react'
import type { SpeechMark } from '../../types/lesson'
import { useAudioStorage } from '../../hooks/useAudioStorage'

interface Props {
  lessonId: string
}

export function SetupTab({ lessonId }: Props) {
  const { audio, save, clear } = useAudioStorage(lessonId)
  const [url, setUrl] = useState(audio?.audioUrl ?? '')
  const [marksRaw, setMarksRaw] = useState(
    audio?.speechMarks ? audio.speechMarks.map((m) => JSON.stringify(m)).join('\n') : ''
  )
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setMarksRaw(text.trim())
    }
    reader.readAsText(file)
  }

  function parseMarks(): SpeechMark[] | null {
    const lines = marksRaw.trim().split('\n').filter((l) => l.trim())
    const marks: SpeechMark[] = []
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line.trim())
        if (
          typeof parsed.time !== 'number' ||
          typeof parsed.start !== 'number' ||
          typeof parsed.end !== 'number' ||
          typeof parsed.value !== 'string'
        ) {
          throw new Error(`Missing required fields in: ${line}`)
        }
        marks.push({ time: parsed.time, type: 'word', start: parsed.start, end: parsed.end, value: parsed.value })
      } catch (e) {
        setError(`Invalid JSON on line: "${line.slice(0, 60)}…"\n${e instanceof Error ? e.message : e}`)
        return null
      }
    }
    return marks
  }

  function handleConnect() {
    setError(null)
    setSaved(false)

    if (!url.trim()) {
      setError('Please enter an audio URL.')
      return
    }
    if (!marksRaw.trim()) {
      setError('Please upload or paste the Speech Marks JSON.')
      return
    }

    const marks = parseMarks()
    if (!marks) return

    save(url.trim(), marks)
    setSaved(true)
  }

  function handleClear() {
    clear()
    setUrl('')
    setMarksRaw('')
    setFileName(null)
    setSaved(false)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="setup-tab">
      <h3 className="setup-tab__heading">Connect audio for this lesson</h3>
      <p className="setup-tab__description">
        Generate audio with Amazon Polly (Neural engine, English voice, Speech Marks type: <em>word</em>), then add the MP3 and Speech Marks below. This data is saved in your browser only — not in the lesson file.
      </p>

      <div className="form-field">
        <label htmlFor="audio-url" className="form-label">MP3 URL</label>
        <p className="form-label__hint" style={{ marginBottom: '0.5rem' }}>
          Place your MP3 in <code>public/audio/</code> and use the path <code>audio/lesson-01.mp3</code>, or paste any external URL.
        </p>
        <input
          id="audio-url"
          type="text"
          className="form-input"
          placeholder="audio/lesson-01.mp3  or  https://…/lesson-01.mp3"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">
          Speech Marks JSON{' '}
          <span className="form-label__hint">(one JSON object per line, as exported by Polly)</span>
        </label>

        <div className="file-upload">
          <input
            ref={fileInputRef}
            id="speech-marks-file"
            type="file"
            accept=".json"
            className="file-upload__input"
            onChange={handleFileUpload}
          />
          <label htmlFor="speech-marks-file" className="file-upload__label">
            {fileName ? `✓ ${fileName}` : 'Choose .json file'}
          </label>
          {fileName && (
            <button
              className="file-upload__clear"
              onClick={() => {
                setFileName(null)
                setMarksRaw('')
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              ✕
            </button>
          )}
        </div>

        <p className="form-label__hint" style={{ margin: '0.5rem 0' }}>or paste manually:</p>

        <textarea
          id="speech-marks"
          className="form-input form-input--textarea"
          rows={6}
          placeholder={'{"time":373,"type":"word","start":5,"end":8,"value":"had"}\n{"time":490,"type":"word","start":9,"end":12,"value":"the"}'}
          value={marksRaw}
          onChange={(e) => {
            setMarksRaw(e.target.value)
            if (e.target.value !== marksRaw) setFileName(null)
          }}
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="setup-tab__error" role="alert">
          <pre>{error}</pre>
        </div>
      )}

      {saved && (
        <div className="setup-tab__success" role="status">
          Audio connected. Switch to the Listen &amp; follow tab to try it.
        </div>
      )}

      <div className="setup-tab__actions">
        <button className="btn btn--primary" onClick={handleConnect}>
          Connect this audio
        </button>
        {audio && (
          <button className="btn btn--ghost" onClick={handleClear}>
            Remove audio
          </button>
        )}
      </div>

      {audio && (
        <p className="setup-tab__status">
          Currently connected: <span className="setup-tab__url">{audio.audioUrl}</span>
          {' '}({audio.speechMarks.length} speech marks)
        </p>
      )}
    </div>
  )
}
