import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Brain,
  ArrowUp,
  ArrowDown
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
  Cell
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { mlService } from '../services/MLService'
import { geminiService } from '../services/GeminiService'

const Dashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    performanceData: [],
    clusterData: [],
    insights: '',
    stats: {
      totalStudents: 0,
      averageScore: 0,
      improvement: 0,
      predictions: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Mock data for demonstration - replace with actual API calls
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

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's your data analytics overview and AI-powered insights from your recent uploads.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Data Points Analyzed"
          value={dashboardData.stats.totalStudents?.toLocaleString() || '12,847'}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Analysis Accuracy"
          value={`${dashboardData.stats.averageScore || 94.7}%`}
          change={dashboardData.stats.improvement || 8.3}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="Reports Generated"
          value="156"
          change={12.4}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Prediction Confidence"
          value={`${dashboardData.stats.predictions || 91}%`}
          change={5.1}
          icon={Brain}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card overflow-hidden"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Trends & ML Predictions
          </h3>
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
          className="card overflow-hidden"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Distribution Analysis
          </h3>
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
        className="card"
      >
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI-Generated Insights
          </h3>
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
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
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload New Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Upload academic data for ML analysis
            </p>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Assistant</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Chat with AI for academic help
            </p>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Study Plan</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Generate personalized study plans
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard