"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface ProjectFile {
  name: string
  content: string
  language: string
  lastModified: Date
}

interface Project {
  id: string
  name: string
  description: string
  files: ProjectFile[]
  createdAt: Date
  lastModified: Date
  lastSynced?: string
  syncedBy?: string
}

export default function DeployPage() {
  const params = useParams()
  const { pantryId, basketName, projectSlug } = params
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [previewContent, setPreviewContent] = useState("")

  const pantryUrl = `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${basketName}`
  const storageKey = `sparrow_deploy_${pantryId}_${basketName}_${projectSlug}`

  const saveToLocalStorage = (projectData: Project) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(projectData))
      console.log("[v0] Project saved to local storage")
    } catch (err) {
      console.error("[v0] Failed to save to local storage:", err)
    }
  }

  const loadFromLocalStorage = (): Project | null => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const projectData = JSON.parse(stored)
        return {
          ...projectData,
          createdAt: new Date(projectData.createdAt),
          lastModified: new Date(projectData.lastModified),
          files: projectData.files.map((f: any) => ({
            ...f,
            lastModified: new Date(f.lastModified),
          })),
        }
      }
    } catch (err) {
      console.error("[v0] Failed to load from local storage:", err)
    }
    return null
  }

  const loadProject = async () => {
    try {
      console.log("[v0] Loading project from:", pantryUrl)

      const proxyUrls = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(pantryUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(pantryUrl)}`,
        `https://cors-anywhere.herokuapp.com/${pantryUrl}`,
      ]

      let projectData = null
      let lastError = null

      for (const proxyUrl of proxyUrls) {
        try {
          const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            const data = await response.json()
            const contents = data.contents || data
            projectData = typeof contents === "string" ? JSON.parse(contents) : contents
            break
          }
        } catch (err) {
          lastError = err
          console.log("[v0] Proxy failed, trying next:", err)
        }
      }

      if (projectData) {
        const loadedProject: Project = {
          ...projectData,
          createdAt: new Date(projectData.createdAt),
          lastModified: new Date(projectData.lastModified),
          files: projectData.files.map((f: any) => ({
            ...f,
            lastModified: new Date(f.lastModified),
          })),
        }

        setProject(loadedProject)
        saveToLocalStorage(loadedProject)
        generatePreview(loadedProject.files)
        setError("")
        console.log("[v0] Project loaded successfully:", loadedProject.name)
      } else {
        throw lastError || new Error("All proxy services failed")
      }
    } catch (err) {
      console.error("[v0] Deploy page error:", err)

      if (!project) {
        const cachedProject = loadFromLocalStorage()
        if (cachedProject) {
          console.log("[v0] Using cached project from local storage")
          setProject(cachedProject)
          generatePreview(cachedProject.files)
          setError("")
        } else {
          setError("Failed to load project. Please check the URL and try again.")
        }
      } else {
        console.log("[v0] Fetch failed but keeping existing project data")
      }
    } finally {
      if (!project) {
        setIsLoading(false)
      }
    }
  }

  const generatePreview = (files: ProjectFile[]) => {
    console.log("[v0] Generating preview for files:", files.length)
    const htmlFile = files.find((f) => f.name.endsWith(".html") || f.language === "html")
    const cssFiles = files.filter((f) => f.name.endsWith(".css") || f.language === "css")
    const jsFiles = files.filter((f) => f.name.endsWith(".js") || f.language === "javascript")

    console.log("[v0] Found files - HTML:", !!htmlFile, "CSS:", cssFiles.length, "JS:", jsFiles.length)

    if (!htmlFile) {
      setPreviewContent("")
      return
    }

    let html = htmlFile.content

    if (!html.includes("<!DOCTYPE html>")) {
      html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Deployed by Sparrow</title>\n</head>\n<body>\n${html}\n</body>\n</html>`
    }

    // Inject CSS
    if (cssFiles.length > 0) {
      const cssContent = cssFiles.map((f) => f.content).join("\n")
      const styleTag = `<style>\n${cssContent}\n</style>`

      if (html.includes("</head>")) {
        html = html.replace("</head>", `${styleTag}\n</head>`)
      } else {
        html = html.replace("<head>", `<head>\n${styleTag}`)
      }
    }

    // Inject JS
    if (jsFiles.length > 0) {
      const jsContent = jsFiles.map((f) => f.content).join("\n")
      const scriptTag = `<script>\n${jsContent}\n</script>`

      if (html.includes("</body>")) {
        html = html.replace("</body>", `${scriptTag}\n</body>`)
      } else {
        html = `${html}\n${scriptTag}`
      }
    }

    const sparrowLabel = `
<div id="sparrow-label" style="
  position: fixed !important;
  bottom: 16px !important;
  right: 16px !important;
  background: rgba(0, 0, 0, 0.9) !important;
  color: white !important;
  padding: 8px 12px !important;
  border-radius: 6px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  font-size: 12px !important;
  z-index: 999999 !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  pointer-events: none !important;
">
  Made by <strong>Sparrow</strong>
</div>`

    if (html.includes("</body>")) {
      html = html.replace("</body>", `${sparrowLabel}\n</body>`)
    } else {
      html = `${html}\n${sparrowLabel}`
    }

    setPreviewContent(html)
    console.log("[v0] Preview generated successfully")
  }

  useEffect(() => {
    const cachedProject = loadFromLocalStorage()
    if (cachedProject) {
      console.log("[v0] Loading cached project first")
      setProject(cachedProject)
      generatePreview(cachedProject.files)
      setError("")
      setIsLoading(false)
    }

    loadProject()

    const interval = setInterval(() => {
      if (project) {
        loadProject()
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [pantryUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <h2 className="text-xl font-semibold text-white">Loading Project...</h2>
          <p className="text-gray-400">Fetching from cloud storage</p>
        </div>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-400 text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold text-white">Project Not Available</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={loadProject}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      {previewContent ? (
        <iframe
          srcDoc={previewContent}
          className="w-full h-screen border-0 block"
          style={{ minHeight: "100vh", width: "100vw" }}
          title={`${project?.name || "Project"} - Deployed by Sparrow`}
          onLoad={() => {
            console.log("[v0] Deploy iframe loaded successfully")
          }}
          onError={(e) => {
            console.log("[v0] Deploy iframe error:", e)
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      ) : (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-white">No Content Available</h2>
            <p className="text-gray-400">The project doesn't contain any HTML files to display.</p>
          </div>
        </div>
      )}
    </div>
  )
}
