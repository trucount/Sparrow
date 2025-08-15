"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FolderPlus, Download, Upload, Save, Trash2, Copy, FileText, Calendar, Clock, Code } from "lucide-react"
import type { Project } from "./workspace-area"

interface ProjectManagerProps {
  currentProject: Project | null
  onProjectCreate: (name: string, description: string) => void
  onProjectUpdate: (project: Project) => void
}

export function ProjectManager({ currentProject, onProjectCreate, onProjectUpdate }: ProjectManagerProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

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
