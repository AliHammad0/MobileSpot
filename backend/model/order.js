
import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: true }
)

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'Pakistan' }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: items => items.length > 0,
        message: 'Order must contain at least one product.'
      }
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },

    paymentMethod: {
      type: String,
      required: true,
      default: 'COD',
      enum: ['COD', 'Stripe']
    },

    itemsPrice: {
      type: Number,
      required: true,
      min: 0
    },

    shippingPrice: {
      type: Number,
      default: 0,
      min: 0
    },

    couponCode: {
      type: String,
      default: ''
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },

    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: {
      type: Date,
      default: null
    },

    deliveredAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
