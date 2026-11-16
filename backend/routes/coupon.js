
import express from 'express'

import {
  createCoupon,
  getAllCoupons,
  validateCoupon,
  deleteCoupon
} from '../controller/coupon.js'

import { protect, admin } from '../middleware/auth.js'

const couponRoutes = express.Router()

// Validate Coupon
couponRoutes.post('/validate', validateCoupon)

// Admin Routes
couponRoutes.post('/',  createCoupon)
couponRoutes.get('/', protect, admin, getAllCoupons)
couponRoutes.delete('/:id', protect, admin, deleteCoupon)

export default couponRoutes
