import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { legacyEvents } from '../data/storyData.js'

export default function FamilyLegacy() {
  const [activeId, setActiveId] = useState(null)

  return (
    <main className="family-legacy-page">
      <section className="section page-intro">
        <div className="page-header">
          <p className="eyebrow">Family Legacy</p>
          <h1>Family Legacy</h1>
          <p className="subtext">A vertical chronicle of memories, where each moment reveals a quiet story.</p>
        </div>
      </section>

      <section className="legacy-timeline">
        {legacyEvents.map((item) => (
          <motion.article
            key={item.id}
            className={`timeline-event ${activeId === item.id ? 'active' : ''}`}
            onClick={() => setActiveId((current) => (current === item.id ? null : item.id))}
            whileHover={{ scale: 1.01 }}
          >
            <div className="timeline-label">
              <span>{item.year}</span>
              <h2>{item.title}</h2>
            </div>
            <p className="timeline-teaser">{item.subtitle}</p>
            <AnimatePresence>
              {activeId === item.id && (
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
        ))}
      </section>
    </main>
  )
}
