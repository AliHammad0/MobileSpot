
import { createServer } from 'http'

import * as config from './config/config.js'
import DBconfig from './config/DBconfig.js'
import initializeSocket from './config/socket.js'

const httpServer = createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })

    res.end(JSON.stringify({
      ok: true,
      message: 'MobileSpot Socket.IO server is running'
    }))

    return
  }

  res.writeHead(404, {
    'Content-Type': 'application/json'
  })

  res.end(JSON.stringify({
    ok: false,
    message: 'Route not found'
  }))
})

const PORT = process.env.PORT || config.PORT || 8080

const startServer = async () => {
  try {
    await DBconfig()

    initializeSocket(httpServer)

    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`MobileSpot Socket.IO server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Socket server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
