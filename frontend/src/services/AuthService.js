import axios from 'axios'

const API_URL = '/api/auth'

class AuthService {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    })
    return response.data
  }

  async register(name, email, password) {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password
    })
    return response.data
  }

  async verifyToken() {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No token found')

    const response = await axios.get(`${API_URL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.user
  }

  getAuthHeader() {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

export const authService = new AuthService()