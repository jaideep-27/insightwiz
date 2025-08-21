import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
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
  Clock,
  Star,
  RefreshCw,
  AlertCircle
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
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
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

  const StatCard = ({ title, value, change, icon: Icon, gradient, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="card group cursor-pointer relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 opacity-5 ${gradient}`}></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient} shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof value === 'number' && value > 1000 ? (
                <>
                  {(value / 1000).toFixed(1)}
                  <span className="text-lg text-gray-500 dark:text-gray-400">K</span>
                </>
              ) : (
                value
              )}
            </p>
            
            {change !== undefined && change !== null && (
              <div className={`flex items-center mt-2 text-sm font-semibold ${
                change > 0 ? 'text-green-600 dark:text-green-400' : 
                change < 0 ? 'text-red-600 dark:text-red-400' : 
                'text-gray-600 dark:text-gray-400'
              }`}>
                {change > 0 && <ArrowUp className="w-4 h-4 mr-1" />}
                {change < 0 && <ArrowDown className="w-4 h-4 mr-1" />}
                {change !== 0 ? `${Math.abs(change)}% from last month` : 'No change'}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const RecentActivityCard = ({ activity }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {activity.fileName}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {analyticsService.formatDataType(activity.dataType)}
              </span>
              {activity.accuracy && (
                <span className={`text-xs font-medium ${analyticsService.getAccuracyColor(activity.accuracy)}`}>
                  {activity.accuracy}% accuracy
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(activity.processedAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {activity.saved && (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            analyticsService.getStatusColor(activity.status)
          }`}>
            {activity.status}
          </span>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading your analytics dashboard...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Unable to Load Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error}
        </p>
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    )
  }

  const chartColors = analyticsService.getChartColors()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back, {user?.name}! 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-600 dark:text-gray-300"
          >
            Here's your analytics overview and recent activity
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 lg:mt-0"
        >
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </motion.div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Scans"
          value={dashboardData.stats.totalScans}
          change={dashboardData.stats.scanGrowth}
          icon={BarChart3}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle="Analyses completed"
        />
        <StatCard
          title="Saved Analyses"
          value={dashboardData.stats.totalSaved}
          change={null}
          icon={Save}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="Important insights saved"
        />
        <StatCard
          title="Average Accuracy"
          value={`${dashboardData.stats.averageAccuracy}%`}
          change={null}
          icon={Target}
          gradient="bg-gradient-to-r from-green-500 to-green-600"
          subtitle="Analysis precision"
        />
        <StatCard
          title="Current Streak"
          value={`${dashboardData.stats.streakDays} days`}
          change={null}
          icon={Zap}
          gradient="bg-gradient-to-r from-orange-500 to-orange-600"
          subtitle="Consecutive active days"
        />
      </div>

      {/* Performance Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Performance Over Time */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Trends
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your analysis activity and accuracy over time
                </p>
              </div>
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            
            {dashboardData.performanceData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.performanceData}>
                    <defs>
                      <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColors.success} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="month" 
                      stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      fontSize={12}
                    />
                    <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px',
                        color: theme === 'dark' ? '#F9FAFB' : '#111827'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke={chartColors.primary}
                      fillOpacity={1}
                      fill="url(#scansGradient)"
                      name="Scans"
                    />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      stroke={chartColors.success}
                      fillOpacity={1}
                      fill="url(#accuracyGradient)"
                      name="Accuracy %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    No performance data yet. Start analyzing data to see trends!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Data Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Data Types
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your analysis breakdown
              </p>
            </div>
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          
          {dashboardData.dataTypeDistribution.length > 0 ? (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.dataTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData.dataTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors.gradient[index % chartColors.gradient.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {dashboardData.dataTypeDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: chartColors.gradient[index % chartColors.gradient.length] }}
                      />
                      <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {item.value} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  Upload different data types to see distribution
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Insights and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card xl:col-span-1"
        >
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Insights
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {dashboardData.insights.summary}
              </p>
            </div>
            
            {dashboardData.insights.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {dashboardData.insights.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            {dashboardData.recentActivity.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Last 7 days
              </p>
            )}
          </div>
          
          {dashboardData.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentActivity.map((activity, index) => (
                <RecentActivityCard key={activity.id || index} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Recent Activity
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your first dataset to start seeing activity here
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {analyticsService.formatFileSize(dashboardData.stats.totalDataProcessed)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Total Data Processed
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dashboardData.stats.bestAccuracy}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Best Accuracy Score
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {analyticsService.formatDataType(dashboardData.stats.favoriteDataType)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Favorite Data Type
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {dashboardData.stats.currentMonthScans}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              This Month's Scans
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
