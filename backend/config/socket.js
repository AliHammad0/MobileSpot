
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import config from './config.js'
import User from '../model/users.js'
import Conversation from '../model/Conversation.js'
import Message from '../model/message.js'

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

  // JWT AUTHENTICATION
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token

      if (!token) {
        return next(new Error('Authentication required'))
      }

      const decoded = jwt.verify(token, config.SECRET_KEY)

      const user = await User.findById(decoded.id)

      if (!user || !user.isActive) {
        return next(new Error('Invalid user'))
      }

      socket.user = user
      socket.data.user = user

      next()
    } catch (error) {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    socket.data.conversations = new Set()

    const role = socket.user.isAdmin ? 'admin' : 'customer'

    // JOIN CONVERSATION
    socket.on('join_conversation', async (conversationId) => {
      try {
        if (!conversationId) return

        const conversation = await Conversation.findById(conversationId)

        if (!conversation) {
          return socket.emit('chat_error', {
            message: 'Conversation not found'
          })
        }

        const isCustomer =
          conversation.customer.toString() === socket.user._id.toString()

        if (!socket.user.isAdmin && !isCustomer) {
          return socket.emit('chat_error', {
            message: 'Access denied'
          })
        }

        socket.join(conversationId)
        socket.data.conversations.add(conversationId)

        socket.emit('joined_conversation', {
          conversationId
        })

        console.log('Joined conversation:', conversationId)
      } catch (error) {
        console.error('Join error:', error.message)

        socket.emit('chat_error', {
          message: 'Unable to join conversation'
        })
      }
    })

    // SEND MESSAGE
    socket.on('send_message', async (data = {}) => {
      try {
        const { conversationId, message } = data

        if (!conversationId || !message || typeof message !== 'string' || !message.trim()) {
          return socket.emit('chat_error', {
            message: 'Message cannot be empty'
          })
        }

        if (!socket.data.conversations.has(conversationId)) {
          return socket.emit('chat_error', {
            message: 'Join conversation first'
          })
        }

        const conversation = await Conversation.findById(conversationId)

        if (!conversation) {
          return socket.emit('chat_error', {
            message: 'Conversation not found'
          })
        }

        if (conversation.status !== 'open') {
          return socket.emit('chat_error', {
            message: 'This conversation is closed'
          })
        }

        const isCustomer =
          conversation.customer.toString() === socket.user._id.toString()

        if (!socket.user.isAdmin && !isCustomer) {
          return socket.emit('chat_error', {
            message: 'Access denied'
          })
        }

        const newMessage = await Message.create({
          conversation: conversationId,
          sender: socket.user._id,
          senderRole: role,
          message: message.trim()
        })

        conversation.lastMessage = message.trim()
        conversation.lastMessageAt = new Date()

        if (socket.user.isAdmin) {
          conversation.admin = socket.user._id
        }

        await conversation.save()

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'name email')

        // SEND MESSAGE TO ALL PARTICIPANTS
        io.to(conversationId).emit('new_message', populatedMessage)

        console.log('Message sent:', conversationId)
      } catch (error) {
        console.error('Send message error:', error.message)

        socket.emit('chat_error', {
          message: 'Unable to send message'
        })
      }
    })

    // TYPING INDICATOR
    socket.on('typing', (data = {}) => {
      const { conversationId, isTyping } = data

      if (
        !conversationId ||
        !socket.data.conversations.has(conversationId)
      ) {
        return
      }

      socket.to(conversationId).emit('user_typing', {
        conversationId,
        role,
        isTyping: Boolean(isTyping)
      })
    })

    // LEAVE CONVERSATION
    socket.on('leave_conversation', (conversationId) => {
      if (!conversationId) return

      socket.leave(conversationId)
      socket.data.conversations.delete(conversationId)

      socket.to(conversationId).emit('user_typing', {
        conversationId,
        role,
        isTyping: false
      })
    })

    // DISCONNECT
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)

      for (const conversationId of socket.data.conversations) {
        socket.to(conversationId).emit('user_typing', {
          conversationId,
          role,
          isTyping: false
        })
      }
    })

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
