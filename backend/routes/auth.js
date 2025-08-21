const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body)
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password')
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email
    console.log('Looking for user with email:', email)
    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found')
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    console.log('User found:', user.email)
    // Check password
    const isMatch = await user.comparePassword(password)
    console.log('Password match:', isMatch)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    })
  }
})

// @route   GET /api/auth/verify
// @desc    Verify token and get user data
// @access  Private
router.get('/verify', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        preferences: req.user.preferences
      }
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ message: 'Server error during token verification' })
  }
})

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, preferences } = req.body
    
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (name) user.name = name
    if (preferences) user.preferences = { ...user.preferences, ...preferences }

    await user.save()

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Server error during profile update' })
  }
})

module.exports = router