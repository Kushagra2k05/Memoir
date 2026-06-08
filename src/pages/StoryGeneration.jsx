import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const journey = [
  {
    icon: '🎤',
    title: 'Capturing Memory',
    description: 'A soft glowing microphone listens as a memory begins to surface.'
  },
  {
    icon: '✍️',
    title: 'Crafting Story',
    description: 'Words unfurl slowly, written across the imagination like ink on paper.'
  },
  {
    icon: '🎨',
    title: 'Painting Memories',
    description: 'Illustrations fade in with gentle motion and glowing detail.'
  },
  {
    icon: '📖',
    title: 'Building Storybook',
    description: 'Pages turn softly while the storybook assembles itself.'
  },
  {
    icon: '✨',
    title: 'Your Heirloom Is Ready',
    description: 'A completed story blooms from the family tree and becomes a legacy.'
  }
]

export default function StoryGeneration() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/storybook')
    }, 4200)
    return () => window.clearTimeout(timer)
  }, [navigate])

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
          <h1>Creating Your Family Story</h1>
          <p className="subtitle">Every memory deserves to become a legacy.</p>
          <p className="subtext">The experience is unfolding. In just a moment, your storybook will be ready to explore.</p>
        </motion.div>

        <div className="story-generation-layout">
          <motion.div
            className="journey-column"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.16
                }
              }
            }}
          >
            {journey.map((step) => (
              <motion.div
                key={step.title}
                className="journey-step"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <div className="journey-icon-ring">
                  <span>{step.icon}</span>
                </div>
                <div className="journey-copy">
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="story-tree"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          >
            <div className="tree-seed" />
            <div className="tree-roots" />
            <div className="tree-trunk" />
            <div className="tree-branches" />
            <div className="tree-leaves" />
            <div className="storybook-bloom">📖</div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
