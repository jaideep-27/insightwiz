const express = require('express')
const User = require('../models/User')
const UserAnalytics = require('../models/UserAnalytics')
const auth = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/analytics/dashboard
// @desc    Get user dashboard analytics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Debug logging
    console.log('🔍 Debug - req.user:', req.user)
    console.log('🔍 Debug - req.user._id:', req.user._id)
    
    let userAnalytics = await UserAnalytics.findOne({ userId: req.user._id })
    
    // Create analytics record if it doesn't exist
    if (!userAnalytics) {
      userAnalytics = new UserAnalytics({
        userId: req.user._id,
        activityStats: {
          totalScans: 0,
          totalSaved: 0,
          totalDataProcessed: 0,
          averageAccuracy: 0,
          bestAccuracy: 0,
          streakDays: 0
        },
        analyses: [],
        performanceHistory: []
      })
      await userAnalytics.save()
      console.log('📝 Created new analytics record for user')
    }

    // Update performance metrics to ensure they're current
    await userAnalytics.updatePerformanceMetrics()

    // Get recent performance data (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    console.log('🔍 All analyses count:', userAnalytics.analyses.length)
    console.log('🔍 Six months ago date:', sixMonthsAgo)
    
    const recentAnalyses = userAnalytics.analyses.filter(
      analysis => new Date(analysis.processedAt) >= sixMonthsAgo && analysis.status === 'completed'
    ).sort((a, b) => new Date(a.processedAt) - new Date(b.processedAt))

    console.log('🔍 Filtered recent analyses:', recentAnalyses.length)
    console.log('🔍 Sample analysis date:', recentAnalyses[0]?.processedAt)

    // Group analyses by month for performance chart
    const monthlyPerformance = {}
    recentAnalyses.forEach(analysis => {
      const month = new Date(analysis.processedAt).toLocaleDateString('en-US', { month: 'short' })
      if (!monthlyPerformance[month]) {
        monthlyPerformance[month] = { count: 0, totalAccuracy: 0, month }
      }
      monthlyPerformance[month].count += 1
      monthlyPerformance[month].totalAccuracy += analysis.accuracy || 0
    })

    const performanceData = Object.values(monthlyPerformance).map(data => ({
      month: data.month,
      scans: data.count,
      accuracy: data.count > 0 ? Math.round(data.totalAccuracy / data.count) : 0
    }))

    console.log('🔍 Performance Data:', performanceData)

    // Data type distribution
    const dataTypeStats = {}
    recentAnalyses.forEach(analysis => {
      dataTypeStats[analysis.dataType] = (dataTypeStats[analysis.dataType] || 0) + 1
    })

    const dataTypeDistribution = Object.entries(dataTypeStats).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      percentage: Math.round((count / recentAnalyses.length) * 100) || 0
    }))

    console.log('🔍 Data Type Distribution:', dataTypeDistribution)
    console.log('🔍 Recent Analyses Count:', recentAnalyses.length)

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentActivity = userAnalytics.analyses
      .filter(analysis => analysis.processedAt >= sevenDaysAgo)
      .sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt))
      .slice(0, 5)
      .map(analysis => ({
        id: analysis._id,
        fileName: analysis.fileName,
        dataType: analysis.dataType,
        status: analysis.status,
        accuracy: analysis.accuracy,
        processedAt: analysis.processedAt,
        saved: analysis.saved
      }))

    // Calculate growth rates
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    
    const currentMonthScans = userAnalytics.analyses.filter(
      analysis => analysis.processedAt >= lastMonth
    ).length
    
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    
    const previousMonthScans = userAnalytics.analyses.filter(
      analysis => analysis.processedAt >= twoMonthsAgo && analysis.processedAt < lastMonth
    ).length

    const scanGrowth = previousMonthScans > 0 
      ? Math.round(((currentMonthScans - previousMonthScans) / previousMonthScans) * 100)
      : currentMonthScans > 0 ? 100 : 0

    res.json({
      success: true,
      data: {
        stats: {
          totalScans: userAnalytics.activityStats.totalScans,
          totalSaved: userAnalytics.activityStats.totalSaved,
          averageAccuracy: Math.round(userAnalytics.activityStats.averageAccuracy || 0),
          bestAccuracy: Math.round(userAnalytics.activityStats.bestAccuracy || 0),
          streakDays: userAnalytics.activityStats.streakDays,
          totalDataProcessed: userAnalytics.activityStats.totalDataProcessed,
          favoriteDataType: userAnalytics.activityStats.favoriteDataType || 'academic',
          scanGrowth,
          currentMonthScans
        },
        performanceData,
        dataTypeDistribution,
        recentActivity,
        insights: {
          summary: userAnalytics.activityStats.totalScans === 0 
            ? "Welcome to InsightWiz! Upload your first file to start analyzing data and tracking your progress." 
            : `You've completed ${userAnalytics.activityStats.totalScans} analyses with an average accuracy of ${Math.round(userAnalytics.activityStats.averageAccuracy || 0)}%. Your ${userAnalytics.activityStats.streakDays}-day streak shows consistent engagement!`,
          recommendations: userAnalytics.activityStats.totalScans === 0 
            ? [
                "Upload your first dataset to get started with AI-powered analysis",
                "Try different file formats like CSV, JSON, or Excel files", 
                "Check out the upload section to begin your data journey"
              ]
            : [
                userAnalytics.activityStats.averageAccuracy < 70 ? "Try preprocessing your data for better accuracy" : "Great accuracy! Keep up the excellent work",
                userAnalytics.activityStats.totalSaved < userAnalytics.activityStats.totalScans * 0.5 ? "Consider saving more analyses for future reference" : "You're doing well at organizing your insights",
                currentMonthScans > previousMonthScans ? "Your analysis frequency is increasing - excellent progress!" : "Try to maintain regular analysis activity"
              ].filter(Boolean)
        }
      }
    })

  } catch (error) {
    console.error('Dashboard analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    })
  }
})

// @route   GET /api/analytics/history
// @desc    Get user analysis history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const filter = req.query.filter || 'all' // all, saved, completed, failed
    const dataType = req.query.dataType || 'all'
    const sortBy = req.query.sortBy || 'processedAt'
    const sortOrder = req.query.sortOrder || 'desc'

    const userAnalytics = await UserAnalytics.findOne({ userId: req.user._id })
    
    if (!userAnalytics) {
      return res.json({
        success: true,
        data: {
          analyses: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasNext: false,
            hasPrev: false
          },
          filters: {
            available: ['all', 'saved', 'completed', 'failed'],
            dataTypes: ['all', 'business', 'financial', 'personal', 'academic', 'survey', 'operational', 'marketing', 'other']
          }
        }
      })
    }

    let filteredAnalyses = [...userAnalytics.analyses]

    // Apply filters
    if (filter !== 'all') {
      if (filter === 'saved') {
        filteredAnalyses = filteredAnalyses.filter(analysis => analysis.saved)
      } else {
        filteredAnalyses = filteredAnalyses.filter(analysis => analysis.status === filter)
      }
    }

    if (dataType !== 'all') {
      filteredAnalyses = filteredAnalyses.filter(analysis => analysis.dataType === dataType)
    }

    // Sort analyses
    filteredAnalyses.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (sortOrder === 'desc') {
        return new Date(bValue) - new Date(aValue)
      } else {
        return new Date(aValue) - new Date(bValue)
      }
    })

    // Pagination
    const totalItems = filteredAnalyses.length
    const totalPages = Math.ceil(totalItems / limit)
    const skip = (page - 1) * limit
    
    const paginatedAnalyses = filteredAnalyses
      .slice(skip, skip + limit)
      .map(analysis => ({
        id: analysis._id,
        fileName: analysis.fileName,
        fileType: analysis.fileType,
        fileSize: analysis.fileSize,
        dataType: analysis.dataType,
        processedAt: analysis.processedAt,
        processingTime: analysis.processingTime,
        status: analysis.status,
        accuracy: analysis.accuracy,
        saved: analysis.saved,
        savedAt: analysis.savedAt,
        insights: analysis.insights
      }))

    res.json({
      success: true,
      data: {
        analyses: paginatedAnalyses,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          available: ['all', 'saved', 'completed', 'failed'],
          dataTypes: ['all', 'business', 'financial', 'personal', 'academic', 'survey', 'operational', 'marketing', 'other']
        },
        summary: {
          totalAnalyses: userAnalytics.analyses.length,
          completedAnalyses: userAnalytics.analyses.filter(a => a.status === 'completed').length,
          savedAnalyses: userAnalytics.analyses.filter(a => a.saved).length,
          failedAnalyses: userAnalytics.analyses.filter(a => a.status === 'failed').length
        }
      }
    })

  } catch (error) {
    console.error('History analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis history',
      error: error.message
    })
  }
})

// @route   POST /api/analytics/save/:analysisId
// @desc    Save/unsave an analysis
// @access  Private
router.post('/save/:analysisId', auth, async (req, res) => {
  try {
    const { analysisId } = req.params
    const { saved } = req.body

    const userAnalytics = await UserAnalytics.findOne({ userId: req.user._id })
    
    if (!userAnalytics) {
      return res.status(404).json({
        success: false,
        message: 'User analytics not found'
      })
    }

    const analysis = userAnalytics.analyses.id(analysisId)
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      })
    }

    analysis.saved = saved
    analysis.savedAt = saved ? new Date() : null

    await userAnalytics.updatePerformanceMetrics()

    res.json({
      success: true,
      message: `Analysis ${saved ? 'saved' : 'unsaved'} successfully`,
      data: {
        analysisId,
        saved: analysis.saved,
        savedAt: analysis.savedAt
      }
    })

  } catch (error) {
    console.error('Save analysis error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating analysis',
      error: error.message
    })
  }
})

// @route   POST /api/analytics/track
// @desc    Track a new analysis (internal use)
// @access  Private  
router.post('/track', auth, async (req, res) => {
  try {
    const {
      fileName,
      fileType,
      fileSize,
      dataType,
      processingTime,
      status,
      accuracy,
      insights
    } = req.body

    let userAnalytics = await UserAnalytics.findOne({ userId: req.user._id })
    
    if (!userAnalytics) {
      userAnalytics = new UserAnalytics({ userId: req.user._id })
    }

    await userAnalytics.addAnalysis({
      fileName,
      fileType,
      fileSize,
      dataType,
      processingTime,
      status,
      accuracy,
      insights,
      processedAt: new Date()
    })

    res.json({
      success: true,
      message: 'Analysis tracked successfully',
      data: {
        totalScans: userAnalytics.activityStats.totalScans
      }
    })

  } catch (error) {
    console.error('Track analysis error:', error)
    res.status(500).json({
      success: false,
      message: 'Error tracking analysis',
      error: error.message
    })
  }
})

module.exports = router
