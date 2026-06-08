import { createContext, useContext, useMemo, useState } from 'react'
import { libraryStories as initialStories, legacyEvents as initialLegacy } from '../data/storyData.js'

const MemoirContext = createContext(null)

export function MemoirProvider({ children }) {
  const [transcript, setTranscript] = useState('')
  const [stories, setStories] = useState(initialStories)
  const [responses, setResponses] = useState([])
  const [familyLegacy] = useState(initialLegacy)

  const saveTranscript = (value) => {
    setTranscript(value || '')
  }

  const addResponse = (response) => {
    setResponses((current) => [response, ...current])
  }

  const value = useMemo(
    () => ({
      transcript,
      saveTranscript,
      stories,
      setStories,
      responses,
      addResponse,
      familyLegacy
    }),
    [transcript, stories, responses, familyLegacy]
  )

  return <MemoirContext.Provider value={value}>{children}</MemoirContext.Provider>
}

export function useMemoir() {
  const context = useContext(MemoirContext)
  if (!context) {
    throw new Error('useMemoir must be used within MemoirProvider')
  }
  return context
}
