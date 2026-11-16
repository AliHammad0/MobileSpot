
import mongoose from 'mongoose'

const luckySpinSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true
    },

    rewardType: {
      type: String,
      enum: ['discount', 'free_shipping', 'try_again'],
      default: null
    },

    rewardValue: {
      type: Number,
      default: 0,
      min: 0
    },

    rewardLabel: {
      type: String,
      default: ''
    },

    couponCode: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },

    status: {
      type: String,
      enum: ['pending', 'active', 'used', 'expired'],
      default: 'pending'
    },

    spunAt: {
      type: Date,
      default: null
    },

    expiresAt: {
      type: Date,
      default: null
    },

    usedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const LuckySpin = mongoose.model('LuckySpin', luckySpinSchema)

export default LuckySpin
