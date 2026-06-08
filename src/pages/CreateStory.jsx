import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSpeechRecognition from '../hooks/useSpeechRecognition.jsx'
import { useMemoir } from '../context/MemoirContext.jsx'

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function createStoryPages(source) {
  const trimmed = source.trim()
  return [
    {
      title: 'A Memory Comes Alive',
      copy: `The moment unfolds softly as the memory is spoken. ${trimmed} It settles into the story with a warm, familiar rhythm.`,
    },
    {
      title: 'A Legacy Shared',
      copy: `The story becomes a gift for family, carrying the same tenderness and detail from the original memory. It is ready to be revisited again and again.`,
    },
  ]
}

export default function CreateStory() {
  const navigate = useNavigate()
  const { stories, setStories, saveTranscript } = useMemoir()
  const { supported, listening, transcript, timer, start, stop, reset } = useSpeechRecognition()
  const [title, setTitle] = useState('')
  const [memory, setMemory] = useState('')
  const [generatedStory, setGeneratedStory] = useState(null)
  const [statusMessage, setStatusMessage] = useState('Share a memory by typing it or recording your voice.')

  const sourceText = transcript.trim() || memory.trim()
  const canGenerate = title.trim().length >= 3 && sourceText.length > 0
  const canSave = Boolean(generatedStory)

  const handleRecord = () => {
    if (listening) {
      stop()
      saveTranscript(transcript)
      setMemory(transcript)
      setStatusMessage('Voice memory captured. You can refine it before generating the story.')
      return
    }

    reset()
    start()
    setStatusMessage('Listening... speak softly to capture your family memory.')
  }

  const handleReset = () => {
    reset()
    setMemory('')
    setStatusMessage('Ready to capture a new memory.')
  }

  const handleGenerate = () => {
    if (!canGenerate) return

    const source = sourceText
    const storyDraft = {
      id: slugify(title || source).slice(0, 32) || `story-${Date.now()}`,
      title: title.trim() || 'Untitled Memory',
      date: new Date().toISOString(),
      snippet: source.length > 120 ? `${source.slice(0, 117)}...` : source,
      pages: createStoryPages(source),
    }

    setGeneratedStory(storyDraft)
    setStatusMessage('A gentle story draft is ready. Save it into the family library.')
  }

  const handleSave = () => {
    if (!generatedStory) return

    const baseId = slugify(generatedStory.title) || `story-${Date.now()}`
    const safeId = `${baseId}-${stories.length + 1}`
    const savedStory = { ...generatedStory, id: safeId }

    setStories((current) => [savedStory, ...current])
    navigate(`/family-library/${safeId}`)
  }

  return (
    <main className="create-story-page">
      <section className="section page-intro">
        <div className="page-header">
          <p className="eyebrow">Create Your Story</p>
          <h1>Turn a tender family memory into a storybook moment.</h1>
          <p className="subtext">
            Write or record a memory, then let Memoir craft an elegant story draft you can save, revisit, and share.
          </p>
        </div>
      </section>

      <section className="create-story-shell">
        <div className="story-builder-card">
          <div className="story-builder-field">
            <label htmlFor="story-title">Story title</label>
            <input
              id="story-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="The Afternoon by the Lake"
            />
          </div>

          <div className="story-builder-field">
            <label htmlFor="memory-input">Memory description</label>
            <textarea
              id="memory-input"
              rows="6"
              value={memory}
              onChange={(event) => setMemory(event.target.value)}
              placeholder="Describe the memory in your own words."
            />
          </div>

          <div className="recording-panel">
            <div>
              <p className="section-eyebrow">Voice capture</p>
              <p className="recording-note">Use your browser microphone to speak a memory and automatically fill the story text.</p>
            </div>
            <div className="record-actions">
              <motion.button
                className={`text-action ${listening ? 'active-heart' : 'record-button'}`}
                type="button"
                onClick={handleRecord}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {listening ? 'Stop recording' : 'Record memory'}
              </motion.button>
              <button type="button" className="text-action" onClick={handleReset}>
                Reset
              </button>
            </div>
            <div className="record-status-box">
              <span>{listening ? `Recording • ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : 'Ready'}</span>
              <p>{statusMessage}</p>
            </div>
          </div>

          <div className="story-builder-actions">
            <button type="button" className="text-action" onClick={handleGenerate} disabled={!canGenerate}>
              Generate Story →
            </button>
            <button type="button" className="text-action" onClick={handleSave} disabled={!canSave}>
              Save to Library →
            </button>
          </div>
        </div>

        <aside className="story-draft-panel">
          <div className="panel-copy">
            <p className="section-eyebrow">Story Preview</p>
            <h2>{generatedStory ? generatedStory.title : 'Your story draft will appear here'}</h2>
            <p>{generatedStory ? generatedStory.snippet : 'A beautifully written summary is generated once you provide a title and memory source.'}</p>
          </div>

          <div className="draft-pages">
            {generatedStory ? (
              generatedStory.pages.map((page) => (
                <article key={page.title} className="draft-page-card">
                  <h3>{page.title}</h3>
                  <p>{page.copy}</p>
                </article>
              ))
            ) : (
              <div className="draft-placeholder">
                <p>Start with a title and memory, then generate your story to see it take shape.</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  )
}
