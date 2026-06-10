const apiBase = import.meta.env.VITE_API_BASE_URL || ''

async function sendJson(path, method = 'GET', body) {
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error || 'API request failed.')
  }

  return response.json()
}

export async function uploadAudio(audioBlob, storyId) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'memory.webm')
  const response = await fetch(`${apiBase}/api/transcribe`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error || 'Unable to upload audio.')
  }
  return response.json()
}

export async function generateStory(payload) {
  return sendJson('/api/generate-story', 'POST', payload)
}

export async function fetchStories() {
  return sendJson('/api/stories')
}

export async function fetchStory(storyId) {
  return sendJson(`/api/stories/${storyId}`)
}

export async function postChildResponse(payload) {
  return sendJson('/api/responses', 'POST', payload)
}

export async function fetchFamilyTimeline() {
  return sendJson('/api/timeline')
}

export async function fetchConversationSuggestions(payload) {
  return sendJson('/api/conversation-suggestions', 'POST', payload)
}
