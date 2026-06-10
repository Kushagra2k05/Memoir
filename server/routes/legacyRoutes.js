import express from 'express'
import { db } from '../firebaseAdmin.js'

const router = express.Router()

router.get('/timeline', async (req, res) => {
  try {
    const snapshot = await db.collection('timelines').orderBy('year', 'asc').get()
    const timeline = snapshot.docs.map((doc) => doc.data())
    res.json({ timeline })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to load family timeline.' })
  }
})

export default router
