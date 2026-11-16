
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { createServer } from 'http'

import * as config from './config/config.js'
import DBconfig from './config/DBconfig.js'
import initializeSocket from './config/socket.js'

import productRoutes from './routes/product.js'
import userRoutes from './routes/users.js'
import orderRoutes from './routes/order.js'
import couponRoutes from './routes/coupon.js'
import uploadRoutes from './routes/upload.js'
import chatRoutes from './routes/chat.js'
import luckySpinRoutes from './routes/luckySpin.js'

const app = express()
const httpServer = createServer(app)

// Initialize Socket.IO
const io = initializeSocket(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Mobile Store API is running'
  })
})

app.use('/api/v1/products', productRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/coupon', couponRoutes)
app.use('/api/v1/upload', uploadRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/lucky-spin', luckySpinRoutes)

const port = config.PORT || 8080

const startServer = async () => {
  try {
    await DBconfig()

    httpServer.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
      console.log('Socket.IO is ready')
      console.log('Real-time chat is ready')
      console.log('Lucky Spin system is ready')
    })
  } catch (error) {
    console.log('Server startup error:', error.message)
  }
}

startServer()
