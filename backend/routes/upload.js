
import express from 'express'

import { protect, admin } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { uploadImage } from '../controller/upload.js'

const uploadRoutes = express.Router()

uploadRoutes.post(
  '/',
  
  upload.single('image'),
  uploadImage
)

export default uploadRoutes
