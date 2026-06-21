import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

interface Props {
  src: string
  onTimeUpdate?: (timeMs: number) => void
  onEnded?: () => void
}

export interface AudioPlayerHandle {
  seek: (timeS: number) => void
  play: () => void
}

export const AudioPlayer = forwardRef<AudioPlayerHandle, Props>(function AudioPlayer(
  { src, onTimeUpdate, onEnded },
  ref
) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const rafRef = useRef<number>(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)

  const tick = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const ms = audio.currentTime * 1000
    setCurrentTime(audio.currentTime)
    onTimeUpdate?.(ms)
    if (!audio.paused) {
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [onTimeUpdate])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useImperativeHandle(ref, () => ({
    seek(timeS: number) {
      const audio = audioRef.current
      if (!audio) return
      audio.currentTime = timeS
      setCurrentTime(timeS)
      onTimeUpdate?.(timeS * 1000)
    },
    play() {
      audioRef.current?.play()
    },
  }))

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  function handlePlay() {
    setPlaying(true)
    rafRef.current = requestAnimationFrame(tick)
  }

  function handlePause() {
    setPlaying(false)
    cancelAnimationFrame(rafRef.current)
  }

  function handleEnded() {
    setPlaying(false)
    cancelAnimationFrame(rafRef.current)
    onEnded?.()
  }

  function handleLoaded() {
    setDuration(audioRef.current?.duration ?? 0)
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const t = Number(e.target.value)
    audio.currentTime = t
    setCurrentTime(t)
    onTimeUpdate?.(t * 1000)
  }

  function handleRate(newRate: number) {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = newRate
    setRate(newRate)
  }

  function fmt(s: number) {
    if (!isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoaded}
        preload="metadata"
      />

      <div className="audio-player__controls">
        <button
          className="audio-player__play-btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <div className="audio-player__progress-wrap">
          <span className="audio-player__time">{fmt(currentTime)}</span>
          <input
            className="audio-player__progress"
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek"
          />
          <span className="audio-player__time">{fmt(duration)}</span>
        </div>

        <div className="audio-player__rate">
          {([0.75, 1] as const).map((r) => (
            <button
              key={r}
              className={`audio-player__rate-btn ${rate === r ? 'audio-player__rate-btn--active' : ''}`}
              onClick={() => handleRate(r)}
            >
              {r}×
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})
