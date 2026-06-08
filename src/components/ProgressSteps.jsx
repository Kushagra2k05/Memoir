import { motion } from 'framer-motion'

export default function ProgressSteps({ steps }) {
  return (
    <ul className="status-list">
      {steps.map((step, index) => (
        <motion.li
          key={step}
          className="status-item"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.12, duration: 0.45 }}
        >
          <span>✓</span>
          <div>
            <strong>{step}</strong>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}
