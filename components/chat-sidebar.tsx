"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Plus, MessageSquare, Sparkles, Loader2, X, ImageIcon } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface CodeBlock {
  language: string
  filename: string
  content: string
}

export function ChatSidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>("qwen/qwen3-coder:free")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageAnalysis, setImageAnalysis] = useState<string>("")
  const [canSend, setCanSend] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const availableModels = [
    { id: "qwen/qwen3-coder:free", name: "Qwen3 Coder (Free)" },
    { id: "agentica-org/deepcoder-14b-preview:free", name: "Agentica Deepcoder 14B (Free)" },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [sessions])

  const parseFileStructure = (content: string): string[] => {
    const files: string[] = []

    // Look for file structure section
    const structureRegex = /##?\s*File\s*Structure[\s\S]*?(?=##|$)/i
    const structureMatch = content.match(structureRegex)

    if (structureMatch) {
      const structureSection = structureMatch[0]
      console.log("[v0] Found file structure section:", structureSection)

      // Extract filenames from the structure section
      const fileRegex = /[-*]\s*([a-zA-Z0-9._-]+\.(html|css|js|javascript|json|txt))/gi
      let match

      while ((match = fileRegex.exec(structureSection)) !== null) {
        const filename = match[1]
        if (!files.includes(filename)) {
          files.push(filename)
        }
      }
    }

    // Fallback: look for code blocks with filenames
    if (files.length === 0) {
      const codeBlockRegex = /```\w+\s*(?:file[=:]?\s*["']?([^"'\n]+)["']?)?\s*\n/g
      let match

      while ((match = codeBlockRegex.exec(content)) !== null) {
        if (match[1]) {
          const filename = match[1].replace(/^["']|["']$/g, "")
          if (!files.includes(filename)) {
            files.push(filename)
          }
        }
      }
    }

    // Ensure we always have the basic files
    const defaultFiles = ["index.html", "styles.css", "script.js"]
    defaultFiles.forEach((file) => {
      if (!files.includes(file)) {
        files.push(file)
      }
    })

    console.log("[v0] Parsed file structure:", files)
    return files
  }

  const extractCodeContent = (content: string) => {
    // Parse individual code blocks with their specific filenames
    const codeBlocks: Array<{ filename: string; content: string; language: string }> = []
    
    // Enhanced regex to capture filename from code blocks
    const codeBlockRegex = /```(\w+)?\s*(?:file[=:]?\s*["']?([^"'\n]+)["']?)?\s*\n([\s\S]*?)```/g
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || "text"
      let filename = match[2]
      const code = match[3].trim()

      // If no filename specified, try to infer from language and content
      if (!filename) {
        if (language === "html" || code.includes("<!DOCTYPE") || code.includes("<html")) {
          filename = "index.html"
        } else if (language === "css") {
          filename = "styles.css"
        } else if (language === "javascript" || language === "js") {
          filename = "script.js"
        } else {
          filename = `untitled.${getFileExtension(language)}`
        }
      }

      // Clean up filename
      filename = filename.replace(/^["']|["']$/g, "")

      if (code && filename) {
        codeBlocks.push({
          filename,
          content: code,
          language
        })
      }
    }

    return codeBlocks
  }

  const removeCodeBlocks = (content: string): string => {
    // Remove all code blocks from the content
    return content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/##?\s*File\s*Structure[\s\S]*?(?=##|$)/i, "") // Remove file structure section
      .replace(/##?\s*Code\s*Files[\s\S]*?(?=##|$)/i, "") // Remove code files section
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Clean up extra newlines
      .trim()
  }

  const triggerFileStructureCreation = (files: string[]) => {
    console.log("[v0] Creating files from structure:", files)

    const event = new CustomEvent("createProjectFiles", {
      detail: { files },
    })
    window.dispatchEvent(event)
  }

  const triggerCodeContentUpdate = (htmlContent: string, cssContent: string, jsContent: string) => {
    // This function is now deprecated - we use triggerSpecificFileUpdate instead
  }

  const parseCodeBlocks = (content: string): CodeBlock[] => {
    const codeBlocks: CodeBlock[] = []
    const codeBlockRegex = /```(\w+)?\s*(?:file[=:]?\s*["']?([^"'\n]+)["']?)?\s*\n([\s\S]*?)```/g
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || "text"
      let filename = match[2] || `untitled.${getFileExtension(language)}`
      const code = match[3].trim()

      // Clean up filename
      filename = filename.replace(/^["']|["']$/g, "")

      if (code) {
        codeBlocks.push({
          language,
          filename,
          content: code,
        })
      }
    }

    return codeBlocks
  }

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      html: "html",
      css: "css",
      javascript: "js",
      js: "js",
      typescript: "ts",
      ts: "ts",
      jsx: "jsx",
      tsx: "tsx",
      json: "json",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
    }
    return extensions[language.toLowerCase()] || "txt"
  }

  const triggerCodeGeneration = (codeBlocks: CodeBlock[]) => {
    codeBlocks.forEach((block) => {
      const event = new CustomEvent("codeGenerated", {
        detail: {
          code: block.content,
          language: block.language,
          filename: block.filename,
        },
      })
      window.dispatchEvent(event)
    })
  }

  const triggerSpecificFileUpdate = (codeBlocks: Array<{ filename: string; content: string; language: string }>) => {
    codeBlocks.forEach((block) => {
      console.log(`[v0] Updating specific file: ${block.filename}`)
      const event = new CustomEvent("updateSpecificFile", {
        detail: {
          filename: block.filename,
          content: block.content,
          language: block.language,
        },
      })
      window.dispatchEvent(event)
    })
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSession(newSession.id)

    window.dispatchEvent(
      new CustomEvent("resetCloudConnection", {
        detail: {
          sessionId: newSession.id,
        },
      }),
    )

    window.dispatchEvent(
      new CustomEvent("createNewProject", {
        detail: {
          sessionId: newSession.id,
          projectName: `Project ${newSession.id.slice(-4)}`,
        },
      }),
    )
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageAnalysis(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImageAnalysis("")
    setCanSend(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const processImageWithVision = async (file: File) => {
    setCanSend(false)

    try {
      const imageBase64 = await convertImageToBase64(file)
      const apiKey = localStorage.getItem("sparrow_openrouter_key")

      if (!apiKey) {
        throw new Error("No API key found. Please refresh the page to set up your API key.")
      }

      console.log("[v0] Processing image with vision API")

      const visionResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Sparrow AI",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-vl-72b-instruct:free",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "What is in this image? Describe it in detail.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      })

      if (!visionResponse.ok) {
        const errorText = await visionResponse.text()
        console.error("[v0] Vision API error:", errorText)
        throw new Error(`Vision API error: ${visionResponse.status}`)
      }

      const visionData = await visionResponse.json()
      const imageDescription = visionData.choices?.[0]?.message?.content || "Could not analyze image"

      console.log("[v0] Image analysis received:", imageDescription)
      setImageAnalysis(imageDescription)
      setCanSend(true)
    } catch (error) {
      console.error("[v0] Error processing image:", error)
      setImageAnalysis("Image attached but could not be analyzed")
      setCanSend(true)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImageAnalysis("")
      processImageWithVision(file)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return
    if (!canSend) return

    let sessionId = currentSession
    if (!sessionId) {
      createNewSession()
      sessionId = Date.now().toString()
    }

    let finalContent = input.trim()

    // Add image analysis if available
    if (selectedImage && imageAnalysis) {
      finalContent = `${input.trim()}\n\n[Image Analysis]: ${imageAnalysis}`
    } else if (selectedImage) {
      finalContent = `${input.trim()}\n\n[Image attached but could not be analyzed]`
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: finalContent,
      role: "user",
      timestamp: new Date(),
    }

    // Clear input and image after sending
    setInput("")
    setSelectedImage(null)
    setImageAnalysis("")
    setCanSend(true)

    // Add user message to chat
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, messages: [...session.messages, userMessage] } : session,
      ),
    )

    // Wait 3 seconds then send to AI
    setTimeout(async () => {
      setIsLoading(true)

      try {
        const apiKey = localStorage.getItem("sparrow_openrouter_key")

        if (!apiKey) {
          throw new Error("No API key found. Please refresh the page to set up your API key.")
        }

        const systemPrompt = `You are Sparrow, an AI coding assistant specialized in web development. You help users create complete web applications with HTML, CSS, and JavaScript.

CRITICAL REQUIREMENTS - ALWAYS FOLLOW THIS EXACT FORMAT:

1. FIRST: Provide a file structure section listing ALL files
2. THEN: Provide complete code for each file with SPECIFIC FILENAMES

FORMAT TEMPLATE:
## File Structure
- index.html (Main HTML file)
- styles.css (CSS styling)  
- script.js (JavaScript functionality)

## Code Files

\`\`\`html file="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your App Title</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Complete HTML structure -->
    <script src="script.js"></script>
</body>
</html>
\`\`\`

\`\`\`css file="styles.css"
/* Complete CSS styles - make it visually appealing */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}
/* Include all necessary styles */
\`\`\`

\`\`\`javascript file="script.js"
// Complete JavaScript functionality
console.log('App loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready!');
    
    // Add interactive features
    console.log('App is ready for interaction!');
});

// Include all necessary JavaScript
\`\`\`

MANDATORY RULES:
- ALWAYS start with "## File Structure" section listing all files
- ALWAYS include file="filename.ext" in each code block
- Each code block should contain content ONLY for that specific file
- Make CSS visually modern and appealing with gradients and animations
- Add meaningful JavaScript interactivity and console logs
- Provide complete, working code that can be previewed immediately
- Use modern web development practices
- If creating multiple HTML files, name them descriptively (e.g., about.html, contact.html)

CRITICAL: Each code block must specify its target file using file="filename.ext" syntax.

The system will create files from your structure, then populate each file with its specific content based on the filename in the code block.`

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "Sparrow AI",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: finalContent,
              },
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("OpenRouter API error:", errorText)
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        const assistantContent = data.choices?.[0]?.message?.content || "No response received"

        console.log("[v0] Full AI response:", assistantContent)

        // Parse file structure first
        const files = parseFileStructure(assistantContent)
        if (files.length > 0) {
          console.log("[v0] Creating file structure:", files)
          triggerFileStructureCreation(files)

          // Wait a bit for files to be created, then update content
          setTimeout(() => {
            // Extract code blocks with specific filenames
            const codeBlocks = extractCodeContent(assistantContent)
            
            console.log("[v0] Code extraction results:", codeBlocks.map(block => `${block.filename} (${block.language})`))
            
            if (codeBlocks.length > 0) {
              triggerSpecificFileUpdate(codeBlocks)
            } else {
              // Fallback: create default files if no specific code blocks found
              const defaultBlocks = [
                {
                  filename: "index.html",
                  content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sparrow AI Generated App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>🐦 Welcome to Your Sparrow AI App</h1>
        <p>This is a complete web application generated by Sparrow AI</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
                  language: "html"
                },
                {
                  filename: "styles.css",
                  content: `/* Sparrow AI Generated Styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
}`,
                  language: "css"
                },
                {
                  filename: "script.js",
                  content: `// Sparrow AI Generated JavaScript
console.log('🐦 Sparrow AI app loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready!');
});`,
                  language: "javascript"
                }
              ]
              triggerSpecificFileUpdate(defaultBlocks)
            }
          }, 500)
        }

        const cleanContent = removeCodeBlocks(assistantContent)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            cleanContent ||
            "Complete web application has been generated with HTML, CSS, and JavaScript! Check the Code tab to see all files and the Preview tab to see your app in action.",
          timestamp: new Date(),
        }

        setSessions((prev) =>
          prev.map((session) =>
            session.id === sessionId ? { ...session, messages: [...session.messages, assistantMessage] } : session,
          ),
        )

        const codeBlocks = parseCodeBlocks(assistantContent)
        if (codeBlocks.length > 0) {
          console.log(
            `Found ${codeBlocks.length} additional code blocks:`,
            codeBlocks.map((b) => b.filename),
          )
          codeBlocks.forEach((block, index) => {
            setTimeout(() => {
              triggerCodeGeneration([block])
            }, index * 100)
          })
        }
      } catch (error) {
        console.error("Error calling OpenRouter:", error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
          timestamp: new Date(),
        }

        setSessions((prev) =>
          prev.map((session) =>
            session.id === currentSession ? { ...session, messages: [...session.messages, errorMessage] } : session,
          ),
        )
      } finally {
        setIsLoading(false)
      }
    }, 3000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentSessionData = sessions.find((s) => s.id === currentSession)

  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="p-4 border-b border-gray-800 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={createNewSession}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white border-gray-600 transition-all-smooth hover-lift glow-white"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
          <Sparkles className="w-3 h-3 ml-2 opacity-60" />
        </Button>

        <div className="mt-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white text-xs p-2 rounded-lg focus:border-gray-600 focus:outline-none"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 space-y-2 max-h-32 overflow-y-auto smooth-scroll">
          <AnimatePresence>
            {sessions.map((session, index) => (
              <motion.button
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setCurrentSession(session.id)}
                className={`w-full text-left p-3 rounded-lg text-sm truncate transition-all-smooth hover-lift ${
                  currentSession === session.id
                    ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white glow-white"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                <MessageSquare className="w-3 h-3 inline mr-2" />
                {session.title}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 smooth-scroll min-h-0">
        <AnimatePresence>
          {currentSessionData?.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-[80%] p-4 rounded-xl transition-all-smooth ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-white to-gray-100 text-black glow-white"
                    : "bg-gradient-to-br from-gray-800 to-gray-700 text-white border border-gray-600"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-60 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-current rounded-full mr-2" />
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white p-4 rounded-xl border border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                  />
                </div>
                <span className="text-xs text-gray-400">Sparrow is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        className="p-4 border-t border-gray-800 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm flex-shrink-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {selectedImage && (
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{selectedImage.name}</span>
              </div>
              <Button onClick={removeImage} variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </Button>
            </div>
            {imageAnalysis && (
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">✓ Image analyzed successfully</div>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Sparrow to create a website, component, or help with code..."
            className="flex-1 bg-gray-900/80 border-gray-700 text-white placeholder-gray-400 resize-none transition-all-smooth focus:glow-white backdrop-blur-sm"
            rows={2}
          />
          <div className="flex space-x-3">
            <Button
              onClick={sendMessage}
              disabled={!canSend}
              className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white border-gray-600 transition-all-smooth hover-lift glow-white px-4 py-2 rounded-lg"
            >
              <Send className="w-4 h-4" />
            </Button>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isLoading}
              />
              <Button
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={isLoading}
                className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white border-gray-600 transition-all-smooth hover-lift glow-white px-4 py-2 rounded-lg w-full"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}