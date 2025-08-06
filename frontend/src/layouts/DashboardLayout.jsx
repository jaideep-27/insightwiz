import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Upload, 
  Brain, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LogOut,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const navigation = [
    { name: 'Analytics Dashboard', href: '/dashboard', icon: Home },
    { name: 'Data Upload', href: '/upload', icon: Upload },
    { name: 'AI Insights', href: '/ai-tools', icon: Brain },
    { name: 'Account Settings', href: '/profile', icon: User },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className={`h-screen flex transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 ${
        theme === 'dark' 
          ? 'bg-gray-900/90 border-purple-500/20' 
          : 'bg-white/90 border-gray-200/50'
      } backdrop-blur-xl border-r shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:flex lg:flex-col`}>
        <div className={`flex items-center justify-between h-20 px-6 border-b ${
          theme === 'dark' ? 'border-purple-500/20' : 'border-gray-200/50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">InsightWhiz</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive(item.href) ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  {item.name}
                </Link>
              )
            })}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              )}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          theme === 'dark' ? 'border-purple-500/20' : 'border-gray-200/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {user?.name}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className={`p-2 rounded-lg transition-all duration-200 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white hover:bg-red-500/20' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-red-100'
              }`}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile menu button - only visible on mobile */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page content */}
        <main className={`flex-1 overflow-auto p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900/50 to-purple-900/50' 
            : 'bg-gradient-to-br from-blue-50/50 to-purple-50/50'
        }`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout