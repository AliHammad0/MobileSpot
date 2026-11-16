
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      select: false,
      minlength: 6
    },

    googleId: {
      type: String,
      default: null
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },

    phone: {
      type: String,
      default: ''
    },

    address: {
      type: String,
      default: ''
    },

    city: {
      type: String,
      default: ''
    },

    profileImage: {
      type: String,
      default: ''
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

export default User
