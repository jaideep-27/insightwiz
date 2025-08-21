import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  BarChart3, 
  TrendingUp, 
  Target,
  ArrowRight,
  Star,
  CheckCircle,
  Globe,
  Award,
  Rocket,
  Database,
  Eye,
  Zap,
  Shield,
  Users,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react'

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms that transform raw data into actionable business intelligence',
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Insights',
      description: 'Forecast trends and identify opportunities before they happen with our predictive models',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      icon: Database,
      title: 'Universal Data Support',
      description: 'Connect and analyze data from any source - CSV, databases, APIs, or real-time streams',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Eye,
      title: 'Interactive Visualizations',
      description: 'Beautiful, responsive dashboards that make complex data easy to understand and share',
      gradient: 'from-orange-600 to-red-600'
    }
  ]

  const stats = [
    { number: '10M+', label: 'Data Points Analyzed', icon: Database },
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Shield },
    { number: '24/7', label: 'Expert Support', icon: Award }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Chief Data Officer at TechCorp',
      avatar: '/wizzy.png',
      quote: 'InsightWiz transformed our decision-making process. The AI insights helped us increase revenue by 35% in just 6 months.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'VP of Analytics at DataFlow',
      avatar: '/wizzy.png',
      quote: 'The predictive analytics capabilities are incredible. We now anticipate market changes weeks before our competitors.'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Research Director',
      avatar: '/wizzy.png',
      quote: 'Finally, a platform that makes advanced analytics accessible to everyone, not just data scientists.'
    }
  ]
      title: 'Universal Data Support',
      description: 'Business, financial, personal, academic - we analyze any structured data format',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and privacy protection for your sensitive business and personal data',
      gradient: 'from-gray-500 to-slate-500'
    }
  ]

  const stats = [
    { number: '10M+', label: 'Data Points Analyzed', icon: '📊' },
    { number: '50K+', label: 'Happy Users', icon: '👥' },
    { number: '99.9%', label: 'Uptime Guarantee', icon: '⚡' },
    { number: '24/7', label: 'AI Support', icon: '🤖' }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Data Scientist at TechCorp',
      avatar: '👩‍💻',
      quote: 'InsightWiz transformed how we analyze customer data. The AI insights are incredibly accurate!'
    },
    {
      name: 'Marcus Johnson',
      role: 'Business Analyst',
      avatar: '👨‍💼',
      quote: 'Finally, a platform that makes complex data analysis accessible to everyone in our team.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Marketing Director',
      avatar: '👩‍🎨',
      quote: 'The visualizations are stunning and the insights have boosted our campaign performance by 40%.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              InsightWiz
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <Link
              to="/login"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-4xl">🚀</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  #1 AI Analytics Platform
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-white">Turn Your</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Data Into Gold
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Unlock hidden insights from any data with our AI-powered analytics platform. 
                <span className="text-purple-400 font-semibold"> Business, financial, personal</span> - 
                we analyze it all in seconds! 📊✨
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-xl text-lg flex items-center justify-center transition-all duration-200 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
                >
                  <Sparkles className="mr-2 w-5 h-5" />
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg flex items-center justify-center transition-all duration-200">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Free Forever Plan</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Character & Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Character */}
                <div className="text-center mb-8">
                  <div className="text-9xl mb-4 animate-bounce">🧙‍♂️</div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <p className="text-white font-semibold text-lg mb-2">
                      "I can analyze any data faster than you can say 'insights'!"
                    </p>
                    <p className="text-purple-300">- DataWiz, Your AI Assistant</p>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 right-10 text-4xl"
                >
                  📈
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute bottom-20 left-10 text-3xl"
                >
                  💡
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 right-0 text-2xl"
                >
                  ⚡
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative px-6 py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Data Professionals Worldwide 🌍
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-3xl">🎯</span>
              <h2 className="text-5xl font-bold text-white">
                Supercharge Your Data Analysis
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From business metrics to personal tracking - unlock the full potential of your data with AI-powered insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative px-6 py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-3xl">💬</span>
              <h2 className="text-4xl font-bold text-white">
                What Our Users Say
              </h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-200 italic">"{testimonial.quote}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className="text-6xl">🚀</span>
              <span className="text-6xl">📊</span>
              <span className="text-6xl">✨</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Transform Your Data?
            </h2>
            
            <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join <span className="font-bold text-yellow-300">50,000+</span> professionals who trust InsightWiz 
              for their critical data analysis needs 🎯
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-2xl text-xl transition-all duration-200 flex items-center shadow-2xl hover:shadow-white/25 transform hover:scale-105"
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Start Free Analysis
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
              
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Setup in 30s</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-8 mt-12 opacity-70">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-yellow-300" />
                <span className="text-white font-semibold">#1 Analytics Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-300" />
                <span className="text-white font-semibold">SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-6 h-6 text-blue-300" />
                <span className="text-white font-semibold">Global Scale</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  InsightWiz
                </span>
              </div>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                The ultimate AI-powered data analytics platform. Transform any data into actionable insights in seconds. 🚀
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-xl">🐦</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-xl">💼</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <span className="text-xl">📧</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 InsightWiz. All rights reserved. Made with ❤️ for data lovers.
            </p>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing