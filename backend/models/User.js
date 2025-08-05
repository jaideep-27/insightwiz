const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  academicData: {
    uploadedFiles: [{
      filename: String,
      uploadDate: Date,
      fileSize: Number,
      dataType: {
        type: String,
        enum: ['business', 'financial', 'personal', 'academic', 'survey', 'operational', 'marketing', 'other'],
        default: 'other'
      },
      processed: {
        type: Boolean,
        default: false
      },
      analysisResults: {
        insights: String,
        visualizations: [String],
        predictions: Object
      }
    }],
    performanceMetrics: {
      totalAnalyses: {
        type: Number,
        default: 0
      },
      accuracyScore: Number,
      lastUpdated: Date
    }
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

module.exports = mongoose.model('User', userSchema)