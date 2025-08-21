import { useAuth } from '../context/AuthContext'

const TestLogin = () => {
  const { login } = useAuth()

  const handleTestLogin = async () => {
    try {
      console.log('🧪 Starting test login...')
      console.log('📧 Email: test@insightwiz.com')
      console.log('🔐 Password: password123')
      
      const result = await login('test@insightwiz.com', 'password123')
      console.log('✅ Test login successful!', result)
      alert('✅ Test login successful!')
    } catch (error) {
      console.error('❌ Test login failed:', error)
      console.error('❌ Error details:', error.response?.data || error.message)
      alert(`❌ Test login failed: ${error.response?.data?.error || error.message}`)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleTestLogin}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg"
      >
        🧪 Test Login
      </button>
    </div>
  )
}

export default TestLogin