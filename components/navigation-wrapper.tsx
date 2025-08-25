"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./navigation"
import { HomePage } from "./pages/home-page"
import { AboutPage } from "./pages/about-page"
import { ContactPage } from "./pages/contact-page"
import { SettingsPage } from "./pages/settings-page"
import { LoadingScreen } from "./loading-screen"
import { TermsAndConditions } from "./terms-and-conditions"
import { ApiKeySetup } from "./api-key-setup"
import { MainInterface } from "./main-interface"
import { SparrowServices } from "./sparrow-services"

export function NavigationWrapper() {
  const [currentPage, setCurrentPage] = useState("home")
  const [showTerms, setShowTerms] = useState(false)
  const [showApiKeySetup, setShowApiKeySetup] = useState(false)
  const [showMainApp, setShowMainApp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleEnterApp = () => {
    setIsLoading(true)
    setTimeout(() => {
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
  }

  const handleTermsAccepted = () => {
    setShowTerms(false)
    setShowApiKeySetup(true)
  }

  const handleApiKeySubmitted = () => {
    setShowApiKeySetup(false)
    // no longer control SparrowServices with showServices
    setShowMainApp(true)
  }

  const handleServiceSelected = (serviceId: string) => {
    if (serviceId === "website-builder") {
      setShowMainApp(true)
    }
    // Add other service handlers here when they become available
  }

  if (!isMounted) {
    return <div style={{ height: "100vh", backgroundColor: "#000" }} />
  }

  if (isLoading) {
    return (
      <>
        <LoadingScreen />
        <SparrowServices onServiceSelect={handleServiceSelected} />
      </>
    )
  }

  if (showTerms) {
    return (
      <>
        <TermsAndConditions onAccept={handleTermsAccepted} />
        <SparrowServices onServiceSelect={handleServiceSelected} />
      </>
    )
  }

  if (showApiKeySetup) {
    return (
      <>
        <ApiKeySetup onSubmit={handleApiKeySubmitted} />
        <SparrowServices onServiceSelect={handleServiceSelected} />
      </>
    )
  }

  if (showMainApp) {
    return (
      <>
        <MainInterface />
        <SparrowServices onServiceSelect={handleServiceSelected} />
      </>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onEnterApp={handleEnterApp} />
      case "about":
        return <AboutPage />
      case "contact":
        return <ContactPage />
      case "settings":
        return <SettingsPage onEnterApp={handleEnterApp} />
      default:
        return <HomePage onEnterApp={handleEnterApp} />
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onEnterApp={handleEnterApp}
      />
      {renderCurrentPage()}
      <SparrowServices onServiceSelect={handleServiceSelected} />
    </div>
  )
}
