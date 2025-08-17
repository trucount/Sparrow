"use client"
import { motion } from "framer-motion"
import { ChatSidebar } from "./chat-sidebar"
import { WorkspaceArea } from "./workspace-area"
import { SparrowLogo } from "./sparrow-logo"

export function MainInterface() {
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
