const mongoose = require('mongoose')

const userAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // File Analysis Tracking
  analyses: [{
    fileId: String,
    fileName: String,
    fileType: String,
    fileSize: Number,
    dataType: {
      type: String,
      enum: ['business', 'financial', 'personal', 'academic', 'survey', 'operational', 'marketing', 'other'],
      default: 'other'
    },
    processedAt: {
      type: Date,
      default: Date.now
    },
    processingTime: Number, // in milliseconds
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing'
    },
    insights: {
      summary: String,
      keyFindings: [String],
      recommendations: [String]
    },
    accuracy: Number,
    saved: {
      type: Boolean,
      default: false
    },
    savedAt: Date
  }],
  
  // Activity Metrics
  activityStats: {
    totalScans: {
      type: Number,
      default: 0
    },
    totalSaved: {
      type: Number,
      default: 0
    },
    totalDataProcessed: {
      type: Number,
      default: 0 // in bytes
    },
    averageAccuracy: {
      type: Number,
      default: 0
    },
    bestAccuracy: {
      type: Number,
      default: 0
    },
    favoriteDataType: String,
    streakDays: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Performance Over Time
  performanceHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    scansCompleted: Number,
    averageAccuracy: Number,
    dataProcessed: Number // in bytes
  }],
  
  // Monthly/Weekly Statistics
  monthlyStats: [{
    month: Number, // 1-12
    year: Number,
    totalScans: Number,
    totalSaved: Number,
    averageAccuracy: Number,
    topDataTypes: [String]
  }]
  
}, {
  timestamps: true
})

// Index for better query performance
userAnalyticsSchema.index({ userId: 1 })
userAnalyticsSchema.index({ 'analyses.processedAt': -1 })
userAnalyticsSchema.index({ 'performanceHistory.date': -1 })

// Method to add new analysis
userAnalyticsSchema.methods.addAnalysis = function(analysisData) {
  this.analyses.push(analysisData)
  this.activityStats.totalScans += 1
  this.activityStats.lastActiveDate = new Date()
  
  // Recalculate streak based on actual upload dates
  this.recalculateStreak()
  
  return this.save()
}

// Method to calculate current streak based on consecutive days with uploads
userAnalyticsSchema.methods.recalculateStreak = function() {
  const completedAnalyses = this.analyses
    .filter(a => a.status === 'completed')
    .sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt))
  
  if (completedAnalyses.length === 0) {
    this.activityStats.streakDays = 0
    return
  }
  
  // Get unique days with uploads (in YYYY-MM-DD format)
  const uploadDays = [...new Set(
    completedAnalyses.map(analysis => 
      new Date(analysis.processedAt).toISOString().split('T')[0]
    )
  )].sort().reverse() // Most recent first
  
  if (uploadDays.length === 0) {
    this.activityStats.streakDays = 0
    return
  }
  
  // Check if the most recent upload was today or yesterday
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  // If no upload today or yesterday, streak is broken
  if (uploadDays[0] !== today && uploadDays[0] !== yesterday) {
    this.activityStats.streakDays = 0
    return
  }
  
  // Count consecutive days
  let streak = 0
  let expectedDate = new Date(uploadDays[0])
  
  for (const dayString of uploadDays) {
    const currentDate = new Date(dayString)
    const expectedDateString = expectedDate.toISOString().split('T')[0]
    
    if (dayString === expectedDateString) {
      streak++
      expectedDate.setDate(expectedDate.getDate() - 1) // Move to previous day
    } else {
      break // Streak broken
    }
  }
  
  this.activityStats.streakDays = streak
}

// Method to update performance metrics
userAnalyticsSchema.methods.updatePerformanceMetrics = function() {
  const completedAnalyses = this.analyses.filter(a => a.status === 'completed')
  
  if (completedAnalyses.length > 0) {
    // Calculate average accuracy
    const accuracies = completedAnalyses.filter(a => a.accuracy).map(a => a.accuracy)
    if (accuracies.length > 0) {
      this.activityStats.averageAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length
      this.activityStats.bestAccuracy = Math.max(...accuracies)
    }
    
    // Calculate total data processed
    this.activityStats.totalDataProcessed = completedAnalyses.reduce((sum, analysis) => sum + (analysis.fileSize || 0), 0)
    
    // Find favorite data type
    const dataTypeCounts = {}
    completedAnalyses.forEach(analysis => {
      dataTypeCounts[analysis.dataType] = (dataTypeCounts[analysis.dataType] || 0) + 1
    })
    
    this.activityStats.favoriteDataType = Object.keys(dataTypeCounts).reduce((a, b) => 
      dataTypeCounts[a] > dataTypeCounts[b] ? a : b, 'other')
    
    // Count saved analyses
    this.activityStats.totalSaved = completedAnalyses.filter(a => a.saved).length
  } else {
    // No analyses yet - reset all stats
    this.activityStats.averageAccuracy = 0
    this.activityStats.bestAccuracy = 0
    this.activityStats.totalDataProcessed = 0
    this.activityStats.favoriteDataType = 'other'
    this.activityStats.totalSaved = 0
  }
  
  // Always recalculate streak based on actual upload dates
  this.recalculateStreak()
  
  return this.save()
}

module.exports = mongoose.model('UserAnalytics', userAnalyticsSchema)
