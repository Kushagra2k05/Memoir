import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSpeechRecognition from '../hooks/useSpeechRecognition.jsx'
import { useMemoir } from '../context/MemoirContext.jsx'

export default function ChildResponse() {
  const navigate = useNavigate()
  const { addResponse } = useMemoir()
  const { supported, listening, transcript, start, stop, reset } = useSpeechRecognition()
  const [drawingOpen, setDrawingOpen] = useState(false)
  const [heartSelected, setHeartSelected] = useState(false)
  const [questionOpen, setQuestionOpen] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [voiceNote, setVoiceNote] = useState('')
  const [voiceRecording, setVoiceRecording] = useState(false)
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  useEffect(() => {
    if (!listening && voiceRecording && transcript) {
      setVoiceNote(transcript)
      setVoiceRecording(false)
    }
  }, [listening, transcript, voiceRecording])

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
    if (voiceRecording) {
      stop()
      setVoiceRecording(false)
      return
    }
    reset()
    start()
    setVoiceRecording(true)
  }

  const handleSubmit = () => {
    addResponse({
      type: 'child-response',
      question: questionText,
      heart: heartSelected,
      voiceNote,
      drawing: drawingOpen,
      submittedAt: new Date().toISOString()
    })
    navigate('/family-library')
  }

  return (
    <main className="child-response-page">
      <section className="section page-intro">
        <div className="page-header">
          <p className="eyebrow">Child Collaboration</p>
          <h1>Grandma shared a new story.</h1>
          <p className="subtext">Help the child respond with a drawing, voice message, question, or heart reaction.</p>
        </div>
      </section>

      <section className="response-actions">
        <motion.button
          type="button"
          className="text-action"
          onClick={() => setDrawingOpen((value) => !value)}
          whileHover={{ scale: 1.02 }}
        >
          Draw a Picture →
        </motion.button>
        <motion.button
          type="button"
          className="text-action"
          onClick={handleVoiceClick}
          whileHover={{ scale: 1.02 }}
        >
          {voiceRecording ? 'Stop Voice Message →' : 'Record Voice Message →'}
        </motion.button>
        <motion.button
          type="button"
          className="text-action"
          onClick={() => setQuestionOpen((value) => !value)}
          whileHover={{ scale: 1.02 }}
        >
          Ask a Question →
        </motion.button>
        <motion.button
          type="button"
          className={`text-action ${heartSelected ? 'active-heart' : ''}`}
          onClick={() => setHeartSelected((value) => !value)}
          whileHover={{ scale: 1.02 }}
        >
          {heartSelected ? 'Heart Added ♥' : 'Leave a Heart Reaction →'}
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
          <p className="subtext">Draw directly on the canvas to create a response that feels like part of the story.</p>
        </section>
      )}

      {questionOpen && (
        <section className="question-panel">
          <label htmlFor="question-input">Your question for Grandma</label>
          <input
            id="question-input"
            type="text"
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            placeholder="What would you like to ask?"
          />
        </section>
      )}

      <section className="response-summary">
        <p className="subtext">Voice note saved: {voiceNote ? 'Yes' : 'No'}</p>
        <p className="subtext">Heart reaction: {heartSelected ? 'Added' : 'Not added'}</p>
        <button type="button" className="text-action" onClick={handleSubmit}>
          Submit Response →
        </button>
      </section>
    </main>
  )
}
