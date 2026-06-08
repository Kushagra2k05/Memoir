import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMemoir } from '../context/MemoirContext.jsx'
import { motion } from 'framer-motion'

export default function StoryDetailPage() {
  const { storyId } = useParams()
  const { stories } = useMemoir()
  const navigate = useNavigate()

  const story = useMemo(() => stories.find((item) => item.id === storyId), [storyId, stories])

  if (!story) {
    return (
      <section className="story-detail-page">
        <div className="page-header">
          <p className="eyebrow">Story Not Found</p>
          <h1>This memory could not be located.</h1>
          <button className="text-action" type="button" onClick={() => navigate('/family-library')}>
            Back to Family Library →
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="story-detail-page">
      <div className="page-header">
        <p className="eyebrow">Family Memory</p>
        <h1>{story.title}</h1>
        <p className="subtext">A tender illustrated passage from the family library.</p>
      </div>

      <div className="story-detail-content">
        <div className="story-detail-meta">
          <span>{new Date(story.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          <span>{story.pages.length} story pages</span>
        </div>

        <div className="story-detail-pages">
          {story.pages.map((page, index) => (
            <motion.article
              key={page.title}
              className="story-detail-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <h2>{page.title}</h2>
              <p>{page.copy}</p>
            </motion.article>
          ))}
        </div>

        <button className="text-action" type="button" onClick={() => navigate('/family-library')}>
          Back to Family Library →
        </button>
      </div>
    </section>
  )
}
