import TreeVisualizer from '../components/TreeVisualizer.jsx'
import { familyTree } from '../data/storyData.js'

export default function FamilyTree() {
  return (
    <section className="tree-section">
      <div className="container centered-panel">
        <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8c8c8c' }}>Family Tree</p>
        <h2>One elegant view of your family’s storytelling path.</h2>
        <p style={{ maxWidth: 620, margin: '1rem auto 0', color: '#535353' }}>
          See how memories, storybooks, voice notes, drawings, and questions connect across generations.
        </p>
      </div>
      <div className="container" style={{ marginTop: '3rem' }}>
        <TreeVisualizer nodes={familyTree} />
      </div>
    </section>
  )
}
