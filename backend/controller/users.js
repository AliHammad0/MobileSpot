
import User from '../model/users.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import * as config from '../config/config.js'

// Google OAuth Client
const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID)

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id: id.toString() },
    config.SECRET_KEY,
    { expiresIn: '7d' }
  )
}

// Remove Password From Response
const formatUser = (user) => {
  const userData = user.toObject()
  delete userData.password
  return userData
}

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Please provide name, email and password.'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: 'Password must be at least 6 characters.'
      })
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    })

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: 'Email is already registered.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      authProvider: 'local'
    })

    const token = generateToken(user._id)

    return res.status(201).json({
      ok: true,
      message: 'Account created successfully!',
      token,
      user: formatUser(user)
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Please provide email and password.'
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid email or password.'
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        ok: false,
        message: 'Your account has been deactivated.'
      })
    }

    if (!user.password) {
      return res.status(400).json({
        ok: false,
        message: 'Please login using Google.'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid email or password.'
      })
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      ok: true,
      message: 'Login successful!',
      token,
      user: formatUser(user)
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Google Login / Signup
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({
        ok: false,
        message: 'Google credential is required.'
      })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({
        ok: false,
        message: 'Google email verification failed.'
      })
    }

    const email = payload.email.toLowerCase()

    let user = await User.findOne({ email })

    if (user) {
      if (user.googleId && user.googleId !== payload.sub) {
        return res.status(409).json({
          ok: false,
          message: 'This email is linked to another Google account.'
        })
      }

      if (!user.googleId) {
        user.googleId = payload.sub
        await user.save()
      }
    } else {
      user = await User.create({
        name: payload.name || 'Google User',
        email,
        googleId: payload.sub,
        authProvider: 'google',
        profileImage: payload.picture || ''
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        ok: false,
        message: 'Your account has been deactivated.'
      })
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      ok: true,
      message: 'Google login successful!',
      token,
      user: formatUser(user)
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Google authentication failed.'
    })
  }
}

// Get All Users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    return res.status(200).json({
      ok: true,
      totalUsers: users.length,
      users
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Get Single User (Admin)
export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found.'
      })
    }

    return res.status(200).json({
      ok: true,
      user: formatUser(user)
    })

  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid user ID.'
    })
  }
}

// Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        ok: false,
        message: 'User authentication required.'
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found.'
      })
    }

    return res.status(200).json({
      ok: true,
      user: formatUser(user)
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Edit My Profile
export const updateMyProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        ok: false,
        message: 'User authentication required.'
      })
    }

    const { name, phone, address, city, profileImage } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found.'
      })
    }

    if (name !== undefined) user.name = name.trim()
    if (phone !== undefined) user.phone = phone
    if (address !== undefined) user.address = address
    if (city !== undefined) user.city = city
    if (profileImage !== undefined) user.profileImage = profileImage

    await user.save()

    return res.status(200).json({
      ok: true,
      message: 'Profile updated successfully!',
      user: formatUser(user)
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Update User (Admin)
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, city, isAdmin, isActive } = req.body

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found.'
      })
    }

    if (name !== undefined) user.name = name.trim()

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase()

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id }
      })

      if (existingUser) {
        return res.status(409).json({
          ok: false,
          message: 'Email is already in use.'
        })
      }

      user.email = normalizedEmail
    }

    if (phone !== undefined) user.phone = phone
    if (address !== undefined) user.address = address
    if (city !== undefined) user.city = city
    if (isAdmin !== undefined) user.isAdmin = isAdmin
    if (isActive !== undefined) user.isActive = isActive

    await user.save()

    return res.status(200).json({
      ok: true,
      message: 'User updated successfully!',
      user: formatUser(user)
    })

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
}

// Delete User (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found.'
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'User deleted successfully!'
    })

  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid user ID.'
    })
  }
}
