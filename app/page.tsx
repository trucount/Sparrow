"use client"

import dynamic from "next/dynamic"

const NavigationWrapper = dynamic(
  () => import("@/components/navigation-wrapper").then((mod) => ({ default: mod.NavigationWrapper })),
  { ssr: false },
)
export default function Home() {
  return <NavigationWrapper />
}
