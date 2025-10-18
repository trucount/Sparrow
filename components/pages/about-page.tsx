"use client"

import { motion } from "framer-motion"
import { SparrowLogo } from "../sparrow-logo"

export function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <SparrowLogo size={80} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            About Sparrow AI
          </h1>
          <p className="text-xl text-gray-400">
            Empowering developers with AI-powered code generation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-8 text-gray-300"
        >
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
            <p className="leading-relaxed">
              Sparrow AI is designed to democratize software development by making it accessible to everyone.
              Whether you're a seasoned developer or just starting out, our AI-powered platform helps you
              build web applications, mobile apps, and more with unprecedented speed and efficiency.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What We Offer</h2>
            <ul className="space-y-3 leading-relaxed">
              <li>• AI-powered code generation for multiple frameworks</li>
              <li>• Real-time preview and editing capabilities</li>
              <li>• Support for 50+ AI models</li>
              <li>• Export and deployment options</li>
              <li>• Comprehensive project management tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Technology</h2>
            <p className="leading-relaxed">
              Built with cutting-edge technologies including Next.js, React, and advanced AI models,
              Sparrow AI provides a seamless development experience that adapts to your needs.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
