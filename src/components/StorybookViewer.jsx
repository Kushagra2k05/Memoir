import { useState } from 'react'
import { motion } from 'framer-motion'

export default function StorybookViewer({ pages }) {
  const [current, setCurrent] = useState(0)
  const active = pages[current]

  const nextPage = () => setCurrent(value => Math.min(value + 1, pages.length - 1))
  const prevPage = () => setCurrent(value => Math.max(value - 1, 0))

  return (
    <div className="storybook-shell">
      <motion.div
        className="story-page"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="story-page illustration" style={{ backgroundImage: `radial-gradient(circle at top left, rgba(109, 138, 87, 0.14), transparent 30%), url('${active.art}')` }} />
        <header>
          <h2>{active.title}</h2>
          <p>{active.copy}</p>
        </header>
      </motion.div>
      <div className="story-actions">
        <button type="button" className="secondary-button" onClick={prevPage} disabled={current === 0}>
          Previous page
        </button>
        <button type="button" className="secondary-button" onClick={nextPage} disabled={current === pages.length - 1}>
          Next page
        </button>
        <button type="button" className="primary-button">Narrate story</button>
      </div>
    </div>
  )
}
