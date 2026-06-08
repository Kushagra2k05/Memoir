import { motion } from 'framer-motion'

export default function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item, index) => (
        <motion.article
          key={item.title}
          className="timeline-item"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.55, ease: 'easeOut' }}
        >
          <h3>{item.title}</h3>
          {item.subtitle && <p>{item.subtitle}</p>}
        </motion.article>
      ))}
    </div>
  )
}
