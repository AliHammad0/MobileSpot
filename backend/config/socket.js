
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

  // Socket Authentication
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

  // Check Customer Online Status
  const isCustomerOnline = async (conversationId) => {
    const sockets = await io.in(conversationId.toString()).fetchSockets()

    return sockets.some(
      (connectedSocket) => !connectedSocket.user?.isAdmin
    )
  }

  io.on('connection', (socket) => {
    console.log('Authenticated user connected:', socket.user._id)

    // Join Conversation
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

        await socket.join(room)

        socket.emit('joined_conversation', {
          conversationId: room
        })

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

    // Typing Indicator
    socket.on('typing', async (data) => {
      try {
        const { conversationId, isTyping } = data || {}

        if (!conversationId || typeof isTyping !== 'boolean') return

        const room = conversationId.toString()

        if (!socket.rooms.has(room)) return

        socket.to(room).emit('user_typing', {
          conversationId: room,
          role: socket.user.isAdmin ? 'admin' : 'customer',
          isTyping
        })
      } catch (error) {
        console.log('Typing event error:', error.message)
      }
    })

    // Send Message with Duplicate Protection
    socket.on('send_message', async (data, acknowledge) => {
      try {
        const { conversationId, message, clientMessageId } = data || {}

        if (
          !conversationId ||
          typeof message !== 'string' ||
          !message.trim()
        ) {
          throw new Error('Valid message is required')
        }

        if (
          clientMessageId !== undefined &&
          (
            typeof clientMessageId !== 'string' ||
            !clientMessageId.trim() ||
            clientMessageId.length > 100
          )
        ) {
          throw new Error('Invalid message ID')
        }

        const conversation = await Conversation.findById(conversationId)

        if (!conversation || conversation.status !== 'open') {
          throw new Error('Conversation is unavailable')
        }

        const isCustomer =
          conversation.customer.toString() === socket.user._id.toString()

        const isAdmin = socket.user.isAdmin

        if (!isCustomer && !isAdmin) {
          throw new Error('Access denied')
        }

        const room = conversationId.toString()

        if (!socket.rooms.has(room)) {
          throw new Error('Join the conversation first')
        }

        const cleanMessage = message.trim()
        const cleanClientMessageId = clientMessageId?.trim()

        // Check whether this message was already saved
        let savedMessage = null
        let isNewMessage = false

        if (cleanClientMessageId) {
          savedMessage = await Message.findOne({
            conversation: conversationId,
            sender: socket.user._id,
            clientMessageId: cleanClientMessageId
          })
        }

        // Save only if it does not already exist
        if (!savedMessage) {
          try {
            savedMessage = await Message.create({
              conversation: conversationId,
              sender: socket.user._id,
              senderRole: isAdmin ? 'admin' : 'customer',
              message: cleanMessage,
              ...(cleanClientMessageId
                ? { clientMessageId: cleanClientMessageId }
                : {})
            })

            isNewMessage = true
          } catch (error) {
            // Handle simultaneous duplicate requests
            if (error.code !== 11000 || !cleanClientMessageId) {
              throw error
            }

            savedMessage = await Message.findOne({
              conversation: conversationId,
              sender: socket.user._id,
              clientMessageId: cleanClientMessageId
            })

            if (!savedMessage) {
              throw error
            }
          }
        }

        // Update conversation only for a newly saved message
        if (isNewMessage) {
          conversation.lastMessage = cleanMessage
          conversation.lastMessageAt = new Date()

          if (isAdmin) {
            conversation.admin = socket.user._id
          }

          await conversation.save()
        }

        const populatedMessage = await Message.findById(savedMessage._id)
          .populate('sender', 'name email')

        // Stop typing indicator
        io.to(room).emit('user_typing', {
          conversationId: room,
          role: isAdmin ? 'admin' : 'customer',
          isTyping: false
        })

        // Broadcast only newly saved messages
        if (isNewMessage) {
          io.to(room).emit('new_message', populatedMessage)
        }

        // Confirm successful message delivery to sender
        if (typeof acknowledge === 'function') {
          acknowledge({
            ok: true,
            message: populatedMessage
          })
        }
      } catch (error) {
        console.log('Socket message error:', error.message)

        const errorResponse = {
          ok: false,
          message: error.message || 'Message could not be sent'
        }

        if (typeof acknowledge === 'function') {
          acknowledge(errorResponse)
        }

        socket.emit('chat_error', errorResponse.message)
      }
    })

    // Stop Typing When Disconnecting
    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (room === socket.id) continue

        socket.to(room).emit('user_typing', {
          conversationId: room,
          role: socket.user.isAdmin ? 'admin' : 'customer',
          isTyping: false
        })
      }
    })

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.user._id)
    })
  })

  return io
}

export default initializeSocket
