
import express from 'express'

import {
  register,
  login,
  googleLogin,
  getAllUsers,
  getSingleUser,
  getMyProfile,
  updateMyProfile,
  updateUser,
  deleteUser
} from '../controller/users.js'

import { protect, admin } from '../middleware/auth.js'

const userRoutes = express.Router()

// Public Authentication Routes
userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.post('/google-login', googleLogin)

// Logged-in User Routes
userRoutes.get('/me', protect, getMyProfile)
userRoutes.put('/me', protect, updateMyProfile)

// Admin Routes
userRoutes.get('/', protect, admin, getAllUsers)
userRoutes.get('/:id', protect, admin, getSingleUser)
userRoutes.put('/:id', protect, admin, updateUser)
userRoutes.delete('/:id', protect, admin, deleteUser)

export default userRoutes
