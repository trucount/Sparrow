"use client"

import { motion } from "framer-motion"
import { SparrowLogo } from "../sparrow-logo"
import { User, Heart, Cpu, Code, Zap, Globe } from "lucide-react"

export function AboutPage() {
  const stats = [
    { label: "AI Models", value: "50+", icon: Cpu },
    { label: "Lines Generated", value: "10L+", icon: Code },
    { label: "Projects Created", value: "100+", icon: Globe },
    { label: "Errors Solved", value: "5k+", icon: Heart },
  ]

  const timeline = [
    {
      year: "2024",
      title: "The Vision",
      description: "Satvik Singh envisioned a platform where AI and human creativity could work together seamlessly"
    },
    {
      year: "2024",
      title: "Development Begins",
      description: "Started building Sparrow AI with a focus on intuitive design and powerful AI integration"
    },
    {
      year: "2025",
      title: "Launch",
      description: "Sparrow AI goes live, empowering developers worldwide with AI-powered code generation"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center py-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 scale-150" />
              <SparrowLogo size={100} className="relative z-10" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
          >
            About Sparrow AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Where human creativity meets artificial intelligence to create extraordinary web experiences
          </motion.p>
        </motion.section>

        {/* Creator Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="py-20"
        >
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-3xl p-12 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Built by Satvik Singh
              </h2>
              
              <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                A passionate developer and AI enthusiast who believes in the power of human-AI collaboration. 
                Sparrow AI represents the perfect synergy between human creativity and artificial intelligence, 
                designed to empower developers and bring ideas to life faster than ever before.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="py-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.8 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="text-center group"
                >
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/50">
                    <Icon className="w-8 h-8 mx-auto mb-4 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="py-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-blue-400">Human-AI Synergy</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                We believe that the future of software development lies not in replacing human creativity, 
                but in amplifying it. Sparrow AI is designed to be your intelligent coding companion, 
                understanding your vision and helping you bring it to life with unprecedented speed and precision.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our platform combines the intuitive understanding of human needs with the computational 
                power of advanced AI models, creating a development experience that feels natural, 
                efficient, and inspiring.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-8 border border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/50 rounded-xl p-4 text-center">
                    <Cpu className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm text-gray-300">AI Power</div>
                  </div>
                  <div className="bg-black/50 rounded-xl p-4 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-red-400" />
                    <div className="text-sm text-gray-300">Human Touch</div>
                  </div>
                  <div className="bg-black/50 rounded-xl p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-sm text-gray-300">Lightning Fast</div>
                  </div>
                  <div className="bg-black/50 rounded-xl p-4 text-center">
                    <Code className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <div className="text-sm text-gray-300">Clean Code</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Timeline Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="py-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Journey
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.4 + index * 0.2, duration: 0.8 }}
                className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                    <div className="text-blue-400 font-bold text-lg mb-2">{item.year}</div>
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-30" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}