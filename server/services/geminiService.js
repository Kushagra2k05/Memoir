import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '')

function safeJsonParse(value) {
  const trimmed = value?.trim() || ''
  const start = trimmed.indexOf('{')
  if (start < 0) return null
  try {
    return JSON.parse(trimmed.slice(start))
  } catch (error) {
    return null
  }
}

export async function analyzeMemory(transcript) {
  if (!process.env.VITE_GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY not configured, returning empty metadata')
    return {
      people: [],
      places: [],
      events: [],
      emotions: [],
      year: null,
    }
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  
  const prompt = `Extract the most important memory metadata from this text. Return a strict JSON object with keys: people, places, events, emotions, year. Use empty arrays or null when a value is not present. Do not include any commentary.

Memory:
"""
${transcript}
"""

Output example:
{
  "people": ["father"],
  "places": ["village fair"],
  "events": ["village fair"],
  "emotions": ["joy"],
  "year": 1962
}`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text() || ''
    const parsed = safeJsonParse(raw)
    return parsed || {
      people: [],
      places: [],
      events: [],
      emotions: [],
      year: null,
    }
  } catch (error) {
    console.error('Gemini analyzeMemory error:', error)
    return {
      people: [],
      places: [],
      events: [],
      emotions: [],
      year: null,
    }
  }
}

export async function generateStory(transcript, title = 'A Family Memory') {
  if (!process.env.VITE_GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY not configured, returning fallback story')
    return {
      title: title || 'A Family Memory',
      story: transcript,
      pages: [
        { title: 'A Memory Begins', copy: transcript.slice(0, 240) },
        { title: 'The Heart of the Story', copy: transcript.slice(240, 520) },
        { title: 'A Warm Ending', copy: 'This memory becomes a family heirloom for years to come.' },
      ],
    }
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Turn the memory below into a warm children's story for ages 6-12. Preserve the family relationships, historical detail, emotional tone, and conclude with a positive ending. Split the story into 3 pages. Return valid JSON with keys: title, story, pages. Each page should contain title and copy. Do not return markdown, only JSON.

Memory:
"""
${transcript}
"""

Output example:
{
  "title": "...",
  "story": "...",
  "pages": [
    { "title": "...", "copy": "..." },
    { "title": "...", "copy": "..." },
    { "title": "...", "copy": "..." }
  ]
}`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text() || ''
    const parsed = safeJsonParse(raw)
    if (!parsed || !Array.isArray(parsed.pages)) {
      return {
        title: title || 'A Family Memory',
        story: transcript,
        pages: [
          { title: 'A Memory Begins', copy: transcript.slice(0, 240) },
          { title: 'The Heart of the Story', copy: transcript.slice(240, 520) },
          { title: 'A Warm Ending', copy: 'This memory becomes a family heirloom for years to come.' },
        ],
      }
    }
    return parsed
  } catch (error) {
    console.error('Gemini generateStory error:', error)
    return {
      title: title || 'A Family Memory',
      story: transcript,
      pages: [
        { title: 'A Memory Begins', copy: transcript.slice(0, 240) },
        { title: 'The Heart of the Story', copy: transcript.slice(240, 520) },
        { title: 'A Warm Ending', copy: 'This memory becomes a family heirloom for years to come.' },
      ],
    }
  }
}

export async function suggestFollowUp(transcript) {
  if (!process.env.VITE_GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY not configured, returning empty suggestions')
    return []
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Read this family memory excerpt and suggest three gentle follow-up questions a child can ask to continue the conversation. Return a JSON object with a single key 'questions' containing a list of strings. Do not include anything else.

Memory:
"""
${transcript}
"""

Example:
{
  "questions": ["When did this happen?", "How did you feel?", "What happened next?"]
}`

  try {
    const result = await model.generateContent(prompt)
    const raw = result.response.text() || ''
    const parsed = safeJsonParse(raw)
    return parsed?.questions || []
  } catch (error) {
    console.error('Gemini suggestFollowUp error:', error)
    return []
  }
}

export function buildIllustrationPrompt(page, metadata = {}) {
  const people = metadata.people?.join(', ') || 'family members'
  const place = metadata.places?.join(', ') || 'a warm storybook setting'
  const event = metadata.events?.[0] || page.title
  const emotion = metadata.emotions?.join(', ') || 'joyful emotion'
  return `Children's storybook illustration, warm colors, ${place}, ${people}, ${event}, ${emotion}, watercolor style, soft textures, gentle lighting.`
}
