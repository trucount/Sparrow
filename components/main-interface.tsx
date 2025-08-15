"use client"
import { motion } from "framer-motion"
import type React from "react"

import { useState, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { WorkspaceArea } from "./workspace-area"
import { SparrowLogo } from "./sparrow-logo"

export function MainInterface() {
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0) // Percentage of screen height for workspace panel

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (panelHeight < 30) {
      setPanelHeight(0) // Snap to completely hidden
    } else {
      setPanelHeight(85) // Snap to almost full coverage
    }
  }

  const handleDrag = (event: any, info: any) => {
    const screenHeight = window.innerHeight
    const newHeight = Math.max(0, Math.min(90, ((screenHeight - info.point.y) / screenHeight) * 100))
    setPanelHeight(newHeight)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    const touch = e.touches[0]
    const startY = touch.clientY
    const startTime = Date.now()

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault() // Prevent scrolling
      const touch = e.touches[0]
      const deltaY = startY - touch.clientY
      const currentTime = Date.now()
      const velocity = Math.abs(deltaY) / (currentTime - startTime)

      if (velocity > 0.3) {
        if (deltaY > 50 && panelHeight < 20) {
          setPanelHeight(85)
        } else if (deltaY < -50 && panelHeight > 20) {
          setPanelHeight(0)
        }
      }
    }

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove, { passive: false })
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)
  }

  if (!isMobile) {
    return (
      <div className="h-screen bg-black text-white flex overflow-hidden">
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-80 border-r border-gray-800 flex flex-col h-full"
        >
          <div className="p-4 border-b border-gray-800 flex items-center space-x-3 bg-gradient-to-r from-gray-900 to-gray-800 glow-white flex-shrink-0">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <SparrowLogo size={32} />
            </motion.div>
            <motion.h1
              className="text-xl font-bold tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Sparrow
            </motion.h1>
          </div>

          <div className="flex-1 min-h-0">
            <ChatSidebar />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex-1 flex flex-col h-full relative"
        >
          <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
          <div className="relative z-10 h-full">
            <WorkspaceArea />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden" onTouchStart={handleTouchStart}>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 flex flex-col overflow-hidden"
        style={{ height: `${100 - panelHeight}vh` }}
      >
        {panelHeight < 80 && (
          <div className="p-4 border-b border-gray-800 flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-900 to-gray-800 glow-white flex-shrink-0">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <SparrowLogo size={28} />
            </motion.div>
            <motion.h1
              className="text-xl font-bold tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Sparrow
            </motion.h1>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatSidebar />
        </div>
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        className={`
          ${panelHeight === 0 ? "h-8 bg-gray-700" : "h-6 bg-gray-800"} 
          border-t border-gray-700 flex items-center justify-center cursor-grab active:cursor-grabbing
          ${isDragging ? "bg-gray-600" : "hover:bg-gray-600"}
          transition-all duration-300 relative
          ${panelHeight > 80 ? "absolute top-0 left-0 right-0 z-20" : ""}
        `}
        whileHover={{ backgroundColor: "rgb(55, 65, 81)" }}
        whileTap={{ backgroundColor: "rgb(75, 85, 99)" }}
      >
        <div
          className={`${panelHeight === 0 ? "w-16 h-1.5" : "w-12 h-1"} bg-gray-400 rounded-full transition-all duration-300`}
        />
      </motion.div>

      {panelHeight > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-black border-t border-gray-800 relative overflow-hidden"
          style={{ height: `${panelHeight}vh` }}
        >
          <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
          <div className="relative z-10 h-full overflow-hidden">
            <WorkspaceArea isMobile={isMobile} />
          </div>
        </motion.div>
      )}
    </div>
  )
}
