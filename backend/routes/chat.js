
import express from 'express'

import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage
} from '../controller/chat.js'

import { protect } from '../middleware/auth.js'

const router = express.Router()

// Create New Conversation
router.post('/conversation', protect, createConversation)

// Get Customer Conversations
router.get('/conversations', protect, getConversations)

// Get Conversation Messages
router.get('/messages/:conversationId', protect, getMessages)

// Send Message
router.post('/messages/:conversationId', protect, sendMessage)

export default router
