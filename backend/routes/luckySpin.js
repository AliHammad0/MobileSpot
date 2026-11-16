
import express from 'express'

import {
  getMyLuckySpins,
  spinLuckyWheel
} from '../controller/luckySpin.js'

import { protect } from '../middleware/auth.js'

const luckySpinRoutes = express.Router()

// Customer Routes
luckySpinRoutes.get('/my-spins', protect, getMyLuckySpins)
luckySpinRoutes.post('/spin', protect, spinLuckyWheel)

export default luckySpinRoutes
