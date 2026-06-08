import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { storybookPages } from '../data/storyData.js'

export default function StorybookPage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)

  const active = useMemo(() => storybookPages[current], [current])

  const handleNext = () => setCurrent((value) => Math.min(value + 1, storybookPages.length - 1))
  const handlePrevious = () => setCurrent((value) => Math.max(value - 1, 0))

  const speakPage = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(active.copy)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <main className="storybook-page">
      <section className="section page-intro">
        <div className="page-header">
          <p className="eyebrow">Storybook</p>
          <h1>Open the pages of a luxury family storybook.</h1>
          <p className="subtext">Elegant transitions, illustration, and narration bring every memory to life.</p>
        </div>
      </section>

      <section className="storybook-stage">
        <motion.div
          className="storybook-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="storybook-art" style={{ backgroundImage: `url('${active.art}')` }} />
          <div className="storybook-copy">
            <h2>{active.title}</h2>
            <p>{active.copy}</p>
          </div>
        </motion.div>

        <div className="storybook-actions">
          <button className="text-action" type="button" onClick={handlePrevious} disabled={current === 0}>
            Previous Page →
          </button>
          <button className="text-action" type="button" onClick={handleNext} disabled={current === storybookPages.length - 1}>
            Next Page →
          </button>
          <button className="text-action" type="button" onClick={speakPage}>
            Narration →
          </button>
          <button className="text-action" type="button" onClick={() => setShareOpen(true)}>
            Share →
          </button>
          <button className="text-action" type="button" onClick={() => navigate('/child-response')}>
            Continue →
          </button>
        </div>
      </section>

      {shareOpen && (
        <div className="modal-backdrop" onClick={() => setShareOpen(false)}>
          <div className="demo-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-modal" onClick={() => setShareOpen(false)}>
              Close
            </button>
            <div className="share-copy">
              <h2>Share this story</h2>
              <p>Copy the link below to send this memory to a loved one.</p>
              <input readOnly value={`${window.location.origin}/storybook`} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
