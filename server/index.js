import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import audioRoutes from './routes/audioRoutes.js'
import storyRoutes from './routes/storyRoutes.js'
import responseRoutes from './routes/responseRoutes.js'
import legacyRoutes from './routes/legacyRoutes.js'

dotenv.config()

const app = express()

// Allow requests from Vercel, localhost, and other origins
app.use(cors())

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api', audioRoutes)
app.use('/api', storyRoutes)
app.use('/api', responseRoutes)
app.use('/api', legacyRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  })
})

app.use((err, req, res, next) => {
  console.error('Server Error:', err)

  res.status(500).json({
    error: err.message || 'Internal server error.',
  })
})

const port = process.env.PORT || 5175

app.listen(port, () => {
  console.log(`Memoir API server listening on port ${port}`)
})