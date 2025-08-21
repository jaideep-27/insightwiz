const express = require('express')
const mongoose = require('mongoose')
const UserAnalytics = require('./models/UserAnalytics')
const User = require('./models/User')

async function clearSampleData() {
  try {
    // Use the same connection string as server.js
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/insightwiz')
    console.log('✅ Connected to MongoDB')
    
    // Delete all UserAnalytics records
    const analyticsResult = await UserAnalytics.deleteMany({})
    console.log(`🗑️ Deleted ${analyticsResult.deletedCount} analytics records`)
    
    // Reset all user academic data
    const userResult = await User.updateMany({}, { 
      $set: { 
        'academicData.performanceMetrics.totalAnalyses': 0,
        'academicData.uploadedFiles': []
      } 
    })
    console.log(`🔄 Reset ${userResult.modifiedCount} user academic records`)
    
    console.log('✅ All sample data cleared successfully - dashboard will show zeros now')
    
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error clearing sample data:', error)
    process.exit(1)
  }
}

clearSampleData()
