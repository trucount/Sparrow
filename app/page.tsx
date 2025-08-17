"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const LoadingScreen = dynamic(
  () => import("@/components/loading-screen").then((mod) => ({ default: mod.LoadingScreen })),
  { ssr: false },
)
const MainInterface = dynamic(
  () => import("@/components/main-interface").then((mod) => ({ default: mod.MainInterface })),
  { ssr: false },
)
const ApiKeySetup = dynamic(() => import("@/components/api-key-setup").then((mod) => ({ default: mod.ApiKeySetup })), {
  ssr: false,
})
const TermsAndConditions = dynamic(
  () => import("@/components/terms-and-conditions").then((mod) => ({ default: mod.TermsAndConditions })),
  { ssr: false },
)

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [showTerms, setShowTerms] = useState(false)
  const [showApiKeySetup, setShowApiKeySetup] = useState(false)
  const [showMainApp, setShowMainApp] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const handleTermsAccepted = () => {
    setShowTerms(false)
    setShowApiKeySetup(true)
  }

  const handleApiKeySubmitted = () => {
    setShowApiKeySetup(false)
    setShowMainApp(true)
  }

  useEffect(() => {
    setIsMounted(true)

    try {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get("code")
      const error = urlParams.get("error")

      if (code) {
        localStorage.setItem("netlify_oauth_code", code)
        window.history.replaceState({}, document.title, window.location.pathname)
        if (window.opener) {
          window.close()
          return
        }
      }

      if (error) {
        console.error("OAuth error:", error)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    } catch (err) {
      console.error("Error handling OAuth callback:", err)
    }

    const timer = setTimeout(() => {
      setIsLoading(false)

      try {
        const savedApiKey = localStorage.getItem("sparrow_openrouter_key")
        if (savedApiKey) {
          setShowMainApp(true)
        } else {
          setShowTerms(true)
        }
      } catch (err) {
        console.error("Error accessing localStorage:", err)
        setShowTerms(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return <div style={{ height: "100vh", backgroundColor: "#000" }} />
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (showTerms) {
    return <TermsAndConditions onAccept={handleTermsAccepted} />
  }

  if (showApiKeySetup) {
    return <ApiKeySetup onSubmit={handleApiKeySubmitted} />
  }

  return <MainInterface />
}
