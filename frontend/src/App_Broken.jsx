import { BrowserRouter as Router, Routes, Route, Navigate            <Route path="/upload" element={
              user ? (
                <DashboardLayout>
                  <UploadData />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/history" element={
              user ? (
                <DashboardLayout>
                  <History />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/ai-tools" element={eact-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadData from './pages/UploadData'
import AITools from './pages/AITools'
import Profile from './pages/Profile'
import History from './pages/History'

// Layout
import DashboardLayout from './layouts/DashboardLayout'

// Test component
import TestLogin from './components/TestLogin'

function App() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className={theme}>
      <Router>
        <div className={`h-screen transition-colors duration-200 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
            : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        }`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              user ? (
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/upload" element={
              user ? (
                <DashboardLayout>
                  <UploadData />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/history" element={
              user ? (
                <DashboardLayout>
                  <History />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/ai-tools" element={
              user ? (
                <DashboardLayout>
                  <AITools />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/profile" element={
              user ? (
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" />
              )
            } />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000',
              },
            }}
          />
          {/* Test login button for development */}
          {!user && <TestLogin />}
        </div>
      </Router>
    </div>
  )
}

export default App