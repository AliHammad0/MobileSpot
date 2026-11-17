
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

import * as config from './config.js'
import User from '../model/users.js'
import Conversation from '../model/Conversation.js'
import Message from '../model/message.js'

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: false
    },
    transports: ['websocket', 'polling']
  })

  // Socket authentication
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
      next()
    } catch (error) {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => {
    console.log('Authenticated user connected:', socket.user._id)

    // Join conversation room
    socket.on('join_conversation', async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId)

        if (!conversation) {
          socket.emit('chat_error', 'Conversation not found')
          return
        }

        const isCustomer =
          conversation.customer.toString() === socket.user._id.toString()

        const isAdmin = socket.user.isAdmin

        if (!isCustomer && !isAdmin) {
          socket.emit('chat_error', 'Access denied')
          return
        }

        socket.join(conversationId.toString())

        socket.emit('joined_conversation', {
          conversationId: conversationId.toString()
        })
      } catch (error) {
        console.log('Join conversation error:', error.message)
        socket.emit('chat_error', 'Unable to join conversation')
      }
    })

    // Send real-time message
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, message } = data || {}

        if (
          !conversationId ||
          typeof message !== 'string' ||
          !message.trim()
        ) {
          socket.emit('chat_error', 'Valid message is required')
          return
        }

        const conversation = await Conversation.findById(conversationId)

        if (!conversation || conversation.status !== 'open') {
          socket.emit('chat_error', 'Conversation is unavailable')
          return
        }

        const isCustomer =
          conversation.customer.toString() === socket.user._id.toString()

        const isAdmin = socket.user.isAdmin

        if (!isCustomer && !isAdmin) {
          socket.emit('chat_error', 'Access denied')
          return
        }

        if (!socket.rooms.has(conversationId.toString())) {
          socket.emit('chat_error', 'Join the conversation first')
          return
        }

        const newMessage = await Message.create({
          conversation: conversationId,
          sender: socket.user._id,
          senderRole: isAdmin ? 'admin' : 'customer',
          message: message.trim()
        })

        conversation.lastMessage = message.trim()
        conversation.lastMessageAt = new Date()

        if (isAdmin) {
          conversation.admin = socket.user._id
        }

        await conversation.save()

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'name email')

        io.to(conversationId.toString()).emit(
          'new_message',
          populatedMessage
        )
      } catch (error) {
        console.log('Socket message error:', error.message)
        socket.emit('chat_error', 'Message could not be sent')
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user._id)
    })
  })

  return io
}

export default initializeSocket
