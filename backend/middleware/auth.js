
import jwt from 'jsonwebtoken'
import User from '../model/users.js'
import * as config from '../config/config.js'

// Protect: Check user login
export const protect = async (req, res, next) => {
  try {
    let token

    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'Not authorized. Please login first.'
      })
    }

    const decoded = jwt.verify(token, config.SECRET_KEY)

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'User not found.'
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        ok: false,
        message: 'Your account has been disabled.'
      })
    }

    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid or expired token.'
    })
  }
}

// Admin: Check admin permission
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next()
  }

  return res.status(403).json({
    ok: false,
    message: 'Access denied. Admin permission required.'
  })
}


