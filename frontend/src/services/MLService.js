import axios from 'axios'
import { authService } from './AuthService'

const API_URL = '/api/ml'

class MLService {
  async predictPerformance(data) {
    const response = await axios.post(`${API_URL}/predict`, data, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }

  async getStudentClusters(data) {
    const response = await axios.post(`${API_URL}/cluster`, data, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }

  async generateStudyPlan(studentData) {
    const response = await axios.post(`${API_URL}/study-plan`, studentData, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }

  async analyzeSentiment(text) {
    const response = await axios.post(`${API_URL}/sentiment`, { text }, {
      headers: authService.getAuthHeader()
    })
    return response.data
  }

  async uploadData(formData) {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...authService.getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export const mlService = new MLService()