import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAudioRecorder from '../hooks/useAudioRecorder.jsx'
import { postChildResponse, fetchConversationSuggestions } from '../services/apiClient.js'

function formatTimer(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

function getCanvasData(canvas) {
  return canvas?.toDataURL('image/png') || null
}

export default function ChildResponse() {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const { recording, supported, timer, audioBlob, levels, start, stop, reset } = useAudioRecorder()
  const [drawingOpen, setDrawingOpen] = useState(false)
  const [heartSelected, setHeartSelected] = useState(false)
  const [questionOpen, setQuestionOpen] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [voiceNote, setVoiceNote] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [noteStatus, setNoteStatus] = useState('Record a short voice message or ask a question.')
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  useEffect(() => {
    async function loadSuggestions() {
      if (!storyId) return
      try {
        const result = await fetchConversationSuggestions({ storyId })
        setSuggestions(result.questions || [])
      } catch (error) {
        console.warn(error)
      }
    }
    loadSuggestions()
  }, [storyId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    context.strokeStyle = '#6d8a57'
    context.lineWidth = 4
    context.lineCap = 'round'
  }, [drawingOpen])

  const handleDrawingStart = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return
    isDrawing.current = true
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    context.beginPath()
    context.moveTo(event.clientX - rect.left, event.clientY - rect.top)
  }

  const handleDrawingMove = (event) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    context.lineTo(event.clientX - rect.left, event.clientY - rect.top)
    context.stroke()
  }

  const handleDrawingEnd = () => {
    isDrawing.current = false
  }

  const handleVoiceClick = () => {
    if (!supported) return
    if (recording) {
      stop()
      setVoiceNote('Voice note recorded.')
      return
    }
    reset()
    start()
    setVoiceNote('Recording voice note...')
  }

  const handleSubmit = async () => {
    if (!storyId) return
    setSubmitting(true)
    try {
      const drawingDataUrl = drawingOpen ? getCanvasData(canvasRef.current) : null
      const voiceDataUrl = audioBlob ? await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(audioBlob)
      }) : null

      await postChildResponse({
        storyId,
        question: questionText,
        heart: heartSelected,
        drawingDataUrl,
        voiceDataUrl,
        voiceNote: !voiceDataUrl && voiceNote.includes('recorded') ? 'Voice note recorded' : voiceNote,
      })

      navigate('/family-library')
    } catch (error) {
      console.error(error)
      setNoteStatus('Unable to submit the response. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="child-response-page">
      <section className="section page-intro">
        <div className="page-header">
          <p className="eyebrow">Child Collaboration</p>
          <h1>Make the story feel alive with your response.</h1>
          <p className="subtext">Draw, speak, ask, and react — then save your contribution to the family archive.</p>
        </div>
      </section>

      <section className="response-actions">
        <motion.button
          type="button"
          className="text-action"
          onClick={() => setDrawingOpen((value) => !value)}
          whileHover={{ scale: 1.02 }}
        >
          {drawingOpen ? 'Hide Drawing' : 'Draw a Picture'} →
        </motion.button>
        <motion.button
          type="button"
          className="text-action"
          onClick={handleVoiceClick}
          whileHover={{ scale: 1.02 }}
        >
          {recording ? 'Stop Voice Message' : 'Record Voice Message'} →
        </motion.button>
        <motion.button
          type="button"
          className="text-action"
          onClick={() => setQuestionOpen((value) => !value)}
          whileHover={{ scale: 1.02 }}
        >
          {questionOpen ? 'Hide Question' : 'Ask a Question'} →
        </motion.button>
        <motion.button
          type="button"
          className={`text-action ${heartSelected ? 'active-heart' : ''}`}
          onClick={() => setHeartSelected((value) => !value)}
          whileHover={{ scale: 1.02 }}
        >
          {heartSelected ? 'Heart Added ♥' : 'Leave a Heart Reaction'} →
        </motion.button>
      </section>

      {drawingOpen && (
        <section className="drawing-panel">
          <div className="canvas-frame">
            <canvas
              ref={canvasRef}
              width={600}
              height={320}
              onMouseDown={handleDrawingStart}
              onMouseMove={handleDrawingMove}
              onMouseUp={handleDrawingEnd}
              onMouseLeave={handleDrawingEnd}
            />
          </div>
          <p className="subtext">Use the canvas to add an illustration to the family story.</p>
        </section>
      )}

      <section className="voice-panel">
        <div className="record-status">
          <strong>{recording ? 'Listening for your message' : 'Voice message ready'}</strong>
          <span>{formatTimer(timer)}</span>
        </div>
        <div className="audio-waveform" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} style={{ transform: `scaleY(${0.3 + (levels[index] || 0) * 1.8})` }} />
          ))}
        </div>
      </section>

      {questionOpen && (
        <section className="question-panel">
          <label htmlFor="question-input">Your question for the family member</label>
          <input
            id="question-input"
            type="text"
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            placeholder="What do you want to ask?"
          />
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="suggestions-panel">
          <p className="section-eyebrow">Suggested questions</p>
          <div className="suggestions-grid">
            {suggestions.map((item, index) => (
              <button
                key={index}
                type="button"
                className="text-action suggestion-pill"
                onClick={() => setQuestionText(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="response-summary">
        <p className="subtext">{noteStatus}</p>
        <button type="button" className="text-action" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Saving response…' : 'Submit Response →'}
        </button>
      </section>
    </main>
  )
}
