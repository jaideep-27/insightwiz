import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  Save,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { analyticsService } from '../services/AnalyticsService'

const History = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [historyData, setHistoryData] = useState({
    analyses: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      hasNext: false,
      hasPrev: false
    },
    filters: {
      available: ['all', 'saved', 'completed', 'failed'],
      dataTypes: ['all', 'business', 'financial', 'personal', 'academic', 'survey', 'operational', 'marketing', 'other']
    },
    summary: {
      totalAnalyses: 0,
      completedAnalyses: 0,
      savedAnalyses: 0,
      failedAnalyses: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentDataType, setCurrentDataType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('processedAt')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    loadHistoryData()
  }, [currentPage, currentFilter, currentDataType, sortBy, sortOrder])

  const loadHistoryData = async () => {
    try {
      setLoading(true)
      const response = await analyticsService.getHistory({
        page: currentPage,
        limit: 20,
        filter: currentFilter,
        dataType: currentDataType,
        sortBy,
        sortOrder
      })

      if (response.success) {
        setHistoryData(response.data)
      }
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToggle = async (analysisId, currentSavedState) => {
    try {
      await analyticsService.toggleSaveAnalysis(analysisId, !currentSavedState)
      
      // Update local state
      setHistoryData(prev => ({
        ...prev,
        analyses: prev.analyses.map(analysis => 
          analysis.id === analysisId 
            ? { ...analysis, saved: !currentSavedState, savedAt: !currentSavedState ? new Date() : null }
            : analysis
        )
      }))
    } catch (error) {
      console.error('Error toggling save:', error)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredAnalyses = historyData.analyses.filter(analysis =>
    analysis.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.dataType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analysis History
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            View and manage your data analysis history
          </p>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {historyData.summary.totalAnalyses}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {historyData.summary.completedAnalyses}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {historyData.summary.savedAnalyses}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Saved</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {historyData.summary.failedAnalyses}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 
                         focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={currentFilter}
            onChange={(e) => { setCurrentFilter(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-purple-500 focus:border-transparent"
          >
            {historyData.filters.available.map(filter => (
              <option key={filter} value={filter}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </option>
            ))}
          </select>

          {/* Data Type Filter */}
          <select
            value={currentDataType}
            onChange={(e) => { setCurrentDataType(e.target.value); setCurrentPage(1) }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-purple-500 focus:border-transparent"
          >
            {historyData.filters.dataTypes.map(type => (
              <option key={type} value={type}>
                {analyticsService.formatDataType(type)}
              </option>
            ))}
          </select>

          {/* Sort Options */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field)
              setSortOrder(order)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-purple-500 focus:border-transparent"
          >
            <option value="processedAt-desc">Newest First</option>
            <option value="processedAt-asc">Oldest First</option>
            <option value="accuracy-desc">Highest Accuracy</option>
            <option value="accuracy-asc">Lowest Accuracy</option>
            <option value="fileName-asc">Name A-Z</option>
            <option value="fileName-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Analysis List */}
      <div className="space-y-4">
        {filteredAnalyses.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No analyses found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Try adjusting your search or filters' : 'Start by uploading some data to analyze'}
            </p>
          </div>
        ) : (
          filteredAnalyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {analysis.fileName}
                      </h3>
                      {getStatusIcon(analysis.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analyticsService.getStatusColor(analysis.status)
                      }`}>
                        {analysis.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(analysis.processedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div>
                        Type: {analyticsService.formatDataType(analysis.dataType)}
                      </div>
                      
                      {analysis.fileSize && (
                        <div>
                          Size: {analyticsService.formatFileSize(analysis.fileSize)}
                        </div>
                      )}
                      
                      {analysis.accuracy && (
                        <div className={`flex items-center space-x-1 ${analyticsService.getAccuracyColor(analysis.accuracy)}`}>
                          <BarChart3 className="w-4 h-4" />
                          <span>{analysis.accuracy}% accuracy</span>
                        </div>
                      )}
                      
                      {analysis.processingTime && (
                        <div>
                          {(analysis.processingTime / 1000).toFixed(1)}s processing time
                        </div>
                      )}
                    </div>
                    
                    {analysis.insights && analysis.insights.summary && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {analysis.insights.summary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleSaveToggle(analysis.id, analysis.saved)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      analysis.saved
                        ? 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        : 'text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    title={analysis.saved ? 'Unsave analysis' : 'Save analysis'}
                  >
                    {analysis.saved ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {historyData.pagination.totalPages > 1 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {((historyData.pagination.currentPage - 1) * 20) + 1} to{' '}
              {Math.min(historyData.pagination.currentPage * 20, historyData.pagination.totalItems)} of{' '}
              {historyData.pagination.totalItems} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(historyData.pagination.currentPage - 1)}
                disabled={!historyData.pagination.hasPrev}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-700 
                           border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, historyData.pagination.totalPages) }, (_, i) => {
                  const pageNum = i + Math.max(1, historyData.pagination.currentPage - 2)
                  if (pageNum > historyData.pagination.totalPages) return null
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        pageNum === historyData.pagination.currentPage
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(historyData.pagination.currentPage + 1)}
                disabled={!historyData.pagination.hasNext}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-700 
                           border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History
