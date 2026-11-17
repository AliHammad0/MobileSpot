
import mongoose from 'mongoose'
import dns from 'node:dns'

import * as config from './config.js'

dns.setServers(['8.8.8.8', '8.8.4.4'])

let connectionPromise = null

const DBconfig = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(config.MONGO, {
        serverSelectionTimeoutMS: 10000
      })
    }

    await connectionPromise

    console.log('MongoDB connected successfully')
  } catch (error) {
    connectionPromise = null
    console.log('MongoDB connection failed:', error.message)
    throw error
  }
}

export default DBconfig
