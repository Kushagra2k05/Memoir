import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { generateStory } from '../services/apiClient.js'

export default function CreateStory() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [memory, setMemory] = useState('')
  const [generatedStory, setGeneratedStory] = useState(null)
  const [statusMessage, setStatusMessage] = useState('Enter a memory and let Memoir create a story for the family.')
  const [loading, setLoading] = useState(false)

  const canGenerate = Boolean(memory.trim())

  const handleGenerate = async () => {
    if (!canGenerate) return

    setLoading(true)
    setStatusMessage('Generating a warm story from your memory...')
    try {
      const response = await generateStory({ transcript: memory, title: title.trim() || 'A Family Memory' })
      setGeneratedStory(response.story)
      setStatusMessage('Story generated. You can now open it as a storybook.')
    } catch (error) {
      console.error(error)
      setStatusMessage(error.message || 'Unable to generate the story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenBook = () => {
    if (generatedStory?.id) {
      navigate(`/storybook/${generatedStory.id}`)
    }
  }

  return (
    <main className="create-story-page">
      <section className="section page-intro">
        <div className="page-header">
          <p className="eyebrow">Create Your Story</p>
          <h1>Turn a memory into a storybook for the family.</h1>
          <p className="subtext">Memoir crafts a warm, illustrated story from your memory details.</p>
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
              rows="7"
              value={memory}
              onChange={(event) => setMemory(event.target.value)}
              placeholder="Describe the memory in your own words."
            />
          </div>

          <div className="story-builder-actions">
            <button type="button" className="text-action" onClick={handleGenerate} disabled={!canGenerate || loading}>
              {loading ? 'Generating...' : 'Generate Story →'}
            </button>
            <button type="button" className="text-action" onClick={handleOpenBook} disabled={!generatedStory?.id}>
              Open Storybook →
            </button>
          </div>

          <p className="record-status-box">{statusMessage}</p>
        </div>

        <aside className="story-draft-panel">
          <div className="panel-copy">
            <p className="section-eyebrow">Story Preview</p>
            <h2>{generatedStory?.title || 'Your story draft will appear here'}</h2>
            <p>{generatedStory?.story || 'A beautifully written story preview appears when generation completes.'}</p>
          </div>

          <div className="draft-pages">
            {generatedStory?.pages?.length ? (
              generatedStory.pages.map((page, index) => (
                <article key={`${page.title}-${index}`} className="draft-page-card">
                  <h3>{page.title}</h3>
                  <p>{page.copy}</p>
                </article>
              ))
            ) : (
              <div className="draft-placeholder">
                <p>Type a story memory and generate to see the story structure.</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  )
}
