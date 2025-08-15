"use client"

import { useState, useEffect } from "react"
import { SparrowLogo } from "./sparrow-logo"

interface PinAuthScreenProps {
  onAuthenticated: () => void
}

export function PinAuthScreen({ onAuthenticated }: PinAuthScreenProps) {
  const [pin, setPin] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockdownTime, setLockdownTime] = useState(0)
  const [error, setError] = useState("")

  const correctPin = "8520"
  const maxAttempts = 3
  const lockdownDuration = 10 * 60 // 10 minutes

  useEffect(() => {
    if (lockdownTime > 0) {
      const timer = setInterval(() => {
        setLockdownTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false)
            setAttempts(0)
            setError("")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [lockdownTime])

  const checkPin = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      onAuthenticated()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setPin("")
      if (newAttempts >= maxAttempts) {
        setIsLocked(true)
        setLockdownTime(lockdownDuration)
        setError("Too many failed attempts. Locked for 10 minutes.")
      } else {
        setError(`Incorrect PIN. ${maxAttempts - newAttempts} attempts remaining.`)
      }
    }
  }

  const handleKeyPress = (key: string) => {
    if (isLocked) return

    if (key === "clear") {
      setPin("")
      setError("")
    } else if (key === "backspace") {
      setPin((prev) => prev.slice(0, -1))
      setError("")
    } else if (pin.length < 4) {
      const newPin = pin + key
      setPin(newPin)
      if (newPin.length === 4) {
        setTimeout(() => checkPin(newPin), 150) // Slight delay for UI update
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const keypadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["clear", "0", "backspace"],
  ]

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Logo only */}
      <div className="mb-6">
        <SparrowLogo className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>

      {/* PIN Dots */}
      <div className="flex justify-center space-x-4 mb-6">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
              index < pin.length ? "bg-white border-white" : "border-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Error */}
      {error && <div className="text-center text-red-400 text-sm px-4 mb-4">{error}</div>}

      {/* Lockdown Timer */}
      {isLocked && (
        <div className="text-center text-yellow-400 font-semibold mb-4">
          Locked: {formatTime(lockdownTime)}
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs mx-auto flex-grow">
        {keypadButtons.flat().map((key, i) => (
          <button
            key={i}
            onClick={() => handleKeyPress(key)}
            disabled={isLocked}
            className={`
              aspect-square w-full rounded-xl font-semibold text-lg sm:text-xl md:text-2xl transition-all duration-200
              ${
                isLocked
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white active:scale-95"
              }
              ${key === "clear" ? "text-red-400 text-sm sm:text-base md:text-lg" : ""}
              ${key === "backspace" ? "text-yellow-400" : ""}
            `}
          >
            {key === "clear" ? "Clear" : key === "backspace" ? "⌫" : key}
          </button>
        ))}
      </div>

      {/* Attempts */}
      {!isLocked && attempts > 0 && (
        <div className="text-center text-gray-400 text-sm mt-4">
          Failed attempts: {attempts}/{maxAttempts}
        </div>
      )}
    </div>
  )
}
