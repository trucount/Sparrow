"use client"

import { motion } from "framer-motion"
import { Mail, MessageSquare, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-400">
            We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-400">support@sparrowai.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MessageSquare className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Community</h3>
                  <p className="text-gray-400">Join our Discord community</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Github className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">GitHub</h3>
                  <p className="text-gray-400">Contribute to our open source projects</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

            <form className="space-y-4">
              <Input
                placeholder="Your Name"
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Input
                type="email"
                placeholder="Your Email"
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Textarea
                placeholder="Your Message"
                rows={6}
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
