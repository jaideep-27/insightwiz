import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  BookOpen, 
  Lightbulb, 
  Heart,
  Send,
  Bot,
  User,
  Database
} from 'lucide-react'
import { geminiService } from '../services/GeminiService'
import { mlService } from '../services/MLService'
import { analyticsService } from '../services/AnalyticsService'
import toast from 'react-hot-toast'

const AITools = () => {
  const [activeTab, setActiveTab] = useState('chat')
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [userAnalytics, setUserAnalytics] = useState(null)
  const [projectForm, setProjectForm] = useState({
    subject: '',
    level: 'intermediate',
    interests: ''
  })
  const [projectIdeas, setProjectIdeas] = useState(null)
  const [projectLoading, setProjectLoading] = useState(false)
  const [sentimentText, setSentimentText] = useState('')
  const [sentimentResult, setSentimentResult] = useState(null)
  const [sentimentLoading, setSentimentLoading] = useState(false)

  // Load user's analysis history on component mount
  useEffect(() => {
    loadUserAnalytics()
  }, [])

  const loadUserAnalytics = async () => {
    try {
      const response = await analyticsService.getDashboardData()
      if (response.success) {
        setUserAnalytics(response.data)
      }
    } catch (error) {
      console.error('Failed to load user analytics:', error)
    }
  }

  const tabs = [
    { id: 'chat', name: 'AI Chat', icon: MessageCircle },
    { id: 'study-plan', name: 'Study Plan', icon: BookOpen },
    { id: 'projects', name: 'Project Ideas', icon: Lightbulb },
    { id: 'sentiment', name: 'Sentiment Analysis', icon: Heart }
  ]

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = { role: 'user', content: chatInput }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      // Include user context in the chat
      const userContext = userAnalytics ? {
        totalAnalyses: userAnalytics.stats.totalScans,
        recentActivity: userAnalytics.recentActivity?.slice(0, 3), // Last 3 analyses
        favoriteDataType: userAnalytics.stats.favoriteDataType,
        averageAccuracy: userAnalytics.stats.averageAccuracy
      } : null

      const response = await geminiService.chatWithAI(chatInput, chatMessages, userContext)
      const aiMessage = { role: 'assistant', content: response.response }
      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      toast.error('Failed to get AI response')
    } finally {
      setChatLoading(false)
    }
  }

  const handleProjectGeneration = async (e) => {
    e.preventDefault()
    if (!projectForm.subject || !projectForm.interests) {
      toast.error('Please fill in all fields')
      return
    }

    setProjectLoading(true)
    try {
      const response = await geminiService.generateProjectIdeas(
        projectForm.subject,
        projectForm.level,
        projectForm.interests
      )
      setProjectIdeas(response.projectIdeas)
      toast.success('Project ideas generated!')
    } catch (error) {
      toast.error('Failed to generate project ideas')
    } finally {
      setProjectLoading(false)
    }
  }

  const handleSentimentAnalysis = async (e) => {
    e.preventDefault()
    if (!sentimentText.trim()) {
      toast.error('Please enter some text to analyze')
      return
    }

    setSentimentLoading(true)
    try {
      const response = await mlService.analyzeSentiment(sentimentText)
      setSentimentResult(response.data)
      toast.success('Sentiment analysis completed!')
    } catch (error) {
      toast.error('Failed to analyze sentiment')
    } finally {
      setSentimentLoading(false)
    }
  }

  const renderChatTab = () => (
    <div className="space-y-4">
      {/* AI Context Panel */}
      {userAnalytics && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-blue-900 dark:text-blue-100">AI Context Available</h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            I can see your analysis history: {userAnalytics.stats.totalScans} analyses completed, 
            {userAnalytics.recentActivity?.length > 0 
              ? ` recent files: ${userAnalytics.recentActivity.slice(0, 3).map(a => a.fileName).join(', ')}`
              : ' no recent activity'
            }
          </p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-96 overflow-y-auto">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start a conversation with your AI assistant!</p>
            {userAnalytics?.stats.totalScans > 0 && (
              <p className="text-sm mt-2">Try asking about your {userAnalytics.stats.totalScans} data analyses.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-600 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleChatSubmit} className="flex space-x-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask me anything about your studies..."
          className="flex-1 input-field"
          disabled={chatLoading}
        />
        <button
          type="submit"
          disabled={chatLoading || !chatInput.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <form onSubmit={handleProjectGeneration} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={projectForm.subject}
            onChange={(e) => setProjectForm({ ...projectForm, subject: e.target.value })}
            placeholder="e.g., Computer Science, Mathematics, Biology"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Level
          </label>
          <select
            value={projectForm.level}
            onChange={(e) => setProjectForm({ ...projectForm, level: e.target.value })}
            className="input-field"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Interests
          </label>
          <textarea
            value={projectForm.interests}
            onChange={(e) => setProjectForm({ ...projectForm, interests: e.target.value })}
            placeholder="Describe your interests, hobbies, or specific areas you'd like to explore..."
            className="input-field h-24 resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={projectLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {projectLoading ? 'Generating Ideas...' : 'Generate Project Ideas'}
        </button>
      </form>

      {projectIdeas && (
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Generated Project Ideas
          </h4>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {projectIdeas}
          </div>
        </div>
      )}
    </div>
  )

  const renderSentimentTab = () => (
    <div className="space-y-6">
      <form onSubmit={handleSentimentAnalysis} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text to Analyze
          </label>
          <textarea
            value={sentimentText}
            onChange={(e) => setSentimentText(e.target.value)}
            placeholder="Enter text to analyze sentiment (feedback, reviews, comments, etc.)"
            className="input-field h-32 resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={sentimentLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sentimentLoading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>

      {sentimentResult && (
        <div className="card">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Sentiment Analysis Results
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Overall Sentiment:</span>
              <span className={`font-semibold capitalize ${
                sentimentResult.sentiment === 'positive' ? 'text-green-600' :
                sentimentResult.sentiment === 'negative' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {sentimentResult.sentiment}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Confidence:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {(sentimentResult.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium text-gray-900 dark:text-white">Detailed Scores:</h5>
              {Object.entries(sentimentResult.scores).map(([emotion, score]) => (
                <div key={emotion} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {emotion}:
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          emotion === 'positive' ? 'bg-green-500' :
                          emotion === 'negative' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(100, score * 10)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {score.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Leverage AI-powered tools to enhance your academic experience
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        {activeTab === 'chat' && renderChatTab()}
        {activeTab === 'study-plan' && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Study Plan Generator
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Coming soon! Generate personalized study plans based on your goals and performance.
            </p>
          </div>
        )}
        {activeTab === 'projects' && renderProjectsTab()}
        {activeTab === 'sentiment' && renderSentimentTab()}
      </motion.div>
    </div>
  )
}

export default AITools