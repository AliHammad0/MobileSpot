
import { createServer } from 'http'

import * as config from './config/config.js'
import DBconfig from './config/DBconfig.js'
import initializeSocket from './config/socket.js'

const httpServer = createServer()

initializeSocket(httpServer)

const PORT = process.env.PORT || config.PORT || 8080

const startServer = async () => {
  try {
    await DBconfig()

    httpServer.listen(PORT, () => {
      console.log(`MobileSpot Socket.IO server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Socket server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
