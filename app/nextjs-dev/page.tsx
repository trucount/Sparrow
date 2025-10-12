"use client"

import { MainInterface } from "@/components/main-interface"
import { ChatContextProvider } from "@/components/chat-context-provider"

export default function NextJSDevPage() {
  return (
    <ChatContextProvider>
      <MainInterface mode="nextjs" />
    </ChatContextProvider>
  )
}
