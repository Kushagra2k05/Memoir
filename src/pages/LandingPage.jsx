import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo.replace('#', '')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }
  }, [location.state])

  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="eyebrow">
            A modern family legacy experience
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.1 }}>
            Where grandparents and grandchildren create stories together
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.18 }} className="hero-description">
            Gentle memories that become family heirlooms. Watch a grandparent’s memory unfold into a warm story, then invite the child to add drawings, voice, or a loving response.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.26 }} className="hero-actions">
            <Link className="text-action hero-cta" to="/record-memory">Start the Story →</Link>
            <button type="button" className="text-action hero-secondary" onClick={() => setDemoOpen(true)}>
              Watch Demo →
            </button>
            <button
              type="button"
              className="text-action hero-secondary"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Scroll to About
            </button>
          </motion.div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="section-copy">
          <p className="section-eyebrow">About Memoir</p>
          <h2>Preserve the quiet, tender moments that become your family’s story.</h2>
          <p>
            Memoir is a premium storytelling platform designed to turn familiar memories into heirloom narrative experiences. It is warm, cinematic, and built for the stories you never want to forget.
          </p>
        </div>
      </section>

      <section className="section process-section" id="how">
        <div className="section-copy">
          <p className="section-eyebrow">How it works</p>
          <h2>From a spoken memory to a finished storybook.</h2>
          <div className="process-list">
            <div>
              <span>1</span>
              <h3>Capture</h3>
              <p>Record the memory with a soft, responsive microphone experience.</p>
            </div>
            <div>
              <span>2</span>
              <h3>Craft</h3>
              <p>Memoir shapes the recollection into an elegant narrative.</p>
            </div>
            <div>
              <span>3</span>
              <h3>Share</h3>
              <p>Invite a grandchild to respond with a drawing, voice message, or question.</p>
            </div>
          </div>
        </div>
      </section>

      <aside className="callout-section" id="stories">
        <div className="callout-copy">
          <p className="section-eyebrow">Stories</p>
          <h2>Every story in the family library is a living piece of legacy.</h2>
          <p>Browse the collection, revisit beloved moments, and continue the tradition.</p>
          <Link className="text-action" to="/family-library">Visit Family Library →</Link>
        </div>
      </aside>

      {demoOpen && (
        <div className="modal-backdrop" onClick={() => setDemoOpen(false)}>
          <div className="demo-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-modal" onClick={() => setDemoOpen(false)}>
              Close
            </button>
            <div className="video-wrapper">
              <iframe
                title="Memoir demo"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/ScMzIvxBSi4"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
