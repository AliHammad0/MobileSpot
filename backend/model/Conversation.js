
import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    chatType: {
      type: String,
      enum: ['support', 'order'],
      required: true
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },

    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    },

    lastMessage: {
      type: String,
      default: ''
    },

    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

const Conversation = mongoose.model(
  'Conversation',
  conversationSchema
)

export default Conversation
