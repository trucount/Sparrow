"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Key, User, Bell } from "lucide-react"

interface SettingsPageProps {
  onEnterApp: () => void
}

export function SettingsPage({ onEnterApp }: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Settings className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-xl text-gray-400">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-5 h-5 text-blue-400" />
              <h2 className="text-2xl font-semibold">Profile</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Display Name</label>
                <Input
                  placeholder="Enter your name"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-5 h-5 text-blue-400" />
              <h2 className="text-2xl font-semibold">API Keys</h2>
            </div>

            <p className="text-gray-400 mb-4">
              Manage your API keys for AI services
            </p>
            <Button
              onClick={onEnterApp}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Configure API Keys
            </Button>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="text-2xl font-semibold">Notifications</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-gray-300">Email notifications</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-gray-300">Project updates</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-300">Marketing emails</span>
              </label>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
