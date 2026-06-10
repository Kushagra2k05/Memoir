import express from 'express'
import multer from 'multer'
import { db, storage } from '../firebaseAdmin.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } })

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required.' })
    }

    const filename = `recordings/${Date.now()}-${req.file.originalname || 'memory.webm'}`
    const file = storage.file(filename)
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
      public: false,
    })

    // Transcription handled on client-side via Web Speech API
    // TODO: Implement server-side transcription with a free service if needed
    const transcript = ''

    const storyId = `story-${Date.now()}`
    await db.collection('stories').doc(storyId).set({
      id: storyId,
      transcript,
      audioPath: filename,
      audioContentType: req.file.mimetype,
      status: 'transcribed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    res.json({ transcript, storyId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to transcribe audio.' })
  }
})

export default router
