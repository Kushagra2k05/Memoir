import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchFamilyTimeline } from '../services/apiClient.js'

export default function FamilyLegacy() {
  const [activeId, setActiveId] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTimeline() {
      setLoading(true)
      try {
        const { timeline: events } = await fetchFamilyTimeline()
        setTimeline(events || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadTimeline()
  }, [])

  return (
    <main className="family-legacy-page">
      <section className="section page-intro">
        <div className="page-header">
          <p className="eyebrow">Family Legacy</p>
          <h1>Memory, story, and legacy connected.</h1>
          <p className="subtext">A living timeline that links each family memory to the story it became.</p>
        </div>
      </section>

      <section className="legacy-timeline">
        {loading ? (
          <div className="loading-state">Loading family timeline…</div>
        ) : (
          timeline.map((item) => (
            <motion.article
              key={item.storyId || item.id}
              className={`timeline-event ${activeId === item.storyId ? 'active' : ''}`}
              onClick={() => setActiveId((current) => (current === item.storyId ? null : item.storyId))}
              whileHover={{ scale: 1.01 }}
            >
              <div className="timeline-label">
                <span>{item.year}</span>
                <h2>{item.title}</h2>
              </div>
              <p className="timeline-teaser">{item.details}</p>
              <AnimatePresence>
                {activeId === item.storyId && (
                  <motion.p
                    className="timeline-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {item.details}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.article>
          ))
        )}
      </section>
    </main>
  )
}
