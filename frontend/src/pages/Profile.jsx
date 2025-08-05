import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Settings, 
  Moon, 
  Sun, 
  Bell,
  Save,
  Camera
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { authService } from '../services/AuthService'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [editing, setEditing] = useState(false)
  const [loading, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferences: {
      theme: theme,
      notifications: user?.preferences?.notifications ?? true
    }
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await authService.updateProfile({
        name: formData.name,
        preferences: formData.preferences
      })
      
      // Update theme if changed
      if (formData.preferences.theme !== theme) {
        toggleTheme()
      }
      
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      preferences: {
        theme: theme,
        notifications: user?.preferences?.notifications ?? true
      }
    })
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="card text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {user?.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {user?.email}
            </p>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Member since {new Date().getFullYear()}
            </div>
          </div>
        </motion.div>

        {/* Settings Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Information
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="input-field pl-10 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="input-field pl-10 bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Preferences
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {theme === 'dark' ? (
                        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Theme
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Choose your preferred theme
                        </p>
                      </div>
                    </div>
                    <select
                      name="preferences.theme"
                      value={formData.preferences.theme}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="input-field w-32 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Notifications
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Receive email notifications
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="preferences.notifications"
                        checked={formData.preferences.notifications}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Account Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      Files Uploaded
                    </p>
                    <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                      {user?.academicData?.uploadedFiles?.length || 0}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      AI Interactions
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      47
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                      Insights Generated
                    </p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      23
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile