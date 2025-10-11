"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProjectFile } from "./workspace-area"

interface PreviewPanelProps {
  files: ProjectFile[]
}

export function PreviewPanel({ files }: PreviewPanelProps) {
  const [previewContent, setPreviewContent] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  const generatePreview = () => {
    console.log("[v0] Generating preview for files:", files.length)
    const htmlFile = files.find((f) => f.name.endsWith(".html") || f.language === "html")
    const cssFiles = files.filter((f) => f.name.endsWith(".css") || f.language === "css")
    const jsFiles = files.filter((f) => f.name.endsWith(".js") || f.language === "javascript")

    console.log("[v0] Found files - HTML:", !!htmlFile, "CSS:", cssFiles.length, "JS:", jsFiles.length)

    if (!htmlFile) {
      setPreviewContent("")
      setPreviewUrl("")
      return
    }

    let html = htmlFile.content

    if (cssFiles.length > 0) {
      const cssContent = cssFiles.map((f) => f.content).join("\n")
      const styleTag = `<style>\n${cssContent}\n</style>`

      if (html.includes("</head>")) {
        html = html.replace("</head>", `${styleTag}\n</head>`)
      } else if (html.includes("<head>")) {
        html = html.replace("<head>", `<head>\n${styleTag}`)
      } else {
        // If no head tag, add it
        html = `<!DOCTYPE html>\n<html>\n<head>\n${styleTag}\n</head>\n<body>\n${html}\n</body>\n</html>`
      }
    }

    if (jsFiles.length > 0) {
      const jsContent = jsFiles.map((f) => f.content).join("\n")
      const scriptTag = `<script>\n${jsContent}\n</script>`

      if (html.includes("</body>")) {
        html = html.replace("</body>", `${scriptTag}\n</body>`)
      } else if (html.includes("<body>")) {
        html = html.replace("</body>", `${scriptTag}\n</body>`)
      } else {
        // If no body tag, add the script at the end
        html = `${html}\n${scriptTag}`
      }
    }

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    setPreviewContent(html)
    setPreviewUrl(url)

    console.log("[v0] Preview generated successfully")
  }

  useEffect(() => {
    generatePreview()

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [files])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const refreshPreview = () => {
    setIsRefreshing(true)
    console.log("[v0] Refreshing preview...")
    setTimeout(() => {
      generatePreview()
      setIsRefreshing(false)
    }, 500)
  }

  const openInNewTab = () => {
    if (previewContent) {
      const blob = new Blob([previewContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
    }
  }

  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full bg-white rounded-lg border border-gray-800 flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Preview will appear here</p>
          <p className="text-sm">Start a conversation to generate code</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-white rounded-lg border border-gray-800 flex flex-col"
    >
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Live Preview</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshPreview}
            disabled={isRefreshing}
            className="text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" variant="ghost" onClick={openInNewTab} className="text-gray-600 hover:text-gray-800">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Code Preview"
            onLoad={() => console.log("[v0] Preview iframe loaded successfully")}
            onError={() => console.log("[v0] Preview iframe error")}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No HTML file to preview</p>
              <p className="text-sm">Generate HTML code to see the preview</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
