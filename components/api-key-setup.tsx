"use client"

import { useState } from "react"
import { SparrowLogo } from "./sparrow-logo"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface ApiKeySetupProps {
  onSubmit: () => void
}

export function ApiKeySetup({ onSubmit }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState("")

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your OpenRouter API key")
      return
    }

    if (!apiKey.startsWith("sk-or-v1-")) {
      setError("Invalid API key format. OpenRouter keys start with 'sk-or-v1-'")
      return
    }

    setIsValidating(true)
    setError("")

    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        localStorage.setItem("sparrow_openrouter_key", apiKey)
        onSubmit()
      } else {
        setError("Invalid API key. Please check your key and try again.")
      }
    } catch (err) {
      setError("Failed to validate API key. Please check your internet connection.")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <SparrowLogo className="w-16 h-16 mx-auto" />
          <h1 className="text-3xl font-bold">Setup Your API Key</h1>
          <p className="text-gray-400">Enter your OpenRouter API key to start using Sparrow AI</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm">How to get your OpenRouter API Key:</h3>
          <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
            <li>
              Visit{" "}
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                openrouter.ai
              </a>
            </li>
            <li>Sign up or log in to your account</li>
            <li>Go to the API Keys section</li>
            <li>Create a new API key</li>
            <li>Copy and paste it below</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenRouter API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              onKeyDown={(e) => e.key === "Enter" && validateAndSaveApiKey()}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            onClick={validateAndSaveApiKey}
            disabled={isValidating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700"
          >
            {isValidating ? "Validating..." : "Save and Continue"}
          </Button>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>🔒 Your API key is stored locally in your browser only.</p>
          <p>We never send or store your key on our servers.</p>
        </div>
      </div>
    </div>
  )
}
