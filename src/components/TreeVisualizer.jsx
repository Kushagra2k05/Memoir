import { motion } from 'framer-motion'

export default function TreeVisualizer({ nodes }) {
  return (
    <div className="tree-shell">
      {nodes.map((node, index) => (
        <motion.div
          key={node.role}
          className="tree-node"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.45 }}
        >
          <h3>{node.role}</h3>
          <ul>
            {node.items.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}
