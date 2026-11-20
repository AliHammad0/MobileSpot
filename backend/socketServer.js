
import { createServer } from 'http'

import * as config from './config/config.js'
import DBconfig from './config/DBconfig.js'
import initializeSocket from './config/socket.js'

const httpServer = createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      ok: true,
      message: 'MobileSpot Socket.IO server is running'
    }))
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    ok: false,
    message: 'Route not found'
  }))
})

initializeSocket(httpServer)

const PORT = process.env.PORT || config.PORT || 8080

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`MobileSpot Socket.IO server running on port ${PORT}`)

  DBconfig()
    .then(() => {
      console.log('MongoDB connected successfully')
    })
    .catch((error) => {
      console.error('MongoDB connection failed:', error.message)
    })
})
