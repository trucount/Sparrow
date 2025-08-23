"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { SparrowLogo } from "../sparrow-logo"
import { Settings, Key, Cloud, Palette, Bell, Shield, Save, Trash2, Download, Upload } from "lucide-react"

interface SettingsPageProps {
  onEnterApp: () => void
}

export function SettingsPage({ onEnterApp }: SettingsPageProps) {
  const [apiKey, setApiKey] = useState("")
  const [pantryUrl, setPantryUrl] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [hasPantryUrl, setHasPantryUrl] = useState(false)

  useEffect(() => {
    // Load saved settings
    const savedApiKey = localStorage.getItem("sparrow_openrouter_key")
    const savedPantryUrl = localStorage.getItem("sparrow_pantry_url")
    const savedNotifications = localStorage.getItem("sparrow_notifications") !== "false"
    const savedAutoSave = localStorage.getItem("sparrow_auto_sync") === "true"

    if (savedApiKey) {
      setApiKey(savedApiKey)
      setHasApiKey(true)
    }
    if (savedPantryUrl) {
      setPantryUrl(savedPantryUrl)
      setHasPantryUrl(true)
    }
    setNotifications(savedNotifications)
    setAutoSave(savedAutoSave)
  }, [])

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("sparrow_openrouter_key", apiKey.trim())
      setHasApiKey(true)
    }
  }

  const savePantryUrl = () => {
    if (pantryUrl.trim()) {
      localStorage.setItem("sparrow_pantry_url", pantryUrl.trim())
      setHasPantryUrl(true)
    }
  }

  const clearApiKey = () => {
    localStorage.removeItem("sparrow_openrouter_key")
    setApiKey("")
    setHasApiKey(false)
  }

  const clearPantryUrl = () => {
    localStorage.removeItem("sparrow_pantry_url")
    setPantryUrl("")
    setHasPantryUrl(false)
  }

  const exportSettings = () => {
    const settings = {
      notifications,
      autoSave,
      darkMode,
      hasApiKey,
      hasPantryUrl,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sparrow-settings.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importSettings = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string)
            setNotifications(settings.notifications ?? true)
            setAutoSave(settings.autoSave ?? true)
            setDarkMode(settings.darkMode ?? true)
            
            // Save to localStorage
            localStorage.setItem("sparrow_notifications", settings.notifications.toString())
            localStorage.setItem("sparrow_auto_sync", settings.autoSave.toString())
          } catch (error) {
            console.error("Failed to import settings:", error)
            alert("Failed to import settings. Please check the file format.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl opacity-30 scale-150" />
              <SparrowLogo size={100} className="relative z-10" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
          >
            Settings
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Configure your Sparrow AI experience to match your preferences
          </motion.p>
        </motion.section>

        {/* Settings Content */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="space-y-8"
        >
          {/* API Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Key className="w-5 h-5 mr-3 text-blue-400" />
                  API Configuration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your OpenRouter API key to access AI models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">OpenRouter API Key</label>
                  <div className="flex space-x-2">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="bg-gray-800 border-gray-600 text-white flex-1"
                    />
                    <Button
                      onClick={saveApiKey}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    {hasApiKey && (
                      <Button
                        onClick={clearApiKey}
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {hasApiKey && (
                    <div className="text-green-400 text-sm mt-2">✓ API key configured</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cloud Storage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Cloud className="w-5 h-5 mr-3 text-green-400" />
                  Cloud Storage
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connect your Pantry storage for project backup and deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Pantry Basket URL</label>
                  <div className="flex space-x-2">
                    <Input
                      type="url"
                      value={pantryUrl}
                      onChange={(e) => setPantryUrl(e.target.value)}
                      placeholder="https://getpantry.cloud/apiv1/pantry/..."
                      className="bg-gray-800 border-gray-600 text-white flex-1"
                    />
                    <Button
                      onClick={savePantryUrl}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    {hasPantryUrl && (
                      <Button
                        onClick={clearPantryUrl}
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {hasPantryUrl && (
                    <div className="text-green-400 text-sm mt-2">✓ Cloud storage connected</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Palette className="w-5 h-5 mr-3 text-purple-400" />
                  Preferences
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize your Sparrow AI experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Enable Notifications</div>
                    <div className="text-gray-400 text-sm">Get notified about important updates</div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={(checked) => {
                      setNotifications(checked)
                      localStorage.setItem("sparrow_notifications", checked.toString())
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Auto-save Projects</div>
                    <div className="text-gray-400 text-sm">Automatically save changes to cloud storage</div>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={(checked) => {
                      setAutoSave(checked)
                      localStorage.setItem("sparrow_auto_sync", checked.toString())
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Dark Mode</div>
                    <div className="text-gray-400 text-sm">Use dark theme (recommended)</div>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-xl">
                  <Shield className="w-5 h-5 mr-3 text-red-400" />
                  Data Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your local data and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={exportSettings}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>
                  
                  <Button
                    onClick={importSettings}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
                        localStorage.clear()
                        window.location.reload()
                      }
                    }}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enter App */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border-blue-700">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Start Creating?</h3>
                    <p className="text-blue-200">
                      {hasApiKey 
                        ? "Your API key is configured. You're all set to use Sparrow AI!"
                        : "Configure your API key above to start using Sparrow AI"
                      }
                    </p>
                  </div>
                  
                  <Button
                    onClick={onEnterApp}
                    disabled={!hasApiKey}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Enter Sparrow AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}