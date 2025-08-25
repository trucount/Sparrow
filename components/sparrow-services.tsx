"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SparrowLogo } from "./sparrow-logo"
import { 
  Search, 
  Globe, 
  Code, 
  Smartphone, 
  Database, 
  Palette, 
  Bot, 
  Zap, 
  ArrowRight,
  Star,
  Clock,
  Users,
  Sparkles
} from "lucide-react"

interface SparrowServicesProps {
  onServiceSelect: (serviceId: string) => void
}

export function SparrowServices({ onServiceSelect }: SparrowServicesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Services", icon: Sparkles },
    { id: "web", label: "Web Development", icon: Globe },
    { id: "mobile", label: "Mobile Apps", icon: Smartphone },
    { id: "ai", label: "AI Tools", icon: Bot },
    { id: "design", label: "Design", icon: Palette },
  ]

  const services = [
    {
      id: "html-website-coder",
      title: "HTML Website Coder",
      description: "Create complete websites with AI-powered code generation. Build responsive, modern web applications using HTML, CSS, and JavaScript with 50+ free AI models.",
      category: "web",
      status: "available",
      icon: Globe,
      features: ["HTML/CSS/JS Generation", "Live Preview", "50+ Free AI Models", "Export & Deploy", "Real-time Editing"],
      color: "from-blue-500 to-cyan-500",
      popularity: 5,
    },
  ]

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory ||
                           (selectedCategory === "web" && service.category === "web")
    return matchesSearch && matchesCategory
  })

  const availableServices = filteredServices.filter(s => s.status === "available")

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
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
              duration: Math.random() * 30 + 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-b border-gray-800 bg-black/80 backdrop-blur-lg"
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <SparrowLogo size={48} />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Sparrow Services
                  </h1>
                  <p className="text-gray-400">Choose your AI-powered development tool</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>1,000+ developers</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full mx-2" />
                <Star className="w-4 h-4 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
          {/* Search and Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              What would you like to build today?
            </h2>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services, tools, or features..."
                  className="pl-12 pr-4 py-4 text-lg bg-gray-900/80 border-gray-700 text-white placeholder-gray-400 rounded-xl backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-white text-black shadow-lg"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{category.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Available Services */}
          {availableServices.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-16"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <h3 className="text-2xl font-bold text-white">Available Services</h3>
                <Badge className="bg-green-600 text-white">
                  {availableServices.length} Ready
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableServices.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group cursor-pointer"
                      onClick={() => onServiceSelect(service.id)}
                    >
                      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700 h-full transition-all duration-300 hover:border-gray-500 hover:bg-gray-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-full h-full text-white" />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-600 text-white">Available</Badge>
                              <div className="flex items-center space-x-1">
                                {[...Array(service.popularity)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <CardTitle className="text-white group-hover:text-blue-300 transition-colors duration-300">
                            {service.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            {service.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {service.features.map((feature) => (
                                <Badge
                                  key={feature}
                                  variant="outline"
                                  className="border-gray-600 text-gray-300 bg-gray-800/50"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                              Launch HTML Website Coder
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          )}


          {/* No Results */}
          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-white mb-2">No services found</h3>
              <p className="text-gray-400">Try adjusting your search or category filter</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="border-t border-gray-800 bg-black/80 backdrop-blur-lg"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>{availableServices.length} Service Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Powered by 50+ AI Models</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Built by Satvik Singh</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                © 2025 Sparrow AI - Built by Satvik Singh with ❤️
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}