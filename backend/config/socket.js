
import { Server } from 'socket.io'

let io

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(',').map(url => url.trim())
        : '*',
      methods: ['GET', 'POST']
    },

    transports: ['websocket', 'polling'],

    pingTimeout: 60000,
    pingInterval: 25000
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    // Store joined conversations
    socket.data.conversations = new Set()

    // JOIN CONVERSATION
    socket.on('join_conversation', (conversationId) => {
      if (!conversationId) return

      socket.join(conversationId)

      socket.data.conversations.add(conversationId)

      socket.emit('joined_conversation', {
        conversationId
      })

      console.log(
        `Socket ${socket.id} joined conversation ${conversationId}`
      )
    })

    // LEAVE CONVERSATION
    socket.on('leave_conversation', (conversationId) => {
      if (!conversationId) return

      socket.leave(conversationId)

      socket.data.conversations.delete(conversationId)

      const role = socket.data.user?.role

      if (['admin', 'customer'].includes(role)) {
        socket.to(conversationId).emit('user_typing', {
          conversationId,
          role,
          isTyping: false
        })
      }
    })

    // WHATSAPP STYLE TYPING INDICATOR
    socket.on('typing', (data = {}) => {
      const { conversationId, isTyping } = data

      if (
        !conversationId ||
        !socket.data.conversations.has(conversationId)
      ) {
        return
      }

      // Get authenticated user role
      const role = socket.data.user?.role

      if (!['admin', 'customer'].includes(role)) {
        return
      }

      // Send typing event to other conversation participants
      socket.to(conversationId).emit('user_typing', {
        conversationId,
        role,
        isTyping: Boolean(isTyping)
      })

      console.log(
        `${role} typing:`,
        conversationId,
        Boolean(isTyping)
      )
    })

    // DISCONNECT
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)

      const role = socket.data.user?.role

      // Stop typing in all joined conversations
      if (['admin', 'customer'].includes(role)) {
        for (const conversationId of socket.data.conversations) {
          socket.to(conversationId).emit('user_typing', {
            conversationId,
            role,
            isTyping: false
          })
        }
      }
    })

    // SOCKET ERROR
    socket.on('error', (error) => {
      console.error('Socket error:', error.message)
    })
  })

  console.log('Socket.IO initialized successfully')

  return io
}

// GET SOCKET INSTANCE
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized')
  }

  return io
}

export default initializeSocket
