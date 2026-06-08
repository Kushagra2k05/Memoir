import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const recentMemories = [
  {
    year: '1958',
    title: 'The Birthday Cake',
    subtitle: 'A playful afternoon with candles and laughter.'
  },
  {
    year: '1964',
    title: 'First Bicycle Ride',
    subtitle: 'Wind through the park and a proud first ride.'
  },
  {
    year: '1975',
    title: 'Wedding Day',
    subtitle: 'The beginning of a lifetime together.'
  }
]

export default function GrandparentHome() {
  return (
    <section className="grandparent-experience">
      <div className="experience-shell">
        <motion.div
          className="experience-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="eyebrow">GOOD EVENING, GRANDMA</p>
          <h1>What memory would you like to share today?</h1>
          <p className="lead-copy">A single memory can become a story your family treasures forever.</p>
        </motion.div>

        <div className="experience-stage">
          <motion.div
            className="mic-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="mic-orbit">
              <span className="mic-emoji">🎙️</span>
            </div>
            <p className="mic-copy">Tap to begin speaking.</p>
            <p className="mic-subcopy">Memoir will transform your memory into a beautiful family storybook.</p>
          </motion.div>

          <motion.nav
            className="text-actions"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          >
            <Link className="text-action" to="/record">Start Recording →</Link>
            <Link className="text-action" to="/storybook">Browse Storybook →</Link>
            <Link className="text-action" to="/family-legacy">View Family Legacy →</Link>
          </motion.nav>
        </div>

        <motion.div
          className="storyline-shell"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        >
          <p className="storyline-label">Recent memories</p>
          <div className="memory-storyline">
            {recentMemories.map((item, index) => (
              <motion.article
                key={item.title}
                className="memory-item"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.12 }}
              >
                <div className="memory-year">{item.year}</div>
                <div className="memory-copy">
                  <h2>{item.title}</h2>
                  <p>{item.subtitle}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
