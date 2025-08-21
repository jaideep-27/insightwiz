import axios from 'axios'

const API_URL = '/api/analytics'

class AnalyticsService {
  // Get dashboard analytics data
  async getDashboardData() {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: this.getAuthHeader()
    })
    return response.data
  }

  // Get analysis history with pagination and filters
  async getHistory(params = {}) {
    const {
      page = 1,
      limit = 20,
      filter = 'all',
      dataType = 'all',
      sortBy = 'processedAt',
      sortOrder = 'desc'
    } = params

    const response = await axios.get(`${API_URL}/history`, {
      params: { page, limit, filter, dataType, sortBy, sortOrder },
      headers: this.getAuthHeader()
    })
    return response.data
  }

  // Save or unsave an analysis
  async toggleSaveAnalysis(analysisId, saved) {
    const response = await axios.post(`${API_URL}/save/${analysisId}`, 
      { saved },
      { headers: this.getAuthHeader() }
    )
    return response.data
  }

  // Track a new analysis (internal use by ML service)
  async trackAnalysis(analysisData) {
    const response = await axios.post(`${API_URL}/track`, 
      analysisData,
      { headers: this.getAuthHeader() }
    )
    return response.data
  }

  // Get auth header with token
  getAuthHeader() {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format data type for display
  formatDataType(dataType) {
    const types = {
      'business': 'Business',
      'financial': 'Financial',
      'personal': 'Personal',
      'academic': 'Academic',
      'survey': 'Survey',
      'operational': 'Operational',
      'marketing': 'Marketing',
      'other': 'Other'
    }
    return types[dataType] || 'Unknown'
  }

  // Get status color for UI
  getStatusColor(status) {
    const colors = {
      'processing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  // Calculate accuracy color
  getAccuracyColor(accuracy) {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400'
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  // Generate chart colors
  getChartColors() {
    return {
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      purple: '#8B5CF6',
      pink: '#EC4899',
      gradient: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
    }
  }
}

export const analyticsService = new AnalyticsService()
