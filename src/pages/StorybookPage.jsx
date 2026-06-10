import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchStory } from '../services/apiClient.js'

export default function StorybookPage() {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    async function loadStory() {
      try {
        const response = await fetchStory(storyId)
        setStory(response.story)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (storyId) {
      loadStory()
    } else {
      setLoading(false)
    }
  }, [storyId])

  const activePage = useMemo(() => story?.pages?.[current] || null, [story, current])

  const handleNext = () => setCurrent((value) => Math.min(value + 1, (story?.pages?.length || 1) - 1))
  const handlePrevious = () => setCurrent((value) => Math.max(value - 1, 0))

  const speakPage = () => {
    if (!activePage || !('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(activePage.copy)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  if (loading) {
    return (
      <main className="storybook-page">
        <div className="page-header">
          <p className="eyebrow">Storybook</p>
          <h1>Loading your storybook...</h1>
        </div>
      </main>
    )
  }

  if (!story) {
    return (
      <main className="storybook-page">
        <section className="page-header">
          <p className="eyebrow">Storybook</p>
          <h1>Story not found</h1>
          <button className="text-action" type="button" onClick={() => navigate('/family-library')}>
            Return to Family Library →
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="storybook-page storybook-open">
      <section className="section page-intro">
        <div className="page-header">
          <p className="eyebrow">Storybook</p>
          <h1>{story.title}</h1>
          <p className="subtext">Experience your memory as an illustrated family story.</p>
        </div>
      </section>

      <section className="storybook-stage">
        <motion.div
          className="storybook-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          {activePage?.illustrationUrl ? (
            <div className="storybook-art" style={{ backgroundImage: `url('${activePage.illustrationUrl}')` }} />
          ) : (
            <div className="storybook-art placeholder">Illustration loading...</div>
          )}
          <div className="storybook-copy">
            <h2>{activePage?.title}</h2>
            <p>{activePage?.copy}</p>
          </div>
        </motion.div>

        <div className="storybook-actions">
          <button className="text-action" type="button" onClick={handlePrevious} disabled={current === 0}>
            Previous Page →
          </button>
          <button
            className="text-action"
            type="button"
            onClick={handleNext}
            disabled={current === (story.pages?.length || 1) - 1}
          >
            Next Page →
          </button>
          <button className="text-action" type="button" onClick={speakPage}>
            Read Aloud →
          </button>
          <button className="text-action" type="button" onClick={() => setShared(true)}>
            Share →
          </button>
          <button className="text-action" type="button" onClick={() => navigate(`/child-response/${story.id}`)}>
            Add Response →
          </button>
        </div>
      </section>

      {shared && (
        <div className="modal-backdrop" onClick={() => setShared(false)}>
          <div className="demo-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-modal" onClick={() => setShared(false)}>
              Close
            </button>
            <div className="share-copy">
              <h2>Share this story</h2>
              <p>Copy the link below to send this memory to a loved one.</p>
              <input readOnly value={`${window.location.origin}/storybook/${story.id}`} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
