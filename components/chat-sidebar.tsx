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
    { id: "openai/gpt-oss-20b:free", name: "OpenAI: GPT OSS 20B (Free)" },
    { id: "z-ai/glm-4.5-air:free", name: "Z.AI: GLM 4.5 Air (Free)" },
    { id: "qwen/qwen3-coder:free", name: "Qwen: Qwen3 Coder (Free)" },
    { id: "moonshotai/kimi-k2:free", name: "MoonshotAI: Kimi K2 (Free)" },
    { id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free", name: "Venice: Uncensored (Free)" },
    { id: "google/gemma-3n-e2b-it:free", name: "Google: Gemma 3n 2B (Free)" },
    { id: "tencent/hunyuan-a13b-instruct:free", name: "Tencent: Hunyuan A13B Instruct (Free)" },
    { id: "tngtech/deepseek-r1t2-chimera:free", name: "TNG: DeepSeek R1T2 Chimera (Free)" },
    { id: "mistralai/mistral-small-3.2-24b-instruct:free", name: "Mistral: Mistral Small 3.2 24B (Free)" },
    { id: "moonshotai/kimi-dev-72b:free", name: "MoonshotAI: Kimi Dev 72B (Free)" },
    { id: "deepseek/deepseek-r1-0528-qwen3-8b:free", name: "DeepSeek: Deepseek R1 0528 Qwen3 8B (Free)" },
    { id: "deepseek/deepseek-r1-0528:free", name: "DeepSeek: R1 0528 (Free)" },
    { id: "sarvamai/sarvam-m:free", name: "Sarvam AI: Sarvam-M (Free)" },
    { id: "mistralai/devstral-small-2505:free", name: "Mistral: Devstral Small 2505 (Free)" },
    { id: "google/gemma-3n-e4b-it:free", name: "Google: Gemma 3n 4B (Free)" },
    { id: "qwen/qwen3-4b:free", name: "Qwen: Qwen3 4B (Free)" },
    { id: "qwen/qwen3-30b-a3b:free", name: "Qwen: Qwen3 30B A3B (Free)" },
    { id: "qwen/qwen3-8b:free", name: "Qwen: Qwen3 8B (Free)" },
    { id: "qwen/qwen3-14b:free", name: "Qwen: Qwen3 14B (Free)" },
    { id: "qwen/qwen3-235b-a22b:free", name: "Qwen: Qwen3 235B A22B (Free)" },
    { id: "tngtech/deepseek-r1t-chimera:free", name: "TNG: DeepSeek R1T Chimera (Free)" },
    { id: "microsoft/mai-ds-r1:free", name: "Microsoft: MAI DS R1 (Free)" },
    { id: "shisa-ai/shisa-v2-llama3.3-70b:free", name: "Shisa AI: Shisa V2 Llama 3.3 70B (Free)" },
    { id: "arliai/qwq-32b-arliai-rpr-v1:free", name: "ArliAI: QwQ 32B RpR v1 (Free)" },
    { id: "agentica-org/deepcoder-14b-preview:free", name: "Agentica: Deepcoder 14B Preview (Free)" },
    { id: "moonshotai/kimi-vl-a3b-thinking:free", name: "MoonshotAI: Kimi VL A3B Thinking (Free)" },
    { id: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free", name: "NVIDIA: Llama 3.1 Nemotron Ultra 253B v1 (Free)" },
    { id: "google/gemini-2.5-pro-exp-03-25", name: "Google: Gemini 2.5 Pro Experimental" },
    { id: "qwen/qwen2.5-vl-32b-instruct:free", name: "Qwen: Qwen2.5 VL 32B Instruct (Free)" },
    { id: "deepseek/deepseek-chat-v3-0324:free", name: "DeepSeek: DeepSeek V3 0324 (Free)" },
    { id: "featherless/qwerky-72b:free", name: "Qrwkv 72B (Free)" },
    { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral: Mistral Small 3.1 24B (Free)" },
    { id: "google/gemma-3-4b-it:free", name: "Google: Gemma 3 4B (Free)" },
    { id: "google/gemma-3-12b-it:free", name: "Google: Gemma 3 12B (Free)" },
    { id: "rekaai/reka-flash-3:free", name: "Reka: Flash 3 (Free)" },
    { id: "google/gemma-3-27b-it:free", name: "Google: Gemma 3 27B (Free)" },
    { id: "qwen/qwq-32b:free", name: "Qwen: QwQ 32B (Free)" },
    { id: "nousresearch/deephermes-3-llama-3-8b-preview:free", name: "Nous: DeepHermes 3 Llama 3 8B Preview (Free)" },
    { id: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free", name: "Dolphin3.0 R1 Mistral 24B (Free)" },
    { id: "cognitivecomputations/dolphin3.0-mistral-24b:free", name: "Dolphin3.0 Mistral 24B (Free)" },
    { id: "qwen/qwen2.5-vl-72b-instruct:free", name: "Qwen: Qwen2.5 VL 72B Instruct (Free)" },
    { id: "mistralai/mistral-small-24b-instruct-2501:free", name: "Mistral: Mistral Small 3 (Free)" },
    { id: "deepseek/deepseek-r1-distill-qwen-14b:free", name: "DeepSeek: R1 Distill Qwen 14B (Free)" },
    { id: "deepseek/deepseek-r1-distill-llama-70b:free", name: "DeepSeek: R1 Distill Llama 70B (Free)" },
    { id: "deepseek/deepseek-r1:free", name: "DeepSeek: R1 (Free)" },
    { id: "google/gemini-2.0-flash-exp:free", name: "Google: Gemini 2.0 Flash Experimental (Free)" },
    { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Meta: Llama 3.3 70B Instruct (Free)" },
    { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen2.5 Coder 32B Instruct (Free)" },
    { id: "meta-llama/llama-3.2-11b-vision-instruct:free", name: "Meta: Llama 3.2 11B Vision Instruct (Free)" },
    { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Meta: Llama 3.2 3B Instruct (Free)" },
    { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen2.5 72B Instruct (Free)" },
    { id: "meta-llama/llama-3.1-405b-instruct:free", name: "Meta: Llama 3.1 405B Instruct (Free)" },
    { id: "mistralai/mistral-nemo:free", name: "Mistral: Mistral Nemo (Free)" },
    { id: "google/gemma-2-9b-it:free", name: "Google: Gemma 2 9B (Free)" },
    { id: "mistralai/mistral-7b-instruct:free", name: "Mistral: Mistral 7B Instruct (Free)" },
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
    let htmlContent = ""
    let cssContent = ""
    let jsContent = ""

    // Extract HTML content - look for both \`\`\`html and plain HTML blocks
    const htmlRegex = /```html[\s\S]*?\n([\s\S]*?)```/gi
    const htmlMatches = content.match(htmlRegex)
    if (htmlMatches) {
      htmlContent = htmlMatches
        .map((match) =>
          match
            .replace(/```html[\s\S]*?\n/, "")
            .replace(/```$/, "")
            .trim(),
        )
        .join("\n\n")
    }

    // Also look for DOCTYPE declarations (likely HTML)
    if (!htmlContent) {
      const doctypeRegex = /<!DOCTYPE[\s\S]*?<\/html>/gi
      const doctypeMatch = content.match(doctypeRegex)
      if (doctypeMatch) {
        htmlContent = doctypeMatch[0].trim()
      }
    }

    // Extract CSS content
    const cssRegex = /```css[\s\S]*?\n([\s\S]*?)```/gi
    const cssMatches = content.match(cssRegex)
    if (cssMatches) {
      cssContent = cssMatches
        .map((match) =>
          match
            .replace(/```css[\s\S]*?\n/, "")
            .replace(/```$/, "")
            .trim(),
        )
        .join("\n\n")
    }

    // Extract JavaScript content
    const jsRegex = /```(?:javascript|js)[\s\S]*?\n([\s\S]*?)```/gi
    const jsMatches = content.match(jsRegex)
    if (jsMatches) {
      jsContent = jsMatches
        .map((match) =>
          match
            .replace(/```(?:javascript|js)[\s\S]*?\n/, "")
            .replace(/```$/, "")
            .trim(),
        )
        .join("\n\n")
    }

    return { htmlContent, cssContent, jsContent }
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
    if (htmlContent || cssContent || jsContent) {
      console.log("[v0] Updating code content:", {
        html: htmlContent ? "Yes" : "No",
        css: cssContent ? "Yes" : "No",
        js: jsContent ? "Yes" : "No",
      })

      const event = new CustomEvent("codeContentUpdate", {
        detail: {
          htmlContent,
          cssContent,
          jsContent,
        },
      })
      window.dispatchEvent(event)
    }
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
      const makeAPICall = async (retryCount = 0): Promise<any> => {
        const maxRetries = 3
        const baseDelay = 1000 // 1 second

        try {
          const systemPrompt = `You are Sparrow, an AI coding assistant specialized in web development. You help users create complete web applications with HTML, CSS, and JavaScript.

CRITICAL REQUIREMENTS - ALWAYS FOLLOW THIS EXACT FORMAT:

1. FIRST: Provide a file structure section listing ALL files
2. THEN: Provide complete code for each file

FORMAT TEMPLATE:
## File Structure
- index.html (Main HTML file)
- styles.css (CSS styling)  
- script.js (JavaScript functionality)

## Code Files

\`\`\`html
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

\`\`\`css
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

\`\`\`javascript
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
- ALWAYS include all three files (HTML, CSS, JS) even for simple requests
- Make CSS visually modern and appealing with gradients and animations
- Add meaningful JavaScript interactivity and console logs
- Provide complete, working code that can be previewed immediately
- Never skip any of the three file types
- Use modern web development practices

The system will first create all files from your structure, then populate them with your code.`

          const apiKey = localStorage.getItem("sparrow_openrouter_key")
          if (!apiKey) {
            throw new Error("No API key found. Please refresh the page to set up your API key.")
          }

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
                  content: userMessage.content,
                },
              ],
            }),
          })

          if (response.status === 429) {
            if (retryCount < maxRetries) {
              const delay = baseDelay * Math.pow(2, retryCount)
              console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`)

              const rateLimitMessage: Message = {
                id: (Date.now() + Math.random()).toString(),
                role: "assistant",
                content: `Rate limit reached. Retrying in ${delay / 1000} seconds... (attempt ${retryCount + 1}/${maxRetries})`,
                timestamp: new Date(),
              }

              setSessions((prev) =>
                prev.map((session) =>
                  session.id === sessionId
                    ? { ...session, messages: [...session.messages, rateLimitMessage] }
                    : session,
                ),
              )

              await new Promise((resolve) => setTimeout(resolve, delay))
              return makeAPICall(retryCount + 1)
            } else {
              throw new Error("Rate limit exceeded. Please try again later.")
            }
          }

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          return await response.json()
        } catch (error) {
          if (retryCount < maxRetries && (error instanceof TypeError || error.message.includes("fetch"))) {
            const delay = baseDelay * Math.pow(2, retryCount)
            console.log(`Network error. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`)
            await new Promise((resolve) => setTimeout(resolve, delay))
            return makeAPICall(retryCount + 1)
          }
          throw error
        }
      }

      try {
        setIsLoading(true)
        const data = await makeAPICall()

        if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
          console.error("Invalid API response structure:", data)
          throw new Error("Invalid response from AI service")
        }

        const choice = data.choices[0]
        if (!choice || !choice.message || typeof choice.message.content !== "string") {
          console.error("Invalid message structure:", choice)
          throw new Error("Invalid message format from AI service")
        }

        const assistantContent = choice.message.content

        const fileStructure = parseFileStructure(assistantContent)
        if (fileStructure.length > 0) {
          triggerFileStructureCreation(fileStructure)

          // Small delay to ensure files are created before content update
          setTimeout(() => {
            const { htmlContent, cssContent, jsContent } = extractCodeContent(assistantContent)

            console.log("[v0] Code extraction results:", {
              html: htmlContent ? "Found" : "Missing",
              css: cssContent ? "Found" : "Missing",
              js: jsContent ? "Found" : "Missing",
            })

            const finalHtmlContent =
              htmlContent ||
              `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sparrow AI Generated App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <header class="hero">
            <h1>🐦 Welcome to Your Sparrow AI App</h1>
            <p>This is a complete web application generated by Sparrow AI</p>
        </header>
        <main class="content">
            <section class="features">
                <h2>Features</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>📱 Responsive Design</h3>
                        <p>Works perfectly on all devices</p>
                    </div>
                    <div class="feature-card">
                        <h3>🎨 Modern Styling</h3>
                        <p>Beautiful gradients and animations</p>
                    </div>
                    <div class="feature-card">
                        <h3>⚡ Interactive Elements</h3>
                        <p>Engaging user interactions</p>
                    </div>
                </div>
                <button id="demo-btn" class="cta-btn">Try Interactive Demo!</button>
            </section>
        </main>
        <footer class="footer">
            <p>&copy; 2024 Sparrow AI Generated App</p>
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`

            const finalCssContent =
              cssContent ||
              `/* Sparrow AI Generated Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    overflow-x: hidden;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 20px;
}

.hero {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;
    padding: 60px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 15px;
    font-weight: 700;
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease;
}

.hero p {
    font-size: 1.2rem;
    opacity: 0.9;
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.8s ease 0.2s both;
}

.content {
    padding: 60px 40px;
}

.features h2 {
    color: #2c3e50;
    margin-bottom: 40px;
    font-size: 2.5rem;
    text-align: center;
    font-weight: 700;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 50px;
}

.feature-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.1);
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.feature-card h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 1.3rem;
}

.feature-card p {
    color: #666;
    line-height: 1.6;
}

.cta-btn {
    display: block;
    margin: 0 auto;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 50px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
}

.cta-btn:active {
    transform: translateY(-1px);
}

.footer {
    background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
    color: white;
    padding: 30px;
    text-align: center;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    #app {
        margin: 10px;
        border-radius: 15px;
    }
    
    .hero {
        padding: 40px 20px;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .content {
        padding: 40px 20px;
    }
    
    .feature-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .features h2 {
        font-size: 2rem;
    }
}`

            const finalJsContent =
              jsContent ||
              `// Sparrow AI Generated JavaScript
console.log('🐦 Sparrow AI app loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, app ready!');
    
    // Add interactive button functionality
    const demoBtn = document.getElementById('demo-btn');
    if (demoBtn) {
        let clickCount = 0;
        const messages = [
            'Great! Click again! 🎉',
            'Awesome! One more! ⭐',
            'Perfect! You did it! 🚀',
            'Amazing! Keep going! 💫',
            'Fantastic! 🎊'
        ];
        
        demoBtn.addEventListener('click', function() {
            clickCount++;
            
            // Change button text and style based on clicks
            if (clickCount <= messages.length) {
                this.textContent = messages[clickCount - 1];
                
                // Cycle through different gradient colors
                const gradients = [
                    'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                    'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                    'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                    'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
                    'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)'
                ];
                
                this.style.background = gradients[(clickCount - 1) % gradients.length];
                
                // Add celebration effect
                createCelebration(this);
                
            } else {
                // Reset after 5 clicks
                this.textContent = 'Try Interactive Demo!';
                this.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
                clickCount = 0;
            }
            
            console.log(\`Button clicked \${clickCount} times! 🎯\`);
        });
        
        // Add hover effects
        demoBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        demoBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px) scale(1)';
        });
    }
    
    // Create celebration effect
    function createCelebration(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = \`
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: \${['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6'][Math.floor(Math.random() * 5)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    left: \${centerX}px;
                    top: \${centerY}px;
                \`;
                
                document.body.appendChild(particle);
                
                const angle = (Math.PI * 2 * i) / 10;
                const velocity = 100 + Math.random() * 50;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                let x = 0, y = 0;
                const animate = () => {
                    x += vx * 0.02;
                    y += vy * 0.02 + 2; // gravity
                    
                    particle.style.transform = \`translate(\${x}px, \${y}px)\`;
                    particle.style.opacity = Math.max(0, 1 - Math.abs(y) / 200);
                    
                    if (Math.abs(y) < 200) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };
                
                requestAnimationFrame(animate);
            }, i * 50);
        }
    }
    
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add entrance animation
    const app = document.getElementById('app');
    if (app) {
        app.style.opacity = '0';
        app.style.transform = 'translateY(30px) scale(0.95)';
        
        setTimeout(() => {
            app.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            app.style.opacity = '1';
            app.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = \`translateY(\${rate}px)\`;
        });
    }
});

// Add some utility functions
function showNotification(message, type = 'info') {
    console.log(\`📢 \${type.toUpperCase()}: \${message}\`);
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        font-weight: 500;
    \`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Animate out
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Initialize app
setTimeout(() => {
    showNotification('🚀 Sparrow AI app initialized successfully!', 'success');
}, 1000);`

            triggerCodeContentUpdate(finalHtmlContent, finalCssContent, finalJsContent)
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
