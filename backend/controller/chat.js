
import mongoose from 'mongoose'

import Conversation from '../model/Conversation.js'
import Message from '../model/message.js'
import Order from '../model/order.js'

// Create Conversation
export const createConversation = async (req, res) => {
  try {
    const { chatType, orderId } = req.body
    const customerId = req.user._id

    // Admin cannot create customer conversations
    if (req.user.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: 'Only customers can create conversations'
      })
    }

    if (!['support', 'order'].includes(chatType)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid chat type'
      })
    }

    // Verify Order
    if (chatType === 'order') {
      if (!orderId || !mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({
          ok: false,
          message: 'Valid Order ID is required'
        })
      }

      const order = await Order.findOne({
        _id: orderId,
        user: customerId
      })

      if (!order) {
        return res.status(404).json({
          ok: false,
          message: 'Order not found or access denied'
        })
      }
    }

    // Check Existing Conversation
    const filter = {
      customer: customerId,
      chatType,
      status: 'open'
    }

    if (chatType === 'order') {
      filter.order = orderId
    }

    const existingConversation = await Conversation.findOne(filter)

    if (existingConversation) {
      return res.status(200).json({
        ok: true,
        message: 'Conversation already exists',
        conversation: existingConversation
      })
    }

    // Create Conversation
    const conversation = await Conversation.create({
      customer: customerId,
      chatType,
      order: chatType === 'order' ? orderId : null
    })

    return res.status(201).json({
      ok: true,
      message: 'Conversation created successfully',
      conversation
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Get Conversations
export const getConversations = async (req, res) => {
  try {
    let filter = {}

    // Customer sees only their conversations
    // Admin sees all conversations
    if (!req.user.isAdmin) {
      filter.customer = req.user._id
    }

    const conversations = await Conversation.find(filter)
      .populate('customer', 'name email')
      .populate('admin', 'name email')
      .populate('order')
      .sort({ lastMessageAt: -1 })

    return res.status(200).json({
      ok: true,
      conversations
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Get Conversation Messages
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid conversation ID'
      })
    }

    const conversation = await Conversation.findById(conversationId)

    if (!conversation) {
      return res.status(404).json({
        ok: false,
        message: 'Conversation not found'
      })
    }

    const isCustomer =
      conversation.customer.toString() === req.user._id.toString()

    const isAdmin = req.user.isAdmin === true

    if (!isCustomer && !isAdmin) {
      return res.status(403).json({
        ok: false,
        message: 'Access denied'
      })
    }

    const messages = await Message.find({
      conversation: conversationId
    })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })

    return res.status(200).json({
      ok: true,
      messages
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params
    const { message } = req.body

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid conversation ID'
      })
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        ok: false,
        message: 'Message is required'
      })
    }

    const conversation = await Conversation.findById(conversationId)

    if (!conversation || conversation.status !== 'open') {
      return res.status(404).json({
        ok: false,
        message: 'Open conversation not found'
      })
    }

    const isCustomer =
      conversation.customer.toString() === req.user._id.toString()

    const isAdmin = req.user.isAdmin === true

    if (!isCustomer && !isAdmin) {
      return res.status(403).json({
        ok: false,
        message: 'Access denied'
      })
    }

    // Save Message
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      senderRole: isAdmin ? 'admin' : 'customer',
      message: message.trim()
    })

    // Update Conversation
    conversation.lastMessage = message.trim()
    conversation.lastMessageAt = new Date()

    if (isAdmin) {
      conversation.admin = req.user._id
    }

    await conversation.save()

    return res.status(201).json({
      ok: true,
      message: 'Message sent successfully',
      newMessage
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}
