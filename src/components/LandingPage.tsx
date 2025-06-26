import React from 'react';
import { motion } from 'framer-motion';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Heart, 
  Activity, 
  Zap, 
  Shield, 
  Clock, 
  Award, 
  Users,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Brain Analysis",
      description: "Advanced neural network analysis of brain MRI scans with 99.2% accuracy"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Cardiac Imaging",
      description: "Comprehensive heart scan analysis detecting cardiac anomalies in real-time"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Multi-Organ Detection",
      description: "Simultaneous analysis of brain, lungs, liver, and heart from single scans"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Results",
      description: "Get diagnostic insights in seconds, not hours or days"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "HIPAA Compliant",
      description: "Bank-level encryption and security for all patient data"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "FDA Approved",
      description: "Clinically validated and approved for medical diagnostic use"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Radiologist, Mayo Clinic",
      content: "MediScan AI has revolutionized our diagnostic workflow. We're detecting anomalies 40% faster with unprecedented accuracy.",
      rating: 5
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Neurologist, Johns Hopkins",
      content: "The brain scan analysis is remarkable. It's like having a senior radiologist available 24/7.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Cardiac Surgeon, Cleveland Clinic",
      content: "The cardiac imaging capabilities have helped us catch critical conditions that might have been missed.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How accurate is MediScan AI?",
      answer: "Our AI models achieve 99.2% accuracy on brain scans, 98.7% on cardiac imaging, and 97.9% on multi-organ analysis, validated through extensive clinical trials."
    },
    {
      question: "Is patient data secure?",
      answer: "Absolutely. We use AES-256 encryption, HIPAA-compliant infrastructure, and secure IPFS storage. All data is encrypted both in transit and at rest."
    },
    {
      question: "What file formats are supported?",
      answer: "We support DICOM, JPEG, PNG, and TIFF formats for medical imaging. Our system automatically optimizes uploads for analysis."
    },
    {
      question: "How long does analysis take?",
      answer: "Most scans are analyzed within 5-15 seconds. Complex multi-organ analyses may take up to 30 seconds depending on image resolution."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              MediScan AI
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Reviews</a>
            <a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
            <ThemeToggle />
            
            {/* Authentication Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-slate-300 hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button 
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 font-medium"
                  onClick={() => navigate('/dashboard')}
                >
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="block text-slate-300 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="block text-slate-300 hover:text-white transition-colors">Reviews</a>
              <a href="#contact" className="block text-slate-300 hover:text-white transition-colors">Contact</a>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <ThemeToggle />
                <div className="space-x-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="text-slate-300 hover:text-white transition-colors">Sign In</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm">
                        Get Started
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      Dashboard
                    </button>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <motion.div 
                  className="inline-flex items-center px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  AI-Powered Medical Imaging
                </motion.div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                    AI Medical Imaging.
                  </span>
                  <br />
                  <span className="text-slate-300">
                    Detect Anomalies in 
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Seconds</span>
                  </span>
                </h1>
                
                <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                  Revolutionary AI technology that analyzes MRI scans of brain, lungs, liver, and heart 
                  with unprecedented speed and accuracy. Trusted by leading medical institutions worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <motion.button 
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center group shadow-lg shadow-cyan-500/25"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </SignUpButton>
                </SignedOut>
                
                <SignedIn>
                  <motion.button 
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-semibold text-lg flex items-center justify-center group shadow-lg shadow-cyan-500/25"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </SignedIn>
                
                <motion.button 
                  className="px-8 py-4 border border-slate-600 rounded-xl hover:border-slate-500 transition-all duration-300 font-semibold text-lg flex items-center justify-center group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </motion.button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">99.2%</div>
                  <div className="text-sm text-slate-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">5s</div>
                  <div className="text-sm text-slate-400">Avg Analysis Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">50K+</div>
                  <div className="text-sm text-slate-400">Scans Analyzed</div>
                </div>
              </div>
            </motion.div>

            {/* 3D Medical Organs Animation */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Brain */}
                <motion.div 
                  className="absolute top-8 left-8 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>

                {/* Heart */}
                <motion.div 
                  className="absolute top-32 right-12 w-28 h-28 bg-gradient-to-br from-red-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Heart className="w-14 h-14 text-white" />
                </motion.div>

                {/* Lungs */}
                <motion.div 
                  className="absolute bottom-20 left-12 w-26 h-26 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 3, 0] 
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Activity className="w-12 h-12 text-white" />
                </motion.div>

                {/* Central Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Advanced Features
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Cutting-edge AI technology designed specifically for medical professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Three simple steps to revolutionize your diagnostic workflow
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload Scan",
                description: "Securely upload MRI images via our encrypted drag-and-drop interface",
                icon: <Activity className="w-8 h-8" />
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our advanced AI analyzes the scan for anomalies across multiple organs",
                icon: <Brain className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Generate Report",
                description: "Receive comprehensive PDF report with findings and recommendations",
                icon: <Award className="w-8 h-8" />
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Trusted by Leading Doctors
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              See what medical professionals are saying about MediScan AI
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Join thousands of medical professionals using MediScan AI to improve patient outcomes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <motion.button 
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-slate-100 transition-all duration-300 font-semibold text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Free Trial
                  </motion.button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <motion.button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-slate-100 transition-all duration-300 font-semibold text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Dashboard
                </motion.button>
              </SignedIn>
              <motion.button 
                className="px-8 py-4 border border-white/30 text-white rounded-xl hover:border-white/50 transition-all duration-300 font-semibold text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="px-6 py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  MediScan AI
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Revolutionary AI-powered medical imaging platform trusted by healthcare professionals worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 MediScan AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;