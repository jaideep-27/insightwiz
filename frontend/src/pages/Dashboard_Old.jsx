import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  BookOpen,
  Brain,
  ArrowUp,
  ArrowDown,
  FileText,
  Save,
  Target,
  Zap,
  Calendar,
  Award,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  Star
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { analyticsService } from '../services/AnalyticsService'

const Dashboard = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalScans: 0,
      totalSaved: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      streakDays: 0,
      totalDataProcessed: 0,
      favoriteDataType: 'academic',
      scanGrowth: 0,
      currentMonthScans: 0
    },
    performanceData: [],
    dataTypeDistribution: [],
    recentActivity: [],
    insights: {
      summary: '',
      recommendations: []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await analyticsService.getDashboardData()
      
      if (response.success) {
        setDashboardData(response.data)
      } else {
        throw new Error(response.message || 'Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Unable to load dashboard data. Please try refreshing the page.')
      
      // Set default empty state instead of mock data
      setDashboardData({
        stats: {
          totalScans: 0,
          totalSaved: 0,
          averageAccuracy: 0,
          bestAccuracy: 0,
          streakDays: 0,
          totalDataProcessed: 0,
          favoriteDataType: 'academic',
          scanGrowth: 0,
          currentMonthScans: 0
        },
        performanceData: [],
        dataTypeDistribution: [],
        recentActivity: [],
        insights: {
          summary: 'Welcome to InsightWiz! Start by uploading your first dataset to see analytics here.',
          recommendations: [
            'Upload a CSV or JSON file to begin your analysis journey',
            'Try different data types to unlock insights',
            'Save important analyses for future reference'
          ]
        }
      })
    } finally {
      setLoading(false)
    }
  }
      const mockPerformanceData = [
        { month: 'Jan', score: 78, prediction: 82 },
        { month: 'Feb', score: 82, prediction: 85 },
        { month: 'Mar', score: 79, prediction: 83 },
        { month: 'Apr', score: 85, prediction: 88 },
        { month: 'May', score: 88, prediction: 91 },
        { month: 'Jun', score: 92, prediction: 94 }
      ]

      const mockClusterData = [
        { name: 'High Performers', value: 35, color: '#10B981' },
        { name: 'Average Performers', value: 45, color: '#3B82F6' },
        { name: 'Needs Support', value: 20, color: '#F59E0B' }
      ]

      // Try to generate AI insights, but fallback to default message if it fails
      let insights = `Welcome to your personalized analytics dashboard, ${user?.name}! Your data shows steady improvement with ML predictions indicating continued growth. Keep up the excellent work!`

      try {
        const aiInsights = await geminiService.generateSummary({
          performance: mockPerformanceData,
          clusters: mockClusterData,
          dataType: 'business', // Default to business for dashboard
          user: user?.name || 'User'
        })
        insights = aiInsights.summary || insights
      } catch (aiError) {
        console.log('AI insights unavailable, using default message')
      }

      setDashboardData({
        performanceData: mockPerformanceData,
        clusterData: mockClusterData,
        insights,
        stats: {
          totalStudents: 1247,
          averageScore: 85.2,
          improvement: 12.5,
          predictions: 94
        }
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set fallback data even if there's an error
      setDashboardData({
        performanceData: [
          { month: 'Jan', score: 78, prediction: 82 },
          { month: 'Feb', score: 82, prediction: 85 },
          { month: 'Mar', score: 79, prediction: 83 },
          { month: 'Apr', score: 85, prediction: 88 },
          { month: 'May', score: 88, prediction: 91 },
          { month: 'Jun', score: 92, prediction: 94 }
        ],
        clusterData: [
          { name: 'High Performers', value: 35, color: '#10B981' },
          { name: 'Average Performers', value: 45, color: '#3B82F6' },
          { name: 'Needs Support', value: 20, color: '#F59E0B' }
        ],
        insights: `Welcome to your personalized dashboard! Your performance shows steady improvement with ML predictions indicating continued growth.`,
        stats: {
          totalStudents: 1247,
          averageScore: 85.2,
          improvement: 12.5,
          predictions: 94
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, change, icon: Icon, gradient }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="card group cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-3 text-sm font-semibold ${change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
              {change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-5xl">🚀</span>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
              Here's your data analytics overview and AI-powered insights ✨
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Data Points Analyzed"
          value={dashboardData.stats.totalStudents?.toLocaleString() || '12,847'}
          icon={Users}
          gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Analysis Accuracy"
          value={`${dashboardData.stats.averageScore || 94.7}%`}
          change={dashboardData.stats.improvement || 8.3}
          icon={TrendingUp}
          gradient="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <StatCard
          title="Reports Generated"
          value="156"
          change={12.4}
          icon={BookOpen}
          gradient="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <StatCard
          title="Prediction Confidence"
          value={`${dashboardData.stats.predictions || 91}%`}
          change={5.1}
          icon={Brain}
          gradient="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          className="card overflow-hidden group"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:gradient-text transition-all duration-300">
              Data Trends & ML Predictions
            </h3>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Actual Data"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="prediction"
                  stroke="#10B981"
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  name="ML Prediction"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Data Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          className="card overflow-hidden group"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:gradient-text transition-all duration-300">
              Data Distribution Analysis
            </h3>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={dashboardData.clusterData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={12}
                >
                  {dashboardData.clusterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="card group"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:gradient-text transition-all duration-300">
              AI-Generated Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Powered by advanced machine learning 🤖</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
            {dashboardData.insights}
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg group-hover:gradient-text transition-all duration-300">Upload New Data</h4>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Upload any data for AI-powered analysis 📊
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg group-hover:gradient-text transition-all duration-300">AI Assistant</h4>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Chat with AI for insights and help 🤖
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg group-hover:gradient-text transition-all duration-300">Generate Reports</h4>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Create comprehensive analysis reports 📋
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard