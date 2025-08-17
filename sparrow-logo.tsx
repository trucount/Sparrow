"use client"

interface SparrowLogoProps {
  size?: number
  className?: string
}

export function SparrowLogo({ size = 40, className = "" }: SparrowLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nest base */}
      <ellipse cx="50" cy="75" rx="25" ry="8" fill="white" opacity="0.8" />

      {/* Nest structure */}
      <path
        d="M25 75 Q30 70 35 72 Q40 68 45 70 Q50 66 55 68 Q60 64 65 66 Q70 62 75 64"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />

      {/* Bird body */}
      <ellipse cx="45" cy="45" rx="12" ry="18" fill="white" transform="rotate(-15 45 45)" />

      {/* Bird head */}
      <circle cx="42" cy="28" r="8" fill="white" />

      {/* Bird beak */}
      <path d="M35 26 L28 24 L35 22 Z" fill="white" />

      {/* Bird eye */}
      <circle cx="40" cy="26" r="2" fill="black" />

      {/* Bird wing */}
      <ellipse cx="48" cy="40" rx="8" ry="12" fill="white" opacity="0.7" transform="rotate(-25 48 40)" />

      {/* Bird tail */}
      <ellipse cx="55" cy="50" rx="4" ry="10" fill="white" opacity="0.8" transform="rotate(30 55 50)" />
    </svg>
  )
}
