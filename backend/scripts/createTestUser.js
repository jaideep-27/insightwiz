const mongoose = require('mongoose')
const User = require('../models/User')
require('dotenv').config()

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@insightwhiz.com' })
    if (existingUser) {
      console.log('Test user already exists!')
      return
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@insightwhiz.com',
      password: 'password123'
    })

    await testUser.save()
    console.log('✅ Test user created successfully!')
    console.log('Email: test@insightwhiz.com')
    console.log('Password: password123')

  } catch (error) {
    console.error('❌ Error creating test user:', error)
  } finally {
    mongoose.disconnect()
  }
}

createTestUser()