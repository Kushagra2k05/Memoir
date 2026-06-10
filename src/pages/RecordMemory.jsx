import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAudioRecorder from '../hooks/useAudioRecorder.jsx'
import { uploadAudio } from '../services/apiClient.js'
import { useMemoir } from '../context/MemoirContext.jsx'

function formatTimer(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

export default function RecordMemory() {
  const navigate = useNavigate()
  const { saveTranscript } = useMemoir()
  const { recording, supported, timer, audioBlob, levels, start, stop, reset } = useAudioRecorder()
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('Speak your memory, then stop to create a story.')
  const [loading, setLoading] = useState(false)
  const waveformBars = useMemo(() => Array.from({ length: 16 }), [])

  const handleCapture = async () => {
    if (!recording) {
      reset()
      start()
      setStatus('Recording... speak slowly and clearly.')
      return
    }

    const blob = await stop()
    setStatus('Processing your memory. One moment...')
    if (!blob) {
      setStatus('No audio captured yet. Try again.')
      return
    }

    setLoading(true)
    try {
      const result = await uploadAudio(blob)
      setTranscript(result.transcript)
      saveTranscript(result.transcript)
      navigate('/generating', { state: { transcript: result.transcript, storyId: result.storyId } })
    } catch (error) {
      setStatus(error.message || 'Unable to transcribe the recording.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
    setTranscript('')
    setStatus('Speak your memory, then stop to create a story.')
  }

  return (
    <main className="record-page">
      <section className="section record-intro">
        <div className="page-header">
          <p className="eyebrow">Memory Studio</p>
          <h1>Capture a memory by voice and turn it into a storybook moment.</h1>
          <p className="subtext">
            Memoir records your story, builds a transcript, and sends it to the studio for story generation.
          </p>
        </div>
      </section>

      <section className="record-stage">
        <motion.button
          className={`mic-circle ${recording ? 'recording' : ''}`}
          onClick={handleCapture}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
        >
          <span className="mic-icon">🎙️</span>
        </motion.button>

        <div className="record-status">
          <strong>{recording ? 'Recording now' : 'Ready to capture memory'}</strong>
          <span>{formatTimer(timer)}</span>
        </div>

        <div className="audio-waveform" aria-hidden="true">
          {waveformBars.map((_, index) => (
            <span key={index} style={{ transform: `scaleY(${0.4 + (levels[index] || 0) * 1.6})` }} />
          ))}
        </div>

        <div className="transcript-panel">
          <p className="transcript-title">Transcript preview</p>
          <p className="transcript-copy">
            {supported
              ? transcript || 'Your transcript will appear here after recording.'
              : 'Your browser does not support audio capture. Please use Chrome or Edge.'}
          </p>
        </div>

        <div className="text-actions">
          <button type="button" className="text-action" onClick={handleReset} disabled={loading}>
            Reset →
          </button>
          <button type="button" className="text-action" onClick={handleCapture} disabled={loading}>
            {loading ? 'Uploading...' : recording ? 'Stop Recording →' : 'Start Recording →'}
          </button>
        </div>

        <p className="record-note">{status}</p>
      </section>
    </main>
  )
}
