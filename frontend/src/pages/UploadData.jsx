import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, BarChart3, Brain, Download, TrendingUp, PieChart } from 'lucide-react'
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
import { mlService } from '../services/MLService'
import toast from 'react-hot-toast'

const UploadData = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [dataType, setDataType] = useState('')
  const [step, setStep] = useState(1) // 1: Upload, 2: Configure, 3: Results
  const [analysisOptions, setAnalysisOptions] = useState({
    includeVisualization: true,
    includePredictions: true,
    includeInsights: true
  })

  const dataTypes = [
    {
      value: 'business',
      label: 'Business Analytics',
      icon: '📊',
      description: 'Sales, revenue, KPIs, performance metrics',
      insights: 'business performance, revenue trends, growth opportunities'
    },
    {
      value: 'financial',
      label: 'Financial Data',
      icon: '💰',
      description: 'Expenses, budgets, investments, transactions',
      insights: 'financial health, spending patterns, investment opportunities'
    },
    {
      value: 'personal',
      label: 'Personal Tracking',
      icon: '👤',
      description: 'Habits, goals, health, productivity metrics',
      insights: 'personal improvement, habit patterns, goal achievement'
    },
    {
      value: 'academic',
      label: 'Academic Records',
      icon: '🎓',
      description: 'Grades, assessments, learning progress',
      insights: 'academic performance, learning trends, improvement areas'
    },
    {
      value: 'survey',
      label: 'Survey Results',
      icon: '📋',
      description: 'Questionnaires, feedback, research data',
      insights: 'response patterns, satisfaction levels, key findings'
    },
    {
      value: 'operational',
      label: 'Operations Data',
      icon: '⚙️',
      description: 'Process metrics, efficiency, quality control',
      insights: 'operational efficiency, bottlenecks, optimization opportunities'
    },
    {
      value: 'marketing',
      label: 'Marketing Analytics',
      icon: '📈',
      description: 'Campaigns, engagement, conversion rates',
      insights: 'campaign performance, audience engagement, conversion optimization'
    },
    {
      value: 'other',
      label: 'Other/Custom',
      icon: '🔧',
      description: 'Any other structured data format',
      insights: 'data patterns, trends, key metrics'
    }
  ]

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        setStep(2) // Move to configuration step
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
        setStep(2) // Move to configuration step
      }
    }
  }

  const validateFile = (file) => {
    const allowedTypes = ['text/csv', 'application/json']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a CSV or JSON file')
      return false
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB')
      return false
    }

    return true
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    if (!dataType) {
      toast.error('Please select your data type')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('dataType', dataType)
    formData.append('analysisOptions', JSON.stringify(analysisOptions))

    try {
      const response = await mlService.uploadData(formData)
      setResults(response.data)
      setStep(3) // Move to results step
      toast.success('Data analyzed successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed')
    } finally {
      setUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setResults(null)
    setDataType('')
    setStep(1)
  }

  const generatePDFReport = () => {
    // TODO: Implement PDF generation
    toast.success('PDF report generation coming soon!')
  }

  const formatInsights = (text) => {
    if (!text) return <p>No insights available.</p>

    // Remove asterisks and format properly
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '')

    // Split into paragraphs and format
    const paragraphs = cleanText.split('\n').filter(p => p.trim())

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => {
          // Check if it's a numbered list item
          if (paragraph.match(/^\d+\./)) {
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  {paragraph.match(/^(\d+)/)[1]}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {paragraph.replace(/^\d+\.\s*/, '')}
                </p>
              </div>
            )
          }

          // Regular paragraph
          return (
            <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          )
        })}
      </div>
    )
  }

  const generateSampleChartData = () => {
    // Generate sample data based on data type
    const baseData = [
      { name: 'Jan', value: 65 },
      { name: 'Feb', value: 78 },
      { name: 'Mar', value: 82 },
      { name: 'Apr', value: 75 },
      { name: 'May', value: 88 },
      { name: 'Jun', value: 92 }
    ]

    // Customize based on data type
    switch (dataType) {
      case 'business':
        return baseData.map(item => ({ ...item, name: item.name, value: item.value * 1000 }))
      case 'financial':
        return baseData.map(item => ({ ...item, name: item.name, value: item.value * 100 }))
      default:
        return baseData
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Upload Your Data
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload any structured data file for comprehensive AI-powered analysis and insights
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[
            { num: 1, label: 'Upload File', active: step >= 1 },
            { num: 2, label: 'Configure Analysis', active: step >= 2 },
            { num: 3, label: 'View Results', active: step >= 3 }
          ].map((stepItem, index) => (
            <div key={stepItem.num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${stepItem.active
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                {stepItem.num}
              </div>
              <span className={`ml-2 font-medium ${stepItem.active
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500'
                }`}>
                {stepItem.label}
              </span>
              {index < 2 && (
                <div className={`w-8 h-0.5 mx-4 ${step > stepItem.num ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: File Upload */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-2xl mx-auto"
        >
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <Upload className="w-10 h-10 text-white" />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Upload Your Data File
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Drag and drop your file here, or click to browse
                </p>

                <label className="btn-primary text-lg px-8 py-4 cursor-pointer inline-flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.json"
                    onChange={handleFileSelect}
                  />
                </label>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Supports CSV and JSON files up to 10MB
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Configuration */}
      {step === 2 && file && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* File Info */}
          <div className="card max-w-5xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{file.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                </p>
              </div>
              <button
                onClick={resetUpload}
                className="ml-auto text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            {/* Data Type Selection */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What type of data are you analyzing?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dataTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setDataType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${dataType === type.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{type.icon}</span>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {type.label}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Options */}
            {dataType && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Analysis Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries({
                    includeVisualization: 'Generate interactive charts and graphs',
                    includePredictions: 'Include predictive analytics and forecasting',
                    includeInsights: 'Generate AI-powered insights and recommendations'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={analysisOptions[key]}
                        onChange={(e) => setAnalysisOptions(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            {dataType && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 py-4 text-lg"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing Your Data...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Start Analysis</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}



      {/* Step 3: Results */}
      {step === 3 && results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Success Header */}
          <div className="card text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
              Analysis Complete!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Your {dataTypes.find(t => t.value === dataType)?.label.toLowerCase()} data has been successfully analyzed
            </p>
          </div>

          {/* Data Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Data Format</h4>
              <p className="text-2xl font-bold text-blue-600">{results.processed_data?.format || 'CSV'}</p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Quality Score</h4>
              <p className="text-2xl font-bold text-green-600">
                {((results.insights?.data_quality || 0.85) * 100).toFixed(0)}%
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Records</h4>
              <p className="text-2xl font-bold text-purple-600">
                {results.processed_data?.rows || 'N/A'}
              </p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI-Generated Insights
              </h3>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {formatInsights(results.insights?.summary || results.insights?.recommendations?.join('. ') || 'Analysis completed successfully.')}
              </div>
            </div>
          </div>

          {/* Sample Charts */}
          {analysisOptions.includeVisualization && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sample Line Chart */}
              <div className="card">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Trend Analysis
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateSampleChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
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
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sample Bar Chart */}
              <div className="card">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Distribution Analysis
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateSampleChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={generatePDFReport}
              className="btn-primary flex items-center justify-center space-x-2 px-8 py-3"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF Report</span>
            </button>

            <button
              onClick={resetUpload}
              className="btn-secondary flex items-center justify-center space-x-2 px-8 py-3"
            >
              <Upload className="w-5 h-5" />
              <span>Analyze New Data</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default UploadData