"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SparrowLogo } from "../sparrow-logo"
import { Mail, Heart, ExternalLink } from "lucide-react"

export function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 25 + 25,
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
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur-3xl opacity-30 scale-150" />
              <SparrowLogo size={100} className="relative z-10" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent"
          >
            Get in Touch
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Have questions, feedback, or want to collaborate? We'd love to connect with you!
          </motion.p>
        </motion.section>

        {/* Contact Content */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="py-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Social Links instead of Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-2xl">
                    🌐 Connect with Us
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    Follow us on social platforms and stay updated!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => window.open("https://instagram.com/trucount_enterprise", "_blank")}
                    className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-3 text-lg font-semibold"
                  >
                    📷 Instagram
                  </Button>
                  <Button
                    onClick={() => window.open("https://linktr.ee/trucount.entriprises", "_blank")}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 text-lg font-semibold"
                  >
                    🔗 Linktree
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mailing List & Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="space-y-8"
            >
              {/* Join Our Community */}
              <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border-purple-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Heart className="w-5 h-5 mr-3 text-purple-400" />
                    Join Our Community
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Be part of the AI-powered development revolution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-purple-100">
                      Want to stay updated with the latest features, tips, and AI development insights? 
                      Click below to join via our Linktree.
                    </p>
                    <Button
                      onClick={() => window.open("https://linktr.ee/trucount.entriprises", "_blank")}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 font-semibold transition-all duration-300"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Join Mailing List
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">24/7</div>
                      <div className="text-sm text-gray-400">AI Availability</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">&lt;1s</div>
                      <div className="text-sm text-gray-400">Response Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">50+</div>
                      <div className="text-sm text-gray-400">AI Models</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">Free</div>
                      <div className="text-sm text-gray-400">To Use</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
