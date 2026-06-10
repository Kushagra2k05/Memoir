import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchStory } from '../services/apiClient.js'

export default function StoryDetailPage() {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStory() {
      try {
        const response = await fetchStory(storyId)
        setStory(response.story)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadStory()
  }, [storyId])

  if (loading) {
    return (
      <section className="story-detail-page">
        <div className="page-header">
          <p className="eyebrow">Story loading</p>
          <h1>Loading your story details.</h1>
        </div>
      </section>
    )
  }

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
          <span>{new Date(story.createdAt || story.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          <span>{story.pages?.length || 0} story pages</span>
        </div>

        <div className="story-detail-pages">
          {story.pages?.map((page, index) => (
            <motion.article
              key={`${page.title}-${index}`}
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
