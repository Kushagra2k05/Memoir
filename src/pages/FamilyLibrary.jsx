import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchStories } from '../services/apiClient.js'

export default function FamilyLibrary() {
  const [stories, setStories] = useState([])
  const [search, setSearch] = useState('')
  const [sortNewest, setSortNewest] = useState(true)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadStories() {
      setLoading(true)
      try {
        const data = await fetchStories()
        setStories(data.stories || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadStories()
  }, [])

  const filteredStories = useMemo(() => {
    return stories
      .filter((story) => story.title.toLowerCase().includes(search.toLowerCase()) || story.snippet.toLowerCase().includes(search.toLowerCase()))
      .sort((first, second) => {
        const firstDate = new Date(first.createdAt || first.date || 0)
        const secondDate = new Date(second.createdAt || second.date || 0)
        return sortNewest ? secondDate - firstDate : firstDate - secondDate
      })
  }, [search, sortNewest, stories])

  return (
    <section className="family-library-page">
      <div className="page-header">
        <p className="eyebrow">Family Library</p>
        <h1>Stories that have already found their place in the family album.</h1>
        <p className="subtext">A quiet collection of treasured memories, searchable and ready to revisit.</p>
      </div>

      <div className="library-controls">
        <input
          className="search-input"
          type="search"
          placeholder="Search memories and stories"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="text-action story-create-button" type="button" onClick={() => navigate('/create-story')}>
          + Create New Story →
        </button>
        <button className="text-action" type="button" onClick={() => setSortNewest((current) => !current)}>
          Sort by {sortNewest ? 'oldest' : 'newest'} →
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading stories…</div>
      ) : (
        <div className="story-listing">
          {filteredStories.map((story) => (
            <motion.article
              key={story.id}
              className="story-row"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              onClick={() => navigate(`/family-library/${story.id}`)}
            >
              <div>
                <span className="story-year">{new Date(story.createdAt || story.date || Date.now()).getFullYear()}</span>
                <h2>{story.title}</h2>
              </div>
              <p>{story.snippet}</p>
            </motion.article>
          ))}
          {!filteredStories.length && <div className="empty-state">No stories match your search.</div>}
        </div>
      )}
    </section>
  )
}
