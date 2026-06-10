import express from 'express'
import { db, storage } from '../firebaseAdmin.js'

const router = express.Router()

async function uploadDrawingDataUrl(dataUrl, storyId) {
  if (!dataUrl?.startsWith('data:image')) return null
  const [meta, base64String] = dataUrl.split(',')
  const buffer = Buffer.from(base64String, 'base64')
  const filename = `responses/${storyId}/drawing-${Date.now()}.png`
  const file = storage.file(filename)
  await file.save(buffer, { contentType: 'image/png' })
  await file.makePublic?.()
  return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`
}

router.post('/responses', async (req, res) => {
  try {
    const { storyId, question, heart, drawingDataUrl, voiceDataUrl, voiceNote } = req.body
    if (!storyId) {
      return res.status(400).json({ error: 'storyId is required.' })
    }

    const drawingUrl = drawingDataUrl ? await uploadDrawingDataUrl(drawingDataUrl, storyId) : null

    const responseDoc = {
      storyId,
      question: question || null,
      heart: Boolean(heart),
      drawingUrl,
      voiceDataUrl: voiceDataUrl || null,
      voiceNote: voiceNote || null,
      createdAt: new Date().toISOString(),
    }

    const addedDoc = await db.collection('childResponses').add(responseDoc)
    res.json({ id: addedDoc.id, ...responseDoc })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to save child response.' })
  }
})

router.get('/responses/:storyId', async (req, res) => {
  try {
    const storyId = req.params.storyId
    const snapshot = await db.collection('childResponses').where('storyId', '==', storyId).orderBy('createdAt', 'desc').get()
    const responses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json({ responses })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to load child responses.' })
  }
})

export default router
