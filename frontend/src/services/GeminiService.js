import axios from 'axios'
import { authService } from './AuthService'

const API_URL = '/api/gemini'

class GeminiService {
  async generateSummary(data) {
    const response = await axios.post(`${API_URL}/summary`, { data }, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }

  async chatWithAI(message, conversationHistory = [], userContext = null) {
    const response = await axios.post(`${API_URL}/chat`, {
      message,
      history: conversationHistory,
      userContext
    }, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }

  async generateProjectIdeas(subject, level, interests) {
    const response = await axios.post(`${API_URL}/project-ideas`, {
      subject,
      level,
      interests
    }, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }

  async rewriteFeedback(originalText, tone = 'constructive') {
    const response = await axios.post(`${API_URL}/rewrite-feedback`, {
      text: originalText,
      tone
    }, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }

  async getPersonalizedInsights(userData) {
    const response = await axios.post(`${API_URL}/insights`, userData, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }
}

export const geminiService = new GeminiService()