"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code, Activity, Settings, Info } from "lucide-react"
import { CodeEditor } from "./code-editor"
import { PreviewPanel } from "./preview-panel"
import { StatusPanel } from "./status-panel"
import { ProjectManager } from "./project-manager"

export interface ProjectFile {
  id: string
  name: string
  content: string
  language: string
  path: string
  lastModified: Date
}

export interface Project {
  id: string
  name: string
  description: string
  files: ProjectFile[]
  createdAt: Date
  lastModified: Date
}

interface WorkspaceAreaProps {
  isMobile?: boolean
}

export function WorkspaceArea({ isMobile = false }: WorkspaceAreaProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [activeFileId, setActiveFileId] = useState<string | null>(null)

  const createDefaultProject = () => {
    const defaultFiles: ProjectFile[] = [
      {
        id: "index_html",
        name: "index.html",
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
        <h1>Welcome to Sparrow AI</h1>
        <p>Your generated content will appear here...</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        language: "html",
        path: "index.html",
        lastModified: new Date(),
      },
      {
        id: "styles_css",
        name: "styles.css",
        content: `/* Sparrow AI Generated Styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f5f5f5;
    color: #333;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
}`,
        language: "css",
        path: "styles.css",
        lastModified: new Date(),
      },
      {
        id: "script_js",
        name: "script.js",
        content: `// Sparrow AI Generated JavaScript
console.log('Sparrow AI app loaded successfully!');

// Your generated JavaScript code will be added here
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, app ready!');
});`,
        language: "javascript",
        path: "script.js",
        lastModified: new Date(),
      },
    ]

    const newProject: Project = {
      id: Date.now().toString(),
      name: "Sparrow AI Project",
      description: "Generated web application",
      files: defaultFiles,
      createdAt: new Date(),
      lastModified: new Date(),
    }

    setCurrentProject(newProject)
    setActiveFileId("index_html")
  }

  useEffect(() => {
    const savedProject = localStorage.getItem("sparrow_current_project")
    if (savedProject) {
      try {
        const project = JSON.parse(savedProject)
        setCurrentProject({
          ...project,
          createdAt: new Date(project.createdAt),
          lastModified: new Date(project.lastModified),
          files: project.files.map((f: any) => ({
            ...f,
            lastModified: new Date(f.lastModified),
          })),
        })
      } catch (error) {
        console.error("Failed to load saved project:", error)
        createDefaultProject()
      }
    } else {
      createDefaultProject()
    }
  }, [])

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem("sparrow_current_project", JSON.stringify(currentProject))
    }
  }, [currentProject])

  useEffect(() => {
    const handleCodeGenerated = (event: CustomEvent) => {
      const { code, language, filename } = event.detail
      addOrUpdateFile(filename, code, language)
    }

    const handleCodeContentUpdate = (event: CustomEvent) => {
      const { htmlContent, cssContent, jsContent } = event.detail

      if (htmlContent) updateSpecificFile("index.html", htmlContent, "html")
      if (cssContent) updateSpecificFile("styles.css", cssContent, "css")
      if (jsContent) updateSpecificFile("script.js", jsContent, "javascript")
    }

    const handleCreateProjectFiles = (event: CustomEvent) => {
      const { files } = event.detail
      console.log("[v0] Creating project files from structure:", files)

      if (!currentProject) {
        createDefaultProject()
        return
      }

      const now = new Date()
      setCurrentProject((prev) => {
        if (!prev) return null

        const updatedFiles = [...prev.files]

        files.forEach((filename: string) => {
          const exists = updatedFiles.some((f) => f.name === filename)
          if (!exists) {
            const fileId = filename.replace(/[^a-zA-Z0-9]/g, "_")
            const language = filename.endsWith(".html")
              ? "html"
              : filename.endsWith(".css")
                ? "css"
                : filename.endsWith(".js")
                  ? "javascript"
                  : "text"

            updatedFiles.push({
              id: fileId,
              name: filename,
              content: `// ${filename} - Generated by Sparrow AI\n// Content will be added here...`,
              language,
              path: filename,
              lastModified: now,
            })
          }
        })

        return {
          ...prev,
          files: updatedFiles,
          lastModified: now,
        }
      })
    }

    const handleCreateNewProject = (event: CustomEvent) => {
      const { sessionId, projectName } = event.detail
      console.log("[v0] Creating new project for chat session:", sessionId)

      const defaultFiles: ProjectFile[] = [
        {
          id: "index_html",
          name: "index.html",
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
        <h1>Welcome to Sparrow AI</h1>
        <p>Start chatting to generate your web application...</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
          language: "html",
          path: "index.html",
          lastModified: new Date(),
        },
        {
          id: "styles_css",
          name: "styles.css",
          content: `/* Sparrow AI Generated Styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f5f5f5;
    color: #333;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
}`,
          language: "css",
          path: "styles.css",
          lastModified: new Date(),
        },
        {
          id: "script_js",
          name: "script.js",
          content: `// Sparrow AI Generated JavaScript
console.log('Sparrow AI app loaded successfully!');

// Your generated JavaScript code will be added here
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, app ready!');
});`,
          language: "javascript",
          path: "script.js",
          lastModified: new Date(),
        },
      ]

      const newProject: Project = {
        id: sessionId,
        name: projectName || "Sparrow AI Project",
        description: "Generated web application",
        files: defaultFiles,
        createdAt: new Date(),
        lastModified: new Date(),
      }

      setCurrentProject(newProject)
      setActiveFileId("index_html")
      setActiveTab("preview")
    }

    window.addEventListener("codeGenerated", handleCodeGenerated as EventListener)
    window.addEventListener("codeContentUpdate", handleCodeContentUpdate as EventListener)
    window.addEventListener("createProjectFiles", handleCreateProjectFiles as EventListener)
    window.addEventListener("createNewProject", handleCreateNewProject as EventListener)

    return () => {
      window.removeEventListener("codeGenerated", handleCodeGenerated as EventListener)
      window.removeEventListener("codeContentUpdate", handleCodeContentUpdate as EventListener)
      window.removeEventListener("createProjectFiles", handleCreateProjectFiles as EventListener)
      window.removeEventListener("createNewProject", handleCreateNewProject as EventListener)
    }
  }, [currentProject])

  const createNewProject = (name: string, description = "") => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      files: [],
      createdAt: new Date(),
      lastModified: new Date(),
    }
    setCurrentProject(newProject)
    setActiveFileId(null)
  }

  const addOrUpdateFile = (filename: string, content: string, language: string) => {
    if (!currentProject) {
      createNewProject("Untitled Project", "Generated from chat")
    }

    const fileId = filename.replace(/[^a-zA-Z0-9]/g, "_")
    const now = new Date()

    setCurrentProject((prev) => {
      if (!prev) return null

      const existingIndex = prev.files.findIndex((f) => f.name === filename)
      let updatedFiles

      if (existingIndex >= 0) {
        updatedFiles = [...prev.files]
        updatedFiles[existingIndex] = {
          ...updatedFiles[existingIndex],
          content,
          language,
          lastModified: now,
        }
      } else {
        const newFile: ProjectFile = {
          id: fileId,
          name: filename,
          content,
          language,
          path: filename,
          lastModified: now,
        }
        updatedFiles = [...prev.files, newFile]
      }

      return {
        ...prev,
        files: updatedFiles,
        lastModified: now,
      }
    })

    setActiveFileId(fileId)
    setActiveTab("code")
  }

  const updateSpecificFile = (filename: string, content: string, language: string) => {
    if (!currentProject) return

    const now = new Date()

    setCurrentProject((prev) => {
      if (!prev) return null

      const updatedFiles = prev.files.map((file) => {
        if (file.name === filename) {
          return {
            ...file,
            content,
            language,
            lastModified: now,
          }
        }
        return file
      })

      return {
        ...prev,
        files: updatedFiles,
        lastModified: now,
      }
    })

    setActiveTab("code")
  }

  const deleteFile = (fileId: string) => {
    setCurrentProject((prev) => {
      if (!prev) return null

      const updatedFiles = prev.files.filter((f) => f.id !== fileId)
      return {
        ...prev,
        files: updatedFiles,
        lastModified: new Date(),
      }
    })

    if (activeFileId === fileId) {
      setActiveFileId(null)
    }
  }

  const renameFile = (fileId: string, newName: string) => {
    setCurrentProject((prev) => {
      if (!prev) return null

      return {
        ...prev,
        files: prev.files.map((file) =>
          file.id === fileId
            ? {
                ...file,
                name: newName,
                path: newName,
                lastModified: new Date(),
              }
            : file,
        ),
        lastModified: new Date(),
      }
    })
  }

  const activeFile = currentProject?.files.find((f) => f.id === activeFileId)
  const files = currentProject?.files || []

  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="border-b border-gray-800 p-3 backdrop-blur-sm bg-black/50 flex-shrink-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={`grid w-full ${isMobile ? "grid-cols-3" : "grid-cols-4"} bg-gray-900/80 backdrop-blur-sm`}
          >
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-white data-[state=active]:text-black transition-all-smooth hover-lift relative overflow-hidden animated-border text-xs sm:text-sm"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-white data-[state=active]:text-black transition-all-smooth hover-lift relative overflow-hidden animated-border text-xs sm:text-sm"
            >
              <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Code{" "}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="ml-1 bg-white text-black rounded-full px-1.5 py-0.5 text-xs pulse-glow"
                  >
                    {files.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </TabsTrigger>
            {isMobile ? (
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-white data-[state=active]:text-black transition-all-smooth hover-lift relative overflow-hidden animated-border text-xs sm:text-sm"
              >
                <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Info
              </TabsTrigger>
            ) : (
              <>
                <TabsTrigger
                  value="status"
                  className="data-[state=active]:bg-white data-[state=active]:text-black transition-all-smooth hover-lift relative overflow-hidden animated-border text-xs sm:text-sm"
                >
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Status
                </TabsTrigger>
                <TabsTrigger
                  value="project"
                  className="data-[state=active]:bg-white data-[state=active]:text-black transition-all-smooth hover-lift relative overflow-hidden animated-border text-xs sm:text-sm"
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Project
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
      </motion.div>

      <div className="flex-1 p-2 sm:p-4 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <AnimatePresence mode="wait">
            <TabsContent value="preview" className="h-full overflow-hidden">
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <PreviewPanel files={files} />
              </motion.div>
            </TabsContent>

            <TabsContent value="code" className="h-full overflow-hidden">
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <CodeEditor
                  files={files}
                  activeFileId={activeFileId}
                  onFileSelect={setActiveFileId}
                  onFileUpdate={updateSpecificFile}
                  onFileDelete={deleteFile}
                  onFileRename={renameFile}
                />
              </motion.div>
            </TabsContent>

            {isMobile ? (
              <TabsContent value="info" className="h-full overflow-hidden">
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-y-auto space-y-4"
                >
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <h3 className="text-sm font-semibold mb-2 text-white">Project Status</h3>
                    <StatusPanel files={files} project={currentProject} />
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <h3 className="text-sm font-semibold mb-2 text-white">Project Settings</h3>
                    <ProjectManager
                      currentProject={currentProject}
                      onProjectCreate={createNewProject}
                      onProjectUpdate={setCurrentProject}
                    />
                  </div>
                </motion.div>
              </TabsContent>
            ) : (
              <>
                <TabsContent value="status" className="h-full overflow-hidden">
                  <motion.div
                    key="status"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <StatusPanel files={files} project={currentProject} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="project" className="h-full overflow-hidden">
                  <motion.div
                    key="project"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ProjectManager
                      currentProject={currentProject}
                      onProjectCreate={createNewProject}
                      onProjectUpdate={setCurrentProject}
                    />
                  </motion.div>
                </TabsContent>
              </>
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}
