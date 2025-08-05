import { useAuth } from '../context/AuthContext'

const TestLogin = () => {
  const { login } = useAuth()

  const handleTestLogin = async () => {
    try {
      // Create a test user
      await login('test@insightwhiz.com', 'password123')
    } catch (error) {
      console.error('Test login failed:', error)
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