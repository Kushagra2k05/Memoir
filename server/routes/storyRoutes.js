import express from 'express'
import { db, storage } from '../firebaseAdmin.js'
import { analyzeMemory, generateStory, buildIllustrationPrompt, suggestFollowUp } from '../services/geminiService.js'
import { generateIllustration } from '../services/stableDiffusionService.js'

const router = express.Router()

async function uploadIllustrationDataUrl(dataUrl, storyId, pageIndex) {
  if (!dataUrl?.startsWith('data:image')) {
    return null
  }

  const [meta, base64String] = dataUrl.split(',')
  const buffer = Buffer.from(base64String, 'base64')
  const filename = `illustrations/${storyId}/page-${pageIndex}-${Date.now()}.png`
  const file = storage.file(filename)
  await file.save(buffer, { contentType: 'image/png' })
  await file.makePublic?.()
  return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`
}

router.post('/generate-story', async (req, res) => {
  try {
    const { transcript, title, storyId: existingStoryId } = req.body
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required.' })
    }

    const storyId = existingStoryId || `story-${Date.now()}`
    const metadata = await analyzeMemory(transcript)
    const storyDraft = await generateStory(transcript, title || metadata.event || 'A Family Memory')

    const pages = await Promise.all(
      storyDraft.pages.map(async (page, index) => {
        const prompt = buildIllustrationPrompt(page, metadata)
        const illustrationData = await generateIllustration(prompt)
        const illustrationUrl = illustrationData
          ? await uploadIllustrationDataUrl(illustrationData, storyId, index)
          : null

        if (illustrationUrl) {
          await db.collection('illustrations').add({
            storyId,
            pageIndex: index,
            prompt,
            url: illustrationUrl,
            createdAt: new Date().toISOString(),
          })
        }

        return {
          pageIndex: index,
          title: page.title,
          copy: page.copy,
          illustrationUrl,
          prompt,
          createdAt: new Date().toISOString(),
        }
      })
    )

    const docData = {
      id: storyId,
      title: storyDraft.title,
      transcript,
      story: storyDraft.story,
      pages,
      metadata,
      snippet: storyDraft.story.slice(0, 160),
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await db.collection('stories').doc(storyId).set(docData, { merge: true })

    await Promise.all(
      pages.map((page) =>
        db.collection('storyPages').doc(`${storyId}-page-${page.pageIndex}`).set({
          storyId,
          pageIndex: page.pageIndex,
          title: page.title,
          copy: page.copy,
          illustrationUrl: page.illustrationUrl,
          prompt: page.prompt,
          createdAt: new Date().toISOString(),
        })
      )
    )

    await db.collection('timelines').doc(storyId).set({
      storyId,
      year: metadata.year || new Date().getFullYear(),
      title: storyDraft.title,
      details: metadata.events?.[0] || storyDraft.story.slice(0, 120),
      createdAt: new Date().toISOString(),
    })

    res.json({ story: docData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to generate story.' })
  }
})

router.get('/stories', async (req, res) => {
  try {
    const snapshot = await db.collection('stories').orderBy('createdAt', 'desc').get()
    const stories = snapshot.docs.map((doc) => doc.data())
    res.json({ stories })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to load stories.' })
  }
})

router.get('/stories/:storyId', async (req, res) => {
  try {
    const storyId = req.params.storyId
    const storyDoc = await db.collection('stories').doc(storyId).get()
    if (!storyDoc.exists) {
      return res.status(404).json({ error: 'Story not found.' })
    }
    res.json({ story: storyDoc.data() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to load story.' })
  }
})

router.post('/conversation-suggestions', async (req, res) => {
  try {
    const { transcript, storyId } = req.body
    const source = transcript || ''
    if (!source && storyId) {
      const storyDoc = await db.collection('stories').doc(storyId).get()
      if (storyDoc.exists) {
        const story = storyDoc.data()
        source = story.story || story.transcript || ''
      }
    }
    if (!source) {
      return res.status(400).json({ error: 'Story source is required for suggestions.' })
    }
    const questions = await suggestFollowUp(source)
    res.json({ questions })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to generate conversation suggestions.' })
  }
})

export default router
