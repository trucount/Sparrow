"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SparrowLogo } from "../sparrow-logo"
import { Mail, Send, MessageSquare, Heart, ExternalLink } from "lucide-react"
import { useState } from "react"

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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
            Have questions, feedback, or want to collaborate? We'd love to hear from you!
          </motion.p>
        </motion.section>

       

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="space-y-8"
            >
              {/* Email Contact */}
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-xl">
                    <Mail className="w-5 h-5 mr-3 text-green-400" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      For business inquiries, partnerships, or general questions:
                    </p>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-mono text-lg">trucount.enterprises@gmail.com</span>
                        <Button
                          onClick={() => window.open("mailto:trucount.enterprises@gmail.com", "_blank")}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      Join our mailing list for exclusive updates and early access to new features.
                    </p>
                    <Button
                      onClick={() => window.open("mailto:trucount.enterprises@gmail.com?subject=Join Sparrow AI Mailing List&body=Hi! I'd like to join the Sparrow AI mailing list to receive updates and insights.", "_blank")}
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