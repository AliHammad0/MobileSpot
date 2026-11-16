
import express from 'express'

import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getRecommendedProducts
} from '../controller/product.js'

import { protect, admin } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const productRoutes = express.Router()

// Public Routes
productRoutes.get('/search', searchProducts)
productRoutes.get('/recommended', getRecommendedProducts)
productRoutes.get('/', getAllProducts)
productRoutes.get('/:id', getSingleProduct)

// Admin Protected Routes
productRoutes.post(
  '/',
  protect,
  admin,
  upload.array('images', 5),
  addProduct
)

productRoutes.put(
  '/:id',
  protect,
  admin,
  upload.array('images', 5),
  updateProduct
)

productRoutes.delete('/:id', protect, admin, deleteProduct)

export default productRoutes
