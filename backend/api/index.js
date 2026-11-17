
import app from '../server.js'
import DBconfig from '../config/DBconfig.js'

let dbPromise

export default async function handler(req, res) {
  try {
    if (!dbPromise) {
      dbPromise = DBconfig()
    }

    await dbPromise

    return app(req, res)
  } catch (error) {
    dbPromise = null

    console.error('API Error:', error.message)

    return res.status(500).json({
      ok: false,
      message: 'Server or database connection failed'
    })
  }
}
