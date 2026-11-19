
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
      methods: ['GET', 'POST']
    }
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

  // Check whether customer has another active socket in this room
  const isCustomerOnline = async (conversationId) => {
    const sockets = await io
      .in(conversationId.toString())
      .fetchSockets()

    return sockets.some(
      (connectedSocket) =>
        !connectedSocket.user?.isAdmin
    )
  }

  io.on('connection', (socket) => {
    console.log('Authenticated user connected:', socket.user._id)

    // Join conversation room
    socket.on('join_conversation', async (conversationId) => {
      try {
        if (!conversationId) {
          socket.emit('chat_error', 'Conversation ID is required')
          return
        }

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

        const room = conversationId.toString()

        socket.join(room)

        socket.emit('joined_conversation', {
          conversationId: room
        })

        // Send current customer online status to everyone in the room
        const customerOnline = await isCustomerOnline(room)

        io.to(room).emit('participant_status', {
          conversationId: room,
          role: 'customer',
          online: customerOnline
        })
      } catch (error) {
        console.log('Join conversation error:', error.message)
        socket.emit('chat_error', 'Unable to join conversation')
      }
    })

    // Typing indicator
    socket.on('typing', async (data) => {
      try {
        const { conversationId, isTyping } = data || {}

        if (
          !conversationId ||
          typeof isTyping !== 'boolean'
        ) {
          return
        }

        const room = conversationId.toString()

        // User must have joined this conversation
        if (!socket.rooms.has(room)) {
          return
        }

        io.to(room).except(socket.id).emit('user_typing', {
          conversationId: room,
          role: socket.user.isAdmin ? 'admin' : 'customer',
          isTyping
        })
      } catch (error) {
        console.log('Typing event error:', error.message)
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

        const room = conversationId.toString()

        if (!socket.rooms.has(room)) {
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

        // Stop typing indicator after sending
        io.to(room).emit('user_typing', {
          conversationId: room,
          role: isAdmin ? 'admin' : 'customer',
          isTyping: false
        })

        // Send message to all participants
        io.to(room).emit('new_message', populatedMessage)
      } catch (error) {
        console.log('Socket message error:', error.message)
        socket.emit('chat_error', 'Message could not be sent')
      }
    })

    // Disconnect
    socket.on('disconnecting', () => {
      // Stop typing indicator in every joined conversation
      for (const room of socket.rooms) {
        if (room === socket.id) continue

        socket.to(room).emit('user_typing', {
          conversationId: room,
          role: socket.user.isAdmin ? 'admin' : 'customer',
          isTyping: false
        })
      }
    })

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.user._id)

      try {
        // Check rooms this socket was connected to.
        // Socket.IO removes room membership after disconnect.
        const joinedRooms = [...socket.rooms]

        for (const room of joinedRooms) {
          if (room === socket.id) continue

          const customerOnline = await isCustomerOnline(room)

          io.to(room).emit('participant_status', {
            conversationId: room,
            role: 'customer',
            online: customerOnline
          })
        }
      } catch (error) {
        console.log('Presence update error:', error.message)
      }
    })
  })

  return io
}

export default initializeSocket
