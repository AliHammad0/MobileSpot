
import { Server } from 'socket.io'

let io

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(',')
        : '*',
      methods: ['GET', 'POST']
    },

    transports: ['websocket', 'polling'],

    pingTimeout: 60000,
    pingInterval: 25000
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    // Join conversation
    socket.on('join_conversation', (conversationId) => {
      if (!conversationId) return

      socket.join(conversationId)

      socket.data.conversationId = conversationId

      socket.emit('joined_conversation', {
        conversationId
      })

      console.log(
        `Socket ${socket.id} joined ${conversationId}`
      )
    })

    // Leave conversation
    socket.on('leave_conversation', (conversationId) => {
      if (!conversationId) return

      socket.leave(conversationId)

      if (socket.data.conversationId === conversationId) {
        socket.data.conversationId = null
      }
    })

    // Typing event
    socket.on('typing', ({ conversationId, isTyping } = {}) => {
      if (
        !conversationId ||
        socket.data.conversationId !== conversationId
      ) {
        return
      }

      // Role must come from authenticated server-side identity.
      const role = socket.data.user?.role

      if (!['admin', 'customer'].includes(role)) {
        return
      }

      socket.to(conversationId).emit('user_typing', {
        conversationId,
        role,
        isTyping: Boolean(isTyping)
      })
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)

      const conversationId = socket.data.conversationId
      const role = socket.data.user?.role

      if (
        conversationId &&
        ['admin', 'customer'].includes(role)
      ) {
        socket.to(conversationId).emit('user_typing', {
          conversationId,
          role,
          isTyping: false
        })
      }
    })

    // Socket errors
    socket.on('error', (error) => {
      console.error('Socket error:', error.message)
    })
  })

  console.log('Socket.IO initialized successfully')

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized')
  }

  return io
}

export default initializeSocket
