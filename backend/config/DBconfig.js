
import mongoose from 'mongoose'
import dns from 'node:dns'

import * as config from './config.js'

dns.setServers(['8.8.8.8', '8.8.4.4'])

let connectionPromise = null

const DBconfig = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!connectionPromise) {
        connectionPromise = mongoose.connect(config.MONGO, {
          serverSelectionTimeoutMS: 10000
        })
      }

      await connectionPromise
      console.log('MongoDB connected successfully')
    }

    // Remove only the old review index
    const reviewsCollection = mongoose.connection.collection('reviews')
    const indexes = await reviewsCollection.indexes()

    const oldIndexExists = indexes.some(
      (index) => index.name === 'product_1_user_1'
    )

    if (oldIndexExists) {
      await reviewsCollection.dropIndex('product_1_user_1')
      console.log('Old review index removed successfully')
    }
  } catch (error) {
    connectionPromise = null
    console.log('MongoDB connection or index migration failed:', error.message)
    throw error
  }
}

export default DBconfig
