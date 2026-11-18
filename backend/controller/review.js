
import mongoose from 'mongoose'

import Review from '../model/review.js'
import Product from '../model/product.js'
import Order from '../model/order.js'

// Get Product Reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid product ID.'
      })
    }

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found.'
      })
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })

    const totalReviews = reviews.length

    const averageRating = totalReviews
      ? Number(
          (
            reviews.reduce((total, review) => total + review.rating, 0) /
            totalReviews
          ).toFixed(1)
        )
      : 0

    return res.status(200).json({
      ok: true,
      totalReviews,
      averageRating,
      reviews
    })
  } catch (error) {
    console.error('Get product reviews error:', error.message)

    return res.status(500).json({
      ok: false,
      message: 'Unable to get product reviews.'
    })
  }
}

// Create or Update Product Review
export const createProductReview = async (req, res) => {
  try {
    const { productId } = req.params
    const { rating, comment } = req.body

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid product ID.'
      })
    }

    const numericRating = Number(rating)

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Rating must be between 1 and 5.'
      })
    }

    if (typeof comment !== 'string' || comment.trim().length < 3) {
      return res.status(400).json({
        ok: false,
        message: 'Review must contain at least 3 characters.'
      })
    }

    if (comment.trim().length > 1000) {
      return res.status(400).json({
        ok: false,
        message: 'Review cannot exceed 1000 characters.'
      })
    }

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found.'
      })
    }

    // Check whether customer has a delivered order
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      orderStatus: 'Delivered',
      'orderItems.product': productId
    }).sort({ deliveredAt: -1, updatedAt: -1 })

    if (!deliveredOrder) {
      return res.status(403).json({
        ok: false,
        message: 'You can review this product only after delivery.'
      })
    }

    const filter = {
      product: productId,
      user: req.user._id
    }

    const update = {
      $set: {
        rating: numericRating,
        comment: comment.trim(),
        order: deliveredOrder._id
      }
    }

    let review

    try {
      review = await Review.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      })
    } catch (error) {
      // Handle simultaneous duplicate submissions
      if (error.code !== 11000) {
        throw error
      }

      review = await Review.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true
      })
    }

    // Update product's average rating
    const stats = await Review.aggregate([
      {
        $match: {
          product: product._id
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' }
        }
      }
    ])

    const averageRating = stats.length
      ? Number(stats[0].averageRating.toFixed(1))
      : 0

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating
    })

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')

    return res.status(200).json({
      ok: true,
      message: 'Review submitted successfully.',
      review: populatedReview,
      averageRating
    })
  } catch (error) {
    console.error('Create product review error:', error.message)

    return res.status(500).json({
      ok: false,
      message: 'Unable to submit review.'
    })
  }
}
