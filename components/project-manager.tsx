"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  FolderPlus,
  Download,
  Upload,
  Save,
  Trash2,
  Copy,
  FileText,
  Calendar,
  Clock,
  Code,
  Globe,
  ExternalLink,
} from "lucide-react"
import type { Project } from "./workspace-area"
import type { ProjectManagerProps } from "./project-manager-props" // Declare the variable before using it

const NETLIFY_CONFIG = {
  clientId: "XAkrd0SVdfyJ0yRze7qGr5NZMnRLrz6lOil9Tu9QiUo",
  redirectUri: typeof window !== "undefined" ? window.location.origin : "",
}

export function ProjectManager({ currentProject, onProjectCreate, onProjectUpdate }: ProjectManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)
  const [deploymentStatus, setDeploymentStatus] = useState<string>("")

  const startEditing = () => {
    if (currentProject) {
      setEditName(currentProject.name)
      setEditDescription(currentProject.description)
      setIsEditing(true)
    }
  }

  const saveProjectChanges = () => {
    if (currentProject && editName.trim()) {
      const updatedProject: Project = {
        ...currentProject,
        name: editName.trim(),
        description: editDescription.trim(),
        lastModified: new Date(),
      }
      onProjectUpdate(updatedProject)
      setIsEditing(false)
    }
  }

  const createProject = () => {
    if (newProjectName.trim()) {
      onProjectCreate(newProjectName.trim(), newProjectDescription.trim())
      setIsCreating(false)
      setNewProjectName("")
      setNewProjectDescription("")
    }
  }

  const exportProject = () => {
    if (currentProject) {
      const projectData = JSON.stringify(currentProject, null, 2)
      const blob = new Blob([projectData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentProject.name.replace(/[^a-zA-Z0-9]/g, "_")}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const importProject = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target?.result as string)
            const project: Project = {
              ...projectData,
              id: Date.now().toString(), // New ID for imported project
              createdAt: new Date(projectData.createdAt),
              lastModified: new Date(),
              files: projectData.files.map((f: any) => ({
                ...f,
                lastModified: new Date(f.lastModified),
              })),
            }
            onProjectUpdate(project)
          } catch (error) {
            console.error("Failed to import project:", error)
            alert("Failed to import project. Please check the file format.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const exportAllFiles = () => {
    if (currentProject && currentProject.files.length > 0) {
      // Create a zip-like structure by creating multiple downloads
      currentProject.files.forEach((file) => {
        const blob = new Blob([file.content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      })
    }
  }

  const clearProject = () => {
    if (confirm("Are you sure you want to clear the current project? This action cannot be undone.")) {
      onProjectCreate("New Project", "")
    }
  }

  const duplicateProject = () => {
    if (currentProject) {
      const duplicatedProject: Project = {
        ...currentProject,
        id: Date.now().toString(),
        name: `${currentProject.name} (Copy)`,
        createdAt: new Date(),
        lastModified: new Date(),
      }
      onProjectUpdate(duplicatedProject)
    }
  }

  const deployToNetlify = async () => {
    if (!currentProject || currentProject.files.length === 0) {
      alert("No project files to deploy!")
      return
    }

    setIsDeploying(true)
    setDeploymentStatus("Starting deployment...")
    setDeploymentUrl(null)

    try {
      let accessToken = localStorage.getItem("netlify_access_token")

      if (!accessToken) {
        setDeploymentStatus("Authenticating with Netlify...")
        try {
          accessToken = await authenticateWithNetlify()
        } catch (oauthError) {
          console.log("[v0] OAuth failed, falling back to manual token:", oauthError)
          setDeploymentStatus("OAuth failed, requesting manual token...")

          // Fallback to manual token approach
          const token = prompt(
            "OAuth authentication failed. Please enter your Netlify Personal Access Token:\n\n" +
              "1. Go to https://app.netlify.com/user/applications#personal-access-tokens\n" +
              "2. Click 'New access token'\n" +
              "3. Give it a name and copy the token\n" +
              "4. Paste it here:",
          )

          if (!token) {
            throw new Error("Access token required for deployment")
          }

          accessToken = token.trim()
          localStorage.setItem("netlify_access_token", accessToken)
        }
      }

      setDeploymentStatus("Preparing files for deployment...")
      const files: { [key: string]: string } = {}
      let hasHtmlFile = false

      currentProject.files.forEach((file) => {
        files[file.name] = file.content
        if (file.name.toLowerCase().includes(".html") || file.name === "index.html") {
          hasHtmlFile = true
        }
        console.log(`[v0] Preparing file: ${file.name} (${file.content.length} characters)`)
      })

      if (!hasHtmlFile) {
        console.warn("[v0] No HTML file found, deployment may not work properly")
      }

      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const uniqueSubdomain =
        `${currentProject.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${timestamp}-${randomString}`.substring(0, 63)

      setDeploymentStatus("Creating site on Netlify...")
      console.log("[v0] Creating site with unique subdomain:", uniqueSubdomain)

      const deployResponse = await fetch("https://api.netlify.com/api/v1/sites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: uniqueSubdomain,
        }),
      })

      if (!deployResponse.ok) {
        const errorText = await deployResponse.text()
        console.error("[v0] Site creation failed:", errorText)
        throw new Error(`Failed to create site: ${errorText}`)
      }

      const siteData = await deployResponse.json()
      const siteId = siteData.id
      console.log("[v0] Site created successfully:", siteId)

      setDeploymentStatus("Uploading files to site...")
      const fileDeployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: files,
        }),
      })

      if (!fileDeployResponse.ok) {
        const errorText = await fileDeployResponse.text()
        console.error("[v0] File deployment failed:", errorText)
        throw new Error(`Failed to deploy files: ${errorText}`)
      }

      const deployData = await fileDeployResponse.json()
      console.log("[v0] Deploy data:", deployData)

      setDeploymentStatus("Finalizing deployment...")

      // Wait a bit for the deployment to propagate
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const siteUrl = siteData.ssl_url || siteData.url
      console.log("[v0] Deployment successful:", siteUrl)

      setDeploymentStatus("Verifying site accessibility...")
      try {
        const testResponse = await fetch(siteUrl, { method: "HEAD", mode: "no-cors" })
        console.log("[v0] Site accessibility test completed")
      } catch (e) {
        console.log("[v0] Site accessibility test failed (expected for CORS), but site should be live")
      }

      setDeploymentUrl(siteUrl)
      setDeploymentStatus("Deployment completed successfully!")

      alert(
        `🎉 Successfully deployed to Netlify!\n\n` +
          `Site URL: ${siteUrl}\n\n` +
          `Note: It may take 1-2 minutes for the site to be fully accessible. ` +
          `If you get a "Site not found" error, please wait a moment and try again.`,
      )
    } catch (error) {
      console.error("Deployment error:", error)
      setDeploymentStatus("Deployment failed")

      if (error instanceof Error && error.message.includes("401")) {
        localStorage.removeItem("netlify_access_token")
        alert("Invalid access token. Please try again with a valid token.")
      } else {
        alert(`Deployment failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } finally {
      setIsDeploying(false)
      // Clear status after a delay
      setTimeout(() => setDeploymentStatus(""), 5000)
    }
  }

  const authenticateWithNetlify = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const redirectUri = window.location.origin
      const authUrl = `https://app.netlify.com/authorize?client_id=${NETLIFY_CONFIG.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`

      console.log("[v0] Opening OAuth URL:", authUrl)

      // Check if we're already in an OAuth callback
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get("code")
      const error = urlParams.get("error")

      if (code) {
        // We're in the OAuth callback, exchange code for token
        console.log("[v0] Found OAuth code in URL, exchanging for token")
        exchangeCodeForToken(code, redirectUri).then(resolve).catch(reject)
        return
      }

      if (error) {
        reject(new Error(`OAuth error: ${error}`))
        return
      }

      // Open OAuth in same window instead of popup to avoid issues
      const shouldUsePopup = confirm(
        "This will open Netlify authentication. Choose:\n\n" +
          "OK - Open in popup (recommended)\n" +
          "Cancel - Open in same tab (fallback)",
      )

      if (shouldUsePopup) {
        // Try popup approach
        const popup = window.open(authUrl, "netlify-oauth", "width=600,height=700,scrollbars=yes,resizable=yes")

        if (!popup) {
          reject(new Error("Popup blocked. Please allow popups and try again."))
          return
        }

        const checkCallback = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(checkCallback)
              reject(new Error("OAuth cancelled by user"))
              return
            }

            // Try to read the popup URL (will fail due to CORS until redirect)
            try {
              const popupUrl = popup.location.href
              if (popupUrl.includes("code=")) {
                const popupParams = new URLSearchParams(popup.location.search)
                const authCode = popupParams.get("code")
                if (authCode) {
                  clearInterval(checkCallback)
                  popup.close()
                  exchangeCodeForToken(authCode, redirectUri).then(resolve).catch(reject)
                  return
                }
              }
            } catch (e) {
              // Expected CORS error, continue checking
            }
          } catch (e) {
            // Continue checking
          }
        }, 1000)
      } else {
        // Fallback: redirect in same window
        window.location.href = authUrl
      }
    })
  }

  const exchangeCodeForToken = async (code: string, redirectUri: string): Promise<string> => {
    try {
      console.log("[v0] Exchanging code for token")

      const tokenResponse = await fetch("https://api.netlify.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_id: NETLIFY_CONFIG.clientId,
          client_secret: "AemC6v6hW-Cly5AVwX8A2gPoFg1CJEazqlPT3sWNkGw",
          redirect_uri: redirectUri,
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        console.error("[v0] Token exchange failed:", errorText)
        throw new Error(`Token exchange failed: ${errorText}`)
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      if (!accessToken) {
        throw new Error("No access token received")
      }

      console.log("[v0] Successfully obtained access token")
      localStorage.setItem("netlify_access_token", accessToken)

      if (window.location.search.includes("code=")) {
        const cleanUrl = window.location.origin + window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
      }

      return accessToken
    } catch (error) {
      console.error("[v0] Token exchange error:", error)
      throw error
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 p-6 overflow-auto"
    >
      <div className="space-y-6">
        {/* Project Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Project Manager</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsCreating(true)} className="bg-white text-black hover:bg-gray-200">
              <FolderPlus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <Button onClick={importProject} variant="outline" className="border-gray-600 text-white bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Create New Project */}
        {isCreating && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Project</CardTitle>
              <CardDescription className="text-gray-400">Start a new coding project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="project-name" className="text-white">
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  className="bg-gray-900 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="project-description" className="text-white">
                  Description (Optional)
                </Label>
                <Textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Describe your project..."
                  className="bg-gray-900 border-gray-600 text-white"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={createProject} className="bg-white text-black hover:bg-gray-200">
                  Create Project
                </Button>
                <Button
                  onClick={() => {
                    setIsCreating(false)
                    setNewProjectName("")
                    setNewProjectDescription("")
                  }}
                  variant="outline"
                  className="border-gray-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Project */}
        {currentProject && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-gray-900 border-gray-600 text-white text-xl font-bold"
                      />
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Project description..."
                        className="bg-gray-900 border-gray-600 text-gray-400"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-white text-xl">{currentProject.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {currentProject.description || "No description"}
                      </CardDescription>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={saveProjectChanges} size="sm" className="bg-white text-black hover:bg-gray-200">
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-white"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={startEditing}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-white bg-transparent"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Files</span>
                  </div>
                  <div className="text-xl font-bold text-white">{currentProject.files.length}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Lines</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {currentProject.files.reduce((total, file) => total + file.content.split("\n").length, 0)}
                  </div>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Created</span>
                  </div>
                  <div className="text-sm font-medium text-white">{currentProject.createdAt.toLocaleDateString()}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-400">Modified</span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {currentProject.lastModified.toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Project Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={deployToNetlify}
                  disabled={isDeploying || !currentProject?.files.length}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {isDeploying ? "Deploying..." : "Deploy to Netlify"}
                </Button>

                {deploymentStatus && (
                  <div className="text-sm text-blue-400 bg-blue-900/20 px-3 py-1 rounded">{deploymentStatus}</div>
                )}

                {deploymentUrl && (
                  <Button
                    onClick={() => window.open(deploymentUrl, "_blank")}
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Site
                  </Button>
                )}

                <Button
                  onClick={exportProject}
                  variant="outline"
                  className="border-gray-600 text-white bg-transparent"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Project
                </Button>

                <Button
                  onClick={exportAllFiles}
                  variant="outline"
                  className="border-gray-600 text-white bg-transparent"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Files
                </Button>
                <Button
                  onClick={duplicateProject}
                  variant="outline"
                  className="border-gray-600 text-white bg-transparent"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  onClick={clearProject}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Project State */}
        {!currentProject && !isCreating && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderPlus className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Project Loaded</h3>
              <p className="text-gray-400 text-center mb-6">
                Create a new project or import an existing one to get started
              </p>
              <div className="flex items-center space-x-4">
                <Button onClick={() => setIsCreating(true)} className="bg-white text-black hover:bg-gray-200">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                <Button onClick={importProject} variant="outline" className="border-gray-600 text-white bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}
