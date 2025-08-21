import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import wizzyLogo from '../assets/wizzy.png'
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
  Activity,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      avatar: wizzyLogo,
      quote: 'InsightWiz transformed our decision-making process. The AI insights helped us increase revenue by 35% in just 6 months.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'VP of Analytics at DataFlow',
      avatar: wizzyLogo,
      quote: 'The predictive analytics capabilities are incredible. We now anticipate market changes weeks before our competitors.'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Research Director',
      avatar: wizzyLogo,
      quote: 'Finally, a platform that makes advanced analytics accessible to everyone, not just data scientists.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <img src={wizzyLogo} alt="InsightWiz" className="w-10 h-10" />
              <span className="text-2xl font-bold text-gray-900">InsightWiz</span>
            </motion.div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium">Reviews</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
              <Link 
                to="/register" 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4"
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium">Reviews</a>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center"
                >
                  Start Free Trial
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transform Data Into
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> 
                  {' '}Strategic Insights
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Harness the power of AI to unlock hidden patterns in your data. Make informed decisions 
                with advanced analytics that scale with your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                >
                  Start Free Trial <ArrowRight size={20} />
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 transition-colors font-semibold flex items-center justify-center gap-2">
                  Watch Demo <PieChart size={20} />
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Dashboard Preview */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="flex items-center gap-3 mb-6">
                  <img src={wizzyLogo} alt="InsightWiz" className="w-8 h-8" />
                  <span className="font-semibold text-gray-900">Analytics Dashboard</span>
                </div>
                
                {/* Mock Chart */}
                <div className="space-y-4">
                  <div className="h-40 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg flex items-end justify-around p-4">
                    {[65, 85, 45, 95, 75, 60, 80].map((height, i) => (
                      <div 
                        key={i} 
                        className="bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t"
                        style={{ height: `${height}%`, width: '12%' }}
                      />
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">+23%</div>
                      <div className="text-sm text-gray-600">Revenue Growth</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">4.2M</div>
                      <div className="text-sm text-gray-600">Data Points</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">98.5%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
              >
                <TrendingUp size={24} />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
              >
                <Brain size={24} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                  <stat.icon className="text-indigo-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to transform your data into competitive advantage
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See how InsightWiz is transforming businesses worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using InsightWiz to make smarter, data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                Start Your Free Trial <Rocket size={20} />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-semibold">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={wizzyLogo} alt="InsightWiz" className="w-10 h-10" />
                <span className="text-2xl font-bold">InsightWiz</span>
              </div>
              <p className="text-gray-400 mb-6">
                The leading AI-powered data analytics platform for modern businesses.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe size={20} />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users size={20} />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Award size={20} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 InsightWiz. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing