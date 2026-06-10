import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { generateStory } from '../services/apiClient.js'

export default function StoryGeneration() {
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState('Preparing your memory for story creation...')
  const [error, setError] = useState(null)

  useEffect(() => {
    const transcript = location.state?.transcript
    const storyId = location.state?.storyId
    const title = location.state?.title

    if (!transcript) {
      navigate('/record-memory')
      return
    }

    async function buildStory() {
      try {
        setStatus('Creating the story, illustrations, and timeline...')
        const result = await generateStory({ transcript, title, storyId })
        const id = result.story?.id || storyId
        setStatus('Your storybook is ready. Opening now...')
        setTimeout(() => navigate(`/storybook/${id}`), 1400)
      } catch (err) {
        setError(err.message || 'Unable to generate story. Please try again.')
      }
    }

    buildStory()
  }, [location.state, navigate])

  return (
    <main className="story-generation-page">
      <div className="story-generation-backdrop" />
      <div className="floating-particle particle-1" />
      <div className="floating-particle particle-2" />
      <div className="floating-particle particle-3" />

      <div className="story-generation-shell">
        <motion.div
          className="story-generation-copy"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <p className="eyebrow">Story Generation</p>
          <h1>Turning memory into a legacy storybook.</h1>
          <p className="subtitle">Your family memory is being crafted into an illustrated story.</p>
          <p className="subtext">{error || status}</p>
        </motion.div>

        <motion.div
          className="story-generation-layout"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="generation-progress-ring" aria-hidden="true">
            <div className="progress-core" />
            <div className="progress-ring" />
          </div>
        </motion.div>
      </div>
    </main>
  )
}
