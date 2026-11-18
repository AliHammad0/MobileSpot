
import express from 'express'

import {
  getProductReviews,
  createProductReview
} from '../controller/review.js'

import { protect } from '../middleware/auth.js'

const reviewRoutes = express.Router()

// Get all reviews of a product
reviewRoutes.get('/:productId', getProductReviews)

// Submit or update a product review
reviewRoutes.post('/:productId', protect, createProductReview)

export default reviewRoutes
