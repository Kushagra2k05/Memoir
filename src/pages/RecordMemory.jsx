import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSpeechRecognition from '../hooks/useSpeechRecognition.jsx'
import { useMemoir } from '../context/MemoirContext.jsx'

function formatTimer(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

export default function RecordMemory() {
  const navigate = useNavigate()
  const { saveTranscript } = useMemoir()
  const { supported, listening, transcript, timer, start, stop, reset } = useSpeechRecognition()
  const [recording, setRecording] = useState(false)
  const recordingLabel = recording ? 'Recording now' : 'Ready to capture memory'
  const waveformBars = useMemo(() => Array.from({ length: 14 }), [])

  const handleMicClick = () => {
    if (!recording) {
      start()
      setRecording(true)
      return
    }
    stop()
    setRecording(false)
    saveTranscript(transcript)
    navigate('/generating')
  }

  const handleReset = () => {
    reset()
    setRecording(false)
  }

  return (
    <main className="record-page">
      <section className="section record-intro">
        <div className="page-header">
          <p className="eyebrow">Memory Studio</p>
          <h1>Tell me about the happiest birthday you remember.</h1>
          <p className="subtext">
            Speak from the heart. Memoir listens, captures the warmth of your voice, and brings the moment to life with a living transcript.
          </p>
        </div>
      </section>

      <section className="record-stage">
        <motion.button
          className={`mic-circle ${recording ? 'recording' : ''}`}
          onClick={handleMicClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
        >
          <span className="mic-icon">🎙️</span>
        </motion.button>

        <div className="record-status">
          <strong>{recordingLabel}</strong>
          <span>{formatTimer(timer)}</span>
        </div>

        <div className="waveform" aria-hidden="true">
          {waveformBars.map((_, index) => (
            <span key={index} style={{ height: `${20 + (index % 6) * 8}px` }} />
          ))}
        </div>

        <div className="transcript-panel">
          <p className="transcript-title">Transcript</p>
          <p className="transcript-copy">
            {supported ? transcript || 'Your words will appear here once you speak.' : 'Your browser does not support speech recognition. Please use Chrome or Edge.'}
          </p>
        </div>

        <div className="text-actions">
          <button type="button" className="text-action" onClick={handleReset}>
            Reset Recording →
          </button>
          <button type="button" className="text-action" onClick={handleMicClick}>
            {recording ? 'Stop Recording →' : 'Start Recording →'}
          </button>
        </div>
      </section>
    </main>
  )
}
