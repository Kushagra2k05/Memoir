let db = null
let storage = null
let FieldValue = null

// Initialize Firebase Admin if credentials are available
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    import('firebase-admin').then((admin) => {
      const app = admin.default.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      })
      db = admin.default.firestore()
      storage = admin.default.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET)
      FieldValue = admin.default.firestore.FieldValue
    }).catch((error) => {
      console.warn('Firebase Admin initialization skipped (local development):', error.message)
    })
  } catch (error) {
    console.warn('Firebase Admin not available (local development mode):', error.message)
  }
} else {
  console.warn('Firebase Admin credentials not configured - local development mode')
}

export { db, storage, FieldValue }