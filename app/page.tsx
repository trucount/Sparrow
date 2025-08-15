"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { PinAuthScreen } from "@/components/pin-auth-screen"
import { MainInterface } from "@/components/main-interface"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 2 second loading screen as requested
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <PinAuthScreen onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return <MainInterface />
}
