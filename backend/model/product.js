
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    brand: {
      type: String,
      required: true,
      trim: true
    },

    model: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Mobile Phones',
        'Smartphones',
        'Accessories'
      ],
      default: 'Mobile Phones'
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    oldPrice: {
      type: Number,
      default: 0,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (images) {
          return images.length >= 1 && images.length <= 5
        },
        message: 'Product must have between 1 and 5 images.'
      }
    },

    specifications: {
      display: {
        type: String,
        default: ''
      },

      processor: {
        type: String,
        default: ''
      },

      ram: {
        type: String,
        default: ''
      },

      storage: {
        type: String,
        default: ''
      },

      rearCamera: {
        type: String,
        default: ''
      },

      frontCamera: {
        type: String,
        default: ''
      },

      battery: {
        type: String,
        default: ''
      },

      operatingSystem: {
        type: String,
        default: ''
      },

      network: {
        type: String,
        default: ''
      }
    },

    colors: {
      type: [String],
      default: []
    },

    expressDelivery: {
      type: Boolean,
      default: false
    },

    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model('Product', productSchema)

export default Product
