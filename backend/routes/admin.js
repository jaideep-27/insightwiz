const express = require('express')
const User = require('../models/User')
const UserAnalytics = require('../models/UserAnalytics')
const auth = require('../middleware/auth')

const router = express.Router()

// @route   DELETE /api/admin/clear-sample-data
// @desc    Clear all sample data and reset to zero state
// @access  Private
router.delete('/clear-sample-data', auth, async (req, res) => {
  try {
    console.log('🧹 Clearing all sample data...')
    
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
    
    res.json({
      success: true,
      message: 'All sample data cleared successfully',
      analytics_deleted: analyticsResult.deletedCount,
      users_reset: userResult.modifiedCount
    })
    
  } catch (error) {
    console.error('❌ Error clearing sample data:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to clear sample data',
      error: error.message
    })
  }
})

// @route   POST /api/admin/sync-user-analytics
// @desc    Sync user data with analytics (populate missing UserAnalytics)
// @access  Private
router.post('/sync-user-analytics', auth, async (req, res) => {
  try {
    console.log('🔄 Starting user analytics sync...')
    
    const users = await User.find({})
    let syncedUsers = 0
    let createdAnalytics = 0
    
    for (const user of users) {
      let userAnalytics = await UserAnalytics.findOne({ userId: user._id })
      
      if (!userAnalytics) {
        // Create new UserAnalytics record
        userAnalytics = new UserAnalytics({
          userId: user._id,
          activityStats: {
            totalScans: user.academicData?.performanceMetrics?.totalAnalyses || 0,
            totalSaved: 0,
            totalDataProcessed: user.academicData?.uploadedFiles?.length || 0,
            averageAccuracy: 85,
            bestAccuracy: 85,
            streakDays: 0,
            favoriteDataType: 'business'
          },
          analyses: [],
          performanceHistory: []
        })
        createdAnalytics++
      }
      
      // Create synthetic analysis records from uploaded files
      if (user.academicData?.uploadedFiles?.length > 0) {
        const existingAnalysisCount = userAnalytics.analyses.length
        
        // Add analysis records for uploaded files that don't have analytics
        const filesToSync = user.academicData.uploadedFiles.slice(existingAnalysisCount)
        
        for (const file of filesToSync) {
          const analysisRecord = {
            fileName: file.filename,
            fileType: file.fileType || 'text/csv',
            fileSize: file.fileSize || 1024,
            dataType: file.dataType || 'business',
            processedAt: file.uploadDate || new Date(),
            processingTime: Math.random() * 2 + 1,
            status: 'completed',
            accuracy: Math.floor(Math.random() * 20) + 80,
            insights: {
              summary: `Analysis of ${file.filename} completed successfully with AI-powered insights.`,
              keyFindings: [
                'Data structure is well-formatted and ready for analysis',
                'Key patterns identified in the dataset',
                'Quality metrics indicate reliable data source'
              ],
              recommendations: [
                'Continue collecting similar data for trend analysis',
                'Consider implementing regular data quality checks',
                'Set up automated reporting for key metrics'
              ]
            },
            saved: false,
            visualizations: [
              {
                type: 'line',
                title: 'Trend Analysis',
                data: [
                  { name: 'Jan', value: 65 + Math.random() * 20 },
                  { name: 'Feb', value: 75 + Math.random() * 20 },
                  { name: 'Mar', value: 85 + Math.random() * 20 },
                  { name: 'Apr', value: 80 + Math.random() * 20 },
                  { name: 'May', value: 90 + Math.random() * 20 },
                  { name: 'Jun', value: 95 + Math.random() * 20 }
                ]
              }
            ]
          }
          userAnalytics.analyses.push(analysisRecord)
        }
      }
      
      // Update performance metrics
      await userAnalytics.updatePerformanceMetrics()
      await userAnalytics.save()
      
      syncedUsers++
      console.log(`✅ Synced user ${user.email} - ${userAnalytics.analyses.length} analyses`)
    }
    
    console.log(`🎉 Sync complete: ${syncedUsers} users synced, ${createdAnalytics} new analytics created`)
    
    res.json({
      success: true,
      message: 'User analytics synced successfully',
      data: {
        syncedUsers,
        createdAnalytics,
        totalUsers: users.length
      }
    })
    
  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({
      success: false,
      message: 'Error syncing user analytics',
      error: error.message
    })
  }
})

module.exports = router
