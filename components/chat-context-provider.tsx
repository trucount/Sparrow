"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ChatContextData {
  currentSessionId: string | null
  sessionHistory: Record<string, any>
  updateSessionContext: (sessionId: string, context: any) => void
  getSessionContext: (sessionId: string) => any
}

const ChatContext = createContext<ChatContextData | null>(null)

export function ChatContextProvider({ children }: { children: React.ReactNode }) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessionHistory, setSessionHistory] = useState<Record<string, any>>({})

  useEffect(() => {
    // Load session history from localStorage
    const saved = localStorage.getItem("sparrow_session_context")
    if (saved) {
      try {
        setSessionHistory(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load session context:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Save session history to localStorage
    if (Object.keys(sessionHistory).length > 0) {
      localStorage.setItem("sparrow_session_context", JSON.stringify(sessionHistory))
    }
  }, [sessionHistory])

  const updateSessionContext = (sessionId: string, context: any) => {
    setSessionHistory(prev => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        ...context,
        lastUpdated: new Date().toISOString()
      }
    }))
  }

  const getSessionContext = (sessionId: string) => {
    return sessionHistory[sessionId] || {}
  }

  return (
    <ChatContext.Provider value={{
      currentSessionId,
      sessionHistory,
      updateSessionContext,
      getSessionContext
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within ChatContextProvider")
  }
  return context
}