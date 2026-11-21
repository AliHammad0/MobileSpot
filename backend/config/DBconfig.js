
import mongoose from 'mongoose'
import dns from 'node:dns'

import * as config from './config.js'

dns.setServers(['8.8.8.8', '8.8.4.4'])

let connectionPromise = null

const DBconfig = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.MONGO, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10
    }).then(() => {
      console.log('MongoDB connected successfully')
      return mongoose.connection
    }).catch((error) => {
      connectionPromise = null
      console.error('MongoDB connection failed:', error.message)
      throw error
    })
  }

  return connectionPromise
}

export default DBconfig
