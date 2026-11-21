
import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    senderRole: {
      type: String,
      enum: ['customer', 'admin'],
      required: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    clientMessageId: {
      type: String,
      default: null
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// Prevent duplicate messages from the same sender
messageSchema.index(
  {
    conversation: 1,
    sender: 1,
    clientMessageId: 1
  },
  {
    unique: true,
    partialFilterExpression: {
      clientMessageId: { $type: 'string' }
    }
  }
)

const Message = mongoose.model('Message', messageSchema)

export default Message
