"use client"

import { useState, useEffect } from "react"
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
  Cloud,
  CloudOff,
  Settings,
  Globe,
} from "lucide-react"
import type { Project } from "./workspace-area"
import type { ProjectManagerProps } from "./project-manager-props"

export function ProjectManager({ currentProject, onProjectCreate, onProjectUpdate }: ProjectManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [pantryUrl, setPantryUrl] = useState("")
  const [isPantryConnected, setIsPantryConnected] = useState(false)
  const [isShowingPantrySetup, setIsShowingPantrySetup] = useState(false)
  const [isSavingToPantry, setIsSavingToPantry] = useState(false)
  const [isLoadingFromPantry, setIsLoadingFromPantry] = useState(false)
  const [pantryStatus, setPantryStatus] = useState("")
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)
  const [deployUrl, setDeployUrl] = useState<string | null>(null)
  const [isDeployed, setIsDeployed] = useState(false)

  useEffect(() => {
    const savedPantryUrl = localStorage.getItem("sparrow_pantry_url")
    const savedAutoSync = localStorage.getItem("sparrow_auto_sync") === "true"

    if (savedPantryUrl) {
      setPantryUrl(savedPantryUrl)
      setIsPantryConnected(true)
      setAutoSyncEnabled(savedAutoSync)
    }

    const handleResetCloudConnection = () => {
      // Reset all cloud connection state for new chat
      localStorage.removeItem("sparrow_pantry_url")
      localStorage.removeItem("sparrow_auto_sync")
      setPantryUrl("")
      setIsPantryConnected(false)
      setAutoSyncEnabled(false)
      setDeployUrl(null)
      setIsDeployed(false)
      setPantryStatus("New chat - cloud connection reset")
      setTimeout(() => setPantryStatus(""), 3000)
    }

    window.addEventListener("resetCloudConnection", handleResetCloudConnection)

    return () => {
      window.removeEventListener("resetCloudConnection", handleResetCloudConnection)
    }
  }, [])

  useEffect(() => {
    if (autoSyncEnabled && isPantryConnected && currentProject && currentProject.files.length > 0) {
      const autoSaveTimer = setTimeout(() => {
        saveToPantry(true) // Silent auto-save
      }, 2000) // Auto-save 2 seconds after changes

      return () => clearTimeout(autoSaveTimer)
    }
  }, [currentProject, autoSyncEnabled, isPantryConnected])

  const validatePantryUrl = (url: string) => {
    const pantryPattern = /^https:\/\/getpantry\.cloud\/apiv1\/pantry\/[a-f0-9-]+\/basket\/[a-zA-Z0-9]+$/
    return pantryPattern.test(url)
  }

  const connectToPantry = async () => {
    if (!pantryUrl || !validatePantryUrl(pantryUrl)) {
      setPantryStatus("Invalid Pantry URL format")
      return
    }

    setPantryStatus("Testing connection...")

    try {
      // Test connection by trying to read from the basket
      const response = await fetch(pantryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok || response.status === 404) {
        // 404 is OK for empty baskets
        localStorage.setItem("sparrow_pantry_url", pantryUrl)
        setIsPantryConnected(true)
        setIsShowingPantrySetup(false)
        setPantryStatus("Connected to Pantry successfully!")
        setTimeout(() => setPantryStatus(""), 3000)
      } else {
        setPantryStatus("Failed to connect to Pantry. Please check your URL.")
      }
    } catch (error) {
      setPantryStatus("Connection failed. Please check your internet connection.")
    }
  }

  const disconnectFromPantry = () => {
    localStorage.removeItem("sparrow_pantry_url")
    localStorage.removeItem("sparrow_auto_sync")
    setPantryUrl("")
    setIsPantryConnected(false)
    setAutoSyncEnabled(false)
    setPantryStatus("Disconnected from Pantry")
    setTimeout(() => setPantryStatus(""), 3000)
  }

  const toggleAutoSync = () => {
    const newAutoSync = !autoSyncEnabled
    setAutoSyncEnabled(newAutoSync)
    localStorage.setItem("sparrow_auto_sync", newAutoSync.toString())
    setPantryStatus(newAutoSync ? "Auto-sync enabled" : "Auto-sync disabled")
    setTimeout(() => setPantryStatus(""), 2000)
  }

  const saveToPantry = async (silent = false) => {
    if (!currentProject || !isPantryConnected) {
      if (!silent) setPantryStatus("No project or Pantry connection")
      return
    }

    setIsSavingToPantry(true)
    if (!silent) setPantryStatus("Saving to Pantry...")

    try {
      const projectData = {
        ...currentProject,
        lastSynced: new Date().toISOString(),
        syncedBy: "sparrow-ai",
      }

      const response = await fetch(pantryUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        if (!silent) {
          setPantryStatus("Project saved to Pantry successfully!")
          setTimeout(() => setPantryStatus(""), 3000)
        }
      } else {
        setPantryStatus("Failed to save to Pantry")
        setTimeout(() => setPantryStatus(""), 3000)
      }
    } catch (error) {
      setPantryStatus("Save failed. Check your connection.")
      setTimeout(() => setPantryStatus(""), 3000)
    } finally {
      setIsSavingToPantry(false)
    }
  }

  const loadFromPantry = async () => {
    if (!isPantryConnected) {
      setPantryStatus("Not connected to Pantry")
      return
    }

    setIsLoadingFromPantry(true)
    setPantryStatus("Loading from Pantry...")

    try {
      const response = await fetch(pantryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const projectData = await response.json()

        // Convert dates back to Date objects
        const project: Project = {
          ...projectData,
          createdAt: new Date(projectData.createdAt),
          lastModified: new Date(projectData.lastModified),
          files: projectData.files.map((f: any) => ({
            ...f,
            lastModified: new Date(f.lastModified),
          })),
        }

        onProjectUpdate(project)
        setPantryStatus("Project loaded from Pantry successfully!")
        setTimeout(() => setPantryStatus(""), 3000)
      } else if (response.status === 404) {
        setPantryStatus("No project found in Pantry")
        setTimeout(() => setPantryStatus(""), 3000)
      } else {
        setPantryStatus("Failed to load from Pantry")
        setTimeout(() => setPantryStatus(""), 3000)
      }
    } catch (error) {
      setPantryStatus("Load failed. Check your connection.")
      setTimeout(() => setPantryStatus(""), 3000)
    } finally {
      setIsLoadingFromPantry(false)
    }
  }

  const generateDeployUrl = () => {
    if (!currentProject || !isPantryConnected) return null

    // Create a unique deploy URL based on project and pantry
    const projectSlug = currentProject.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const pantryId = pantryUrl.split("/pantry/")[1]?.split("/")[0]
    const basketName = pantryUrl.split("/basket/")[1]

    return `${window.location.origin}/deploy/${pantryId}/${basketName}/${projectSlug}`
  }

  const deployToSparrow = async () => {
    if (!currentProject || !isPantryConnected) {
      setPantryStatus("Need project and Pantry connection to deploy")
      return
    }

    setPantryStatus("Deploying project...")

    // First save to Pantry
    await saveToPantry()

    const generatedUrl = generateDeployUrl()
    if (generatedUrl) {
      setDeployUrl(generatedUrl)
      setIsDeployed(true)
      setPantryStatus("Project deployed successfully!")
      setTimeout(() => setPantryStatus(""), 3000)
    }
  }

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
            <Button
              onClick={() => setIsShowingPantrySetup(!isShowingPantrySetup)}
              variant="outline"
              className={`border-gray-600 text-white bg-transparent ${isPantryConnected ? "border-green-600 text-green-400" : ""}`}
            >
              {isPantryConnected ? <Cloud className="w-4 h-4 mr-2" /> : <CloudOff className="w-4 h-4 mr-2" />}
              {isPantryConnected ? "Cloud Connected" : "Connect Cloud"}
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {isShowingPantrySetup && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Cloud Storage Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Connect to Pantry for cloud storage and deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isPantryConnected ? (
                <>
                  <div>
                    <Label htmlFor="pantry-url" className="text-white">
                      Pantry Basket URL
                    </Label>
                    <Input
                      id="pantry-url"
                      value={pantryUrl}
                      onChange={(e) => setPantryUrl(e.target.value)}
                      placeholder="https://getpantry.cloud/apiv1/pantry/YOUR_ID/basket/YOUR_BASKET"
                      className="bg-gray-900 border-gray-600 text-white"
                    />
                    <div className="mt-2 text-sm text-gray-400 space-y-1">
                      <p className="font-medium text-gray-300">How to get your Pantry basket URL:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>
                          Visit{" "}
                          <a
                            href="https://getpantry.cloud"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            getpantry.cloud
                          </a>
                        </li>
                        <li>Create a new pantry (you'll get a unique pantry ID)</li>
                        <li>Create a basket with any name (e.g., "myproject")</li>
                        <li>Copy the full basket URL from the dashboard</li>
                        <li>Paste it above to connect your cloud storage</li>
                      </ol>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Tip: Your URL should look like:
                        https://getpantry.cloud/apiv1/pantry/[your-id]/basket/[basket-name]
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={connectToPantry} className="bg-green-600 hover:bg-green-700 text-white">
                      <Cloud className="w-4 h-4 mr-2" />
                      Connect to Pantry
                    </Button>
                    <Button
                      onClick={() => setIsShowingPantrySetup(false)}
                      variant="outline"
                      className="border-gray-600 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 flex items-center">
                      <Cloud className="w-4 h-4 mr-2" />
                      Connected to Pantry
                    </span>
                    <Button
                      onClick={disconnectFromPantry}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Auto-sync changes</span>
                    <Button
                      onClick={toggleAutoSync}
                      variant="outline"
                      className={`${autoSyncEnabled ? "border-green-600 text-green-400" : "border-gray-600 text-gray-400"} bg-transparent`}
                      size="sm"
                    >
                      {autoSyncEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              )}
              {pantryStatus && (
                <div className="text-sm text-blue-400 bg-blue-900/20 px-3 py-1 rounded">{pantryStatus}</div>
              )}
            </CardContent>
          </Card>
        )}

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
                      <CardTitle className="text-white text-xl flex items-center">
                        {currentProject.name}
                        {autoSyncEnabled && isPantryConnected && (
                          <Cloud className="w-4 h-4 ml-2 text-green-400" title="Auto-sync enabled" />
                        )}
                      </CardTitle>
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
                {isPantryConnected && (
                  <>
                    <Button
                      onClick={deployToSparrow}
                      disabled={!currentProject?.files.length || isDeployed}
                      className={`${isDeployed ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"} text-white`}
                      size="sm"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      {isDeployed ? "Deployed" : "Deploy with Sparrow"}
                    </Button>

                    <Button
                      onClick={() => saveToPantry()}
                      disabled={isSavingToPantry || !currentProject?.files.length}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <Cloud className="w-4 h-4 mr-2" />
                      {isSavingToPantry ? "Saving..." : "Save to Cloud"}
                    </Button>

                    <Button
                      onClick={loadFromPantry}
                      disabled={isLoadingFromPantry}
                      variant="outline"
                      className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white bg-transparent"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isLoadingFromPantry ? "Loading..." : "Load from Cloud"}
                    </Button>
                  </>
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

              {/* Deploy URL */}
              {deployUrl && (
                <div className="bg-green-900/20 border border-green-600 rounded p-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Deploy URL:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={deployUrl}
                      readOnly
                      className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(deployUrl)
                        setPantryStatus("URL copied to clipboard!")
                        setTimeout(() => setPantryStatus(""), 2000)
                      }}
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => window.open(deployUrl, "_blank")}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {pantryStatus && (
                <div className="text-sm text-blue-400 bg-blue-900/20 px-3 py-1 rounded">{pantryStatus}</div>
              )}
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
                {isPantryConnected && (
                  <Button
                    onClick={loadFromPantry}
                    disabled={isLoadingFromPantry}
                    variant="outline"
                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white bg-transparent"
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    {isLoadingFromPantry ? "Loading..." : "Load from Cloud"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}
