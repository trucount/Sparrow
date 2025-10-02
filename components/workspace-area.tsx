"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code, Activity, Settings } from "lucide-react"
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

export function WorkspaceArea() {
  const [activeTab, setActiveTab] = useState("preview")
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [serviceType, setServiceType] = useState<string>("website-builder")

  // Load service type from localStorage
  useEffect(() => {
    const savedServiceType = localStorage.getItem("sparrow_service_type") || "website-builder"
    setServiceType(savedServiceType)
  }, [])

  const createDefaultProject = () => {
    const serviceType = localStorage.getItem("sparrow_service_type") || "website-builder"
    
    if (serviceType === "web-app-builder") {
      const defaultFiles: ProjectFile[] = [
        {
          id: "app_page_tsx",
          name: "app/page.tsx",
          content: `import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Welcome to Your App
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Your modern web application is ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Start Building
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}`,
          language: "tsx",
          path: "app/page.tsx",
          lastModified: new Date(),
        },
        {
          id: "components_ui_button_tsx",
          name: "components/ui/button.tsx",
          content: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,
          language: "tsx",
          path: "components/ui/button.tsx",
          lastModified: new Date(),
        },
        {
          id: "lib_utils_ts",
          name: "lib/utils.ts",
          content: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
          language: "typescript",
          path: "lib/utils.ts",
          lastModified: new Date(),
        },
        {
          id: "package_json",
          name: "package.json",
          content: `{
  "name": "sparrow-web-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.2.4",
    "react": "^19",
    "react-dom": "^19",
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4.1.9",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "class-variance-authority": "^0.7.1",
    "@radix-ui/react-slot": "latest",
    "lucide-react": "^0.454.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.9",
    "postcss": "^8.5"
  }
}`,
          language: "json",
          path: "package.json",
          lastModified: new Date(),
        },
        {
          id: "tailwind_config_ts",
          name: "tailwind.config.ts",
          content: `import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}

export default config`,
          language: "typescript",
          path: "tailwind.config.ts",
          lastModified: new Date(),
        },
      ]

      const newProject: Project = {
        id: Date.now().toString(),
        name: "Sparrow Web App",
        description: "Modern TypeScript/React web application",
        files: defaultFiles,
        createdAt: new Date(),
        lastModified: new Date(),
      }

      setCurrentProject(newProject)
      setActiveFileId("app_page_tsx")
      return
    }

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

  // Load project from localStorage on mount or create default
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

  // Save project to localStorage whenever it changes
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem("sparrow_current_project", JSON.stringify(currentProject))
    }
  }, [currentProject])

  // Listen for code generation events from chat
  useEffect(() => {
    const handleSessionUpdate = (event: CustomEvent) => {
      const { sessionId, projectId } = event.detail
      if (currentProject && sessionId) {
        // Link current project to chat session
        const chatSessions = JSON.parse(localStorage.getItem("sparrow_chat_sessions") || "[]")
        const updatedSessions = chatSessions.map((session: any) => 
          session.id === sessionId 
            ? { ...session, projectId: currentProject.id }
            : session
        )
        localStorage.setItem("sparrow_chat_sessions", JSON.stringify(updatedSessions))
      }
    }

    const handleCodeGenerated = (event: CustomEvent) => {
      const { code, language, filename } = event.detail
      addOrUpdateFile(filename, code, language)
      
      // Notify chat about file generation
      window.dispatchEvent(new CustomEvent("fileGenerated", {
        detail: { filename, language, projectId: currentProject?.id }
      }))
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

      // Ensure all files from structure exist
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
      setActiveTab("preview") // Start with preview tab for new projects
    }

    window.addEventListener("codeGenerated", handleCodeGenerated as EventListener)
    window.addEventListener("codeContentUpdate", handleCodeContentUpdate as EventListener)
    window.addEventListener("createProjectFiles", handleCreateProjectFiles as EventListener)
    window.addEventListener("createNewProject", handleCreateNewProject as EventListener)
    window.addEventListener("sessionUpdate", handleSessionUpdate as EventListener)

    return () => {
      window.removeEventListener("codeGenerated", handleCodeGenerated as EventListener)
      window.removeEventListener("codeContentUpdate", handleCodeContentUpdate as EventListener)
      window.removeEventListener("createProjectFiles", handleCreateProjectFiles as EventListener)
      window.removeEventListener("createNewProject", handleCreateNewProject as EventListener)
      window.removeEventListener("sessionUpdate", handleSessionUpdate as EventListener)
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
        // Update existing file
        updatedFiles = [...prev.files]
        updatedFiles[existingIndex] = {
          ...updatedFiles[existingIndex],
          content,
          language,
          lastModified: now,
        }
      } else {
        // Add new file
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
    setActiveTab("code") // Switch to code tab when new code is generated
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

    // Switch to code tab when content is updated
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
        className="border-b border-gray-800 p-4 backdrop-blur-sm bg-black/50 flex-shrink-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/80 backdrop-blur-sm">
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              <Eye className="w-4 h-4 mr-2" />
              {serviceType === "web-app-builder" ? "App Preview" : "Preview"}
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              <Code className="w-4 h-4 mr-2" />
              {serviceType === "web-app-builder" ? "Components" : "Code"}{" "}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="ml-1 bg-white text-black rounded-full px-2 py-0.5 text-xs"
                  >
                    {files.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              <Activity className="w-4 h-4 mr-2" />
              {serviceType === "web-app-builder" ? "Console" : "Status"}
            </TabsTrigger>
            <TabsTrigger
              value="project"
              className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              <Settings className="w-4 h-4 mr-2" />
              Project
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <div className="flex-1 p-4 min-h-0">
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

            <TabsContent value="status" className="h-full overflow-hidden">
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <StatusPanel files={files} project={currentProject} serviceType={serviceType} />
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
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}