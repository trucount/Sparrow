"use client"

import { useState } from "react"
import { SparrowLogo } from "./sparrow-logo"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface PantrySetupProps {
  onSubmit: () => void
  onSkip: () => void
}

export function PantrySetup({ onSubmit, onSkip }: PantrySetupProps) {
  const [pantryUrl, setPantryUrl] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")

  const validatePantryUrl = (url: string) => {
    const pantryPattern = /^https:\/\/getpantry\.cloud\/apiv1\/pantry\/[a-f0-9-]+\/basket\/[a-zA-Z0-9]+$/
    return pantryPattern.test(url)
  }

  const validateAndSavePantryUrl = async () => {
    if (!pantryUrl.trim()) {
      setError("Please enter your Pantry URL")
      return
    }

    if (!validatePantryUrl(pantryUrl)) {
      setError(
        "Invalid Pantry URL format. Should be: https://getpantry.cloud/apiv1/pantry/YOUR_PANTRY_ID/basket/YOUR_BASKET_NAME",
      )
      return
    }

    setIsValidating(true)
    setError("")

    try {
      // Test the Pantry URL by making a simple GET request
      const response = await fetch(pantryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Pantry returns 404 for empty baskets, which is normal
      if (response.ok || response.status === 404) {
        localStorage.setItem("sparrow_pantry_url", pantryUrl)
        onSubmit()
      } else {
        setError("Unable to connect to Pantry. Please check your URL and try again.")
      }
    } catch (err) {
      setError("Failed to validate Pantry URL. Please check your internet connection.")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <SparrowLogo className="w-16 h-16 mx-auto" />
          <h1 className="text-3xl font-bold">Setup Cloud Storage</h1>
          <p className="text-gray-400">Connect your Pantry storage to save and deploy projects</p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Pantry Cloud Storage</CardTitle>
            <CardDescription className="text-gray-400">
              Connect your Pantry storage for automatic project backup and deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm">How to get your Pantry URL:</h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>
                  Visit{" "}
                  <a
                    href="https://getpantry.cloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    getpantry.cloud
                  </a>
                </li>
                <li>Create a new pantry (free account)</li>
                <li>Create a basket for your projects</li>
                <li>Copy the full basket URL</li>
                <li>Paste it below</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pantryUrl">Pantry Basket URL</Label>
              <Input
                id="pantryUrl"
                type="url"
                placeholder="https://getpantry.cloud/apiv1/pantry/YOUR_ID/basket/YOUR_BASKET"
                value={pantryUrl}
                onChange={(e) => {
                  setPantryUrl(e.target.value)
                  setError("")
                }}
                className="bg-gray-800 border-gray-600 text-white"
                onKeyDown={(e) => e.key === "Enter" && validateAndSavePantryUrl()}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={validateAndSavePantryUrl}
            disabled={isValidating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
          >
            {isValidating ? "Connecting..." : "Connect Storage"}
          </Button>

          <Button
            onClick={onSkip}
            disabled={isValidating}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            Skip for Now
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>🔒 Your Pantry URL is stored locally in your browser only.</p>
          <p>You can add cloud storage later from the project settings.</p>
        </div>
      </div>
    </div>
  )
}
