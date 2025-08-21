const mongoose = require('mongoose')
const User = require('../models/User')
const UserAnalytics = require('../models/UserAnalytics')
require('dotenv').config()

async function createSampleAnalytics() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Find the test user
    const testUser = await User.findOne({ email: 'test@insightwiz.com' })
    if (!testUser) {
      console.log('Test user not found! Please create test user first.')
      return
    }

    console.log(`Found test user: ${testUser.name}`)

    // Delete existing analytics data for clean slate
    await UserAnalytics.deleteMany({ userId: testUser._id })
    console.log('Cleaned existing analytics data')

    // Create comprehensive sample analytics with recent dates
    const now = new Date()
    const sampleAnalyses = [
      {
        fileName: 'sales_data_aug2025.csv',
        fileType: 'text/csv',
        fileSize: 2840960, // ~2.8MB
        dataType: 'business',
        processedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        processingTime: 3500,
        status: 'completed',
        accuracy: 85,
        insights: {
          summary: 'Sales data shows 23% growth in Q4 with strong performance in digital channels.',
          keyFindings: [
            'Digital sales increased by 45%',
            'Customer retention improved to 78%',
            'Average order value rose by 12%'
          ],
          recommendations: [
            'Focus more resources on digital marketing',
            'Expand customer loyalty programs',
            'Optimize high-performing product categories'
          ]
        },
        saved: true,
        savedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000) // 30 mins after processing
      },
      {
        fileName: 'customer_survey_responses.json',
        fileType: 'application/json',
        fileSize: 1456890, // ~1.4MB
        dataType: 'survey',
        processedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        processingTime: 2100,
        status: 'completed',
        accuracy: 92,
        insights: {
          summary: 'Customer satisfaction scores are high with average rating of 4.2/5.',
          keyFindings: [
            'Service quality rated highest at 4.5/5',
            'Pricing concerns mentioned by 18% of respondents',
            'Mobile app usability needs improvement'
          ],
          recommendations: [
            'Review pricing strategy for competitive positioning',
            'Invest in mobile app user experience improvements',
            'Maintain high service quality standards'
          ]
        },
        saved: true,
        savedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000) // 75 mins after processing
      },
      {
        fileName: 'financial_report_Q3.csv',
        fileType: 'text/csv',
        fileSize: 890450, // ~890KB
        dataType: 'financial',
        processedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        processingTime: 1800,
        status: 'completed',
        accuracy: 78,
        insights: {
          summary: 'Q3 financial performance shows steady growth with improved profit margins.',
          keyFindings: [
            'Revenue increased by 15% compared to Q2',
            'Operating costs reduced by 8%',
            'Cash flow remained positive throughout the quarter'
          ],
          recommendations: [
            'Continue cost optimization initiatives',
            'Explore new revenue streams',
            'Maintain strong cash flow management'
          ]
        },
        saved: false
      },
      {
        fileName: 'marketing_campaign_data.csv',
        fileType: 'text/csv',
        fileSize: 1234567, // ~1.2MB
        dataType: 'marketing',
        processedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        processingTime: 2800,
        status: 'completed',
        accuracy: 88,
        insights: {
          summary: 'Social media campaigns outperformed email marketing with 3x higher engagement.',
          keyFindings: [
            'Instagram campaigns had highest ROI at 4.2x',
            'Email open rates declined to 18%',
            'Video content generated 65% more engagement'
          ],
          recommendations: [
            'Increase budget allocation to social media',
            'Revamp email marketing strategy',
            'Create more video content for campaigns'
          ]
        },
        saved: true,
        savedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000) // 40 mins after processing
      },
      {
        fileName: 'operational_metrics.json',
        fileType: 'application/json',
        fileSize: 567890, // ~568KB
        dataType: 'operational',
        processedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        processingTime: 1500,
        status: 'completed',
        accuracy: 91,
        insights: {
          summary: 'Operational efficiency improved with 25% reduction in processing time.',
          keyFindings: [
            'Automation reduced manual tasks by 40%',
            'Quality metrics improved across all departments',
            'Employee satisfaction increased to 4.3/5'
          ],
          recommendations: [
            'Expand automation to additional processes',
            'Invest in employee training programs',
            'Implement continuous improvement processes'
          ]
        },
        saved: false
      },
      {
        fileName: 'personal_budget_tracker.csv',
        fileType: 'text/csv',
        fileSize: 234567, // ~235KB
        dataType: 'personal',
        processedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        processingTime: 900,
        status: 'completed',
        accuracy: 95,
        insights: {
          summary: 'Personal expenses are well managed with 15% savings rate achieved.',
          keyFindings: [
            'Entertainment expenses decreased by 20%',
            'Grocery spending optimized through bulk purchases',
            'Emergency fund goal reached ahead of schedule'
          ],
          recommendations: [
            'Consider increasing investment contributions',
            'Explore additional income streams',
            'Maintain current spending discipline'
          ]
        },
        saved: true,
        savedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000) // 45 mins after processing
      },
      {
        fileName: 'student_performance_data.csv',
        fileType: 'text/csv',
        fileSize: 3456789, // ~3.5MB
        dataType: 'academic',
        processedAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
        processingTime: 4200,
        status: 'completed',
        accuracy: 82,
        insights: {
          summary: 'Student performance shows improvement with targeted interventions.',
          keyFindings: [
            'Math scores improved by 18% after tutoring program',
            'Attendance rate increased to 92%',
            'Student engagement metrics reached all-time high'
          ],
          recommendations: [
            'Expand tutoring program to other subjects',
            'Implement gamification in learning processes',
            'Increase parent-teacher communication'
          ]
        },
        saved: false
      },
      {
        fileName: 'failed_analysis_test.csv',
        fileType: 'text/csv',
        fileSize: 123456, // ~123KB
        dataType: 'business',
        processedAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
        processingTime: 500,
        status: 'failed',
        accuracy: 0,
        insights: {
          summary: 'Analysis failed due to data format inconsistencies.',
          keyFindings: [],
          recommendations: [
            'Ensure data format consistency before upload',
            'Check for missing required columns',
            'Validate data types and formats'
          ]
        },
        saved: false
      }
    ]

    // Create user analytics with sample data
    const userAnalytics = new UserAnalytics({
      userId: testUser._id,
      analyses: sampleAnalyses,
      activityStats: {
        totalScans: sampleAnalyses.length,
        totalSaved: sampleAnalyses.filter(a => a.saved).length,
        totalDataProcessed: sampleAnalyses.reduce((sum, a) => sum + a.fileSize, 0),
        averageAccuracy: 0, // Will be calculated by updatePerformanceMetrics
        bestAccuracy: 0, // Will be calculated by updatePerformanceMetrics
        favoriteDataType: 'business',
        streakDays: 12,
        lastActiveDate: new Date()
      },
      performanceHistory: [
        {
          date: new Date('2024-11-01T00:00:00Z'),
          scansCompleted: 2,
          averageAccuracy: 85,
          dataProcessed: 1500000
        },
        {
          date: new Date('2024-11-15T00:00:00Z'),
          scansCompleted: 3,
          averageAccuracy: 88,
          dataProcessed: 2100000
        },
        {
          date: new Date('2024-12-01T00:00:00Z'),
          scansCompleted: 2,
          averageAccuracy: 90,
          dataProcessed: 1800000
        },
        {
          date: new Date('2024-12-15T00:00:00Z'),
          scansCompleted: 1,
          averageAccuracy: 85,
          dataProcessed: 2840960
        }
      ],
      monthlyStats: [
        {
          month: 11,
          year: 2024,
          totalScans: 5,
          totalSaved: 2,
          averageAccuracy: 86.6,
          topDataTypes: ['academic', 'personal', 'business']
        },
        {
          month: 12,
          year: 2024,
          totalScans: 3,
          totalSaved: 2,
          averageAccuracy: 85,
          topDataTypes: ['business', 'survey', 'financial']
        }
      ]
    })

    await userAnalytics.save()
    
    // Update performance metrics
    await userAnalytics.updatePerformanceMetrics()

    console.log('✅ Sample analytics data created successfully!')
    console.log(`📊 Created ${sampleAnalyses.length} sample analyses`)
    console.log(`💾 ${sampleAnalyses.filter(a => a.saved).length} analyses marked as saved`)
    console.log(`✅ ${sampleAnalyses.filter(a => a.status === 'completed').length} completed analyses`)
    console.log(`❌ ${sampleAnalyses.filter(a => a.status === 'failed').length} failed analyses`)
    console.log(`🎯 Average accuracy: ${Math.round(userAnalytics.activityStats.averageAccuracy)}%`)

  } catch (error) {
    console.error('❌ Error creating sample analytics:', error)
  } finally {
    mongoose.disconnect()
  }
}

createSampleAnalytics()
