
import express from 'express'

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder,
  deleteMyOrder
} from '../controller/order.js'

import { protect, admin } from '../middleware/auth.js'

const orderRoutes = express.Router()

// User Routes
orderRoutes.post('/', protect, createOrder)
orderRoutes.get('/my-orders', protect, getMyOrders)
orderRoutes.get('/:id', protect, getOrderById)
orderRoutes.put('/:id/cancel', protect, cancelMyOrder)
orderRoutes.delete('/:id', protect, deleteMyOrder)

// Admin Routes
orderRoutes.get('/', protect, admin, getAllOrders)
orderRoutes.put('/:id/status', protect, admin, updateOrderStatus)

export default orderRoutes
