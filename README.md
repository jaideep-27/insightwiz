# InsightWhiz 🚀📊

**The Ultimate AI-Powered Data Analytics Platform**

Transform any data into actionable insights with cutting-edge machine learning and AI technology. From business metrics to personal tracking - InsightWhiz analyzes it all.

![InsightWhiz Banner](https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=InsightWhiz+-+AI+Data+Analytics+Platform)

## 🌟 Features

- 🎯 **Universal Data Analysis** - Business, financial, personal, academic, survey, operational data
- 🤖 **AI-Powered Insights** - Google Gemini AI integration for natural language insights
- 📊 **Interactive Visualizations** - Dynamic charts, graphs, and dashboards
- 🔮 **Predictive Analytics** - ML-driven forecasting and trend analysis
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🌙 **Dark/Light Mode** - Beautiful themes for any preference
- 🔒 **Enterprise Security** - JWT authentication and data encryption
- 📄 **PDF Reports** - Export comprehensive analysis reports

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   ML Backend    │
│   React.js      │◄──►│   Node.js       │◄──►│   Python        │
│   TailwindCSS   │    │   Express       │    │   Flask         │
│   Framer Motion │    │   JWT Auth      │    │   Scikit-learn  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   MongoDB       │◄─────────────┘
                        │   Atlas         │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   Gemini AI     │
                        │   Google API    │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB Atlas** account
- **Google Gemini API** key

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/insightwhiz.git
cd insightwhiz
```

### 2. Install Dependencies

```bash
# Install all dependencies at once
npm run install:all

# Or install individually:
npm install                    # Root dependencies
cd frontend && npm install     # Frontend dependencies
cd ../backend && npm install   # Backend dependencies
cd ../ml-backend && pip install -r requirements.txt  # Python dependencies
```

### 3. Environment Setup

Create `.env` files in the backend directory:

```bash
# backend/.env
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/insightwhiz
JWT_SECRET=your-super-secure-jwt-secret-key-here
GEMINI_API_KEY=your-google-gemini-api-key
PORT=5000
NODE_ENV=development
ML_BACKEND_URL=http://localhost:8000
```

### 4. Start All Services

**Option 1: Start everything at once (Recommended)**
```bash
npm run dev
```

**Option 2: Start services individually**

```bash
# Terminal 1 - Frontend (React)
cd frontend
npm run dev

# Terminal 2 - Backend API (Node.js)
cd backend
npm run dev

# Terminal 3 - ML Backend (Python)
cd ml-backend
python app.py
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **ML Backend**: http://localhost:8000

## 📋 Available Scripts

### Root Level Commands

```bash
npm run dev              # Start all services concurrently
npm run install:all      # Install all dependencies
npm run setup:python     # Install Python dependencies only
npm run build           # Build frontend for production
```

### Frontend Commands

```bash
cd frontend
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

### Backend Commands

```bash
cd backend
npm run dev             # Start with nodemon (auto-restart)
npm start               # Start production server
```

### ML Backend Commands

```bash
cd ml-backend
python app.py           # Start Flask development server
```

## 🔧 Development Setup

### Create Test User

```bash
cd backend
node scripts/createTestUser.js
```

**Test Credentials:**
- Email: `test@insightwhiz.com`
- Password: `password123`

### Database Setup

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add it to `backend/.env` as `MONGO_URI`

### API Keys Setup

1. **Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to `backend/.env` as `GEMINI_API_KEY`

## 📊 Data Types Supported

- 📈 **Business Analytics** - Sales, revenue, KPIs, performance metrics
- 💰 **Financial Data** - Expenses, budgets, investments, transactions
- 👤 **Personal Tracking** - Habits, goals, health, productivity metrics
- 🎓 **Academic Records** - Grades, assessments, learning progress
- 📋 **Survey Results** - Questionnaires, feedback, research data
- ⚙️ **Operations Data** - Process metrics, efficiency, quality control
- 📈 **Marketing Analytics** - Campaigns, engagement, conversion rates
- 🔧 **Custom Data** - Any structured CSV or JSON format

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI library
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive data visualizations
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security middleware

### ML & AI
- **Python Flask** - ML API server
- **Scikit-learn** - Machine learning library
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Google Gemini AI** - Natural language processing

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render)

```bash
cd backend
# Deploy to Railway or Render
```

### ML Backend (Railway/Render)

```bash
cd ml-backend
# Deploy to Railway or Render with Python runtime
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill all Node processes
taskkill /f /im node.exe  # Windows
killall node             # macOS/Linux
```

**Python dependencies issues:**
```bash
cd ml-backend
pip install --upgrade pip
pip install -r requirements.txt
```

**MongoDB connection issues:**
- Check your MongoDB Atlas IP whitelist
- Verify connection string in `.env`
- Ensure database user has proper permissions

### Support

- 📧 Email: support@insightwhiz.com
- 💬 Discord: [Join our community](https://discord.gg/insightwhiz)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/insightwhiz/issues)

---

**Made with ❤️ by the InsightWhiz Team**