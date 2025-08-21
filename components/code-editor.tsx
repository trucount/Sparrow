"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { File, FileText, Globe, Palette, Settings, Copy, Download, Trash2, Edit3, Plus, Save, X, Loader2, AlertCircle } from "lucide-react"
import { Code } from "lucide-react"
import type { ProjectFile } from "./workspace-area"

interface CodeEditorProps {
  files: ProjectFile[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileUpdate: (fileId: string, content: string) => void
  onFileDelete: (fileId: string) => void
  onFileRename: (fileId: string, newName: string) => void
}

export function CodeEditor({
  files,
  activeFileId,
  onFileSelect,
  onFileUpdate,
  onFileDelete,
  onFileRename,
}: CodeEditorProps) {
  const [editorContent, setEditorContent] = useState("")
  const [editingFileId, setEditingFileId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [newFileName, setNewFileName] = useState("")

  const activeFile = files.find((f) => f.id === activeFileId)

  useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content)
    }
  }, [activeFile])

  const handleContentChange = (content: string) => {
    setEditorContent(content)
    if (activeFileId) {
      onFileUpdate(activeFileId, content)
    }
  }

  const startRename = (file: ProjectFile) => {
    setEditingFileId(file.id)
    setEditingName(file.name)
  }

  const confirmRename = () => {
    if (editingFileId && editingName.trim()) {
      onFileRename(editingFileId, editingName.trim())
    }
    setEditingFileId(null)
    setEditingName("")
  }

  const cancelRename = () => {
    setEditingFileId(null)
    setEditingName("")
  }

  const createNewFile = () => {
    if (newFileName.trim()) {
      const fileId = newFileName.replace(/[^a-zA-Z0-9]/g, "_")
      const language = getLanguageFromFilename(newFileName)

      // Trigger file creation through the parent component
      window.dispatchEvent(
        new CustomEvent("codeGenerated", {
          detail: {
            code: `// New ${language} file\n`,
            language,
            filename: newFileName.trim(),
          },
        }),
      )
    }
    setIsCreatingFile(false)
    setNewFileName("")
  }

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      html: "html",
      css: "css",
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      json: "json",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
    }
    return languageMap[ext || ""] || "text"
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "html":
        return <Globe className="w-4 h-4 text-orange-400" />
      case "css":
        return <Palette className="w-4 h-4 text-blue-400" />
      case "js":
      case "jsx":
        return <FileText className="w-4 h-4 text-yellow-400" />
      case "ts":
      case "tsx":
        return <FileText className="w-4 h-4 text-blue-500" />
      case "json":
        return <Settings className="w-4 h-4 text-green-400" />
      default:
        return <File className="w-4 h-4 text-gray-400" />
    }
  }

  const copyToClipboard = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content)
    }
  }

  const downloadFile = () => {
    if (activeFile) {
      const blob = new Blob([activeFile.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = activeFile.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center"
      >
        <div className="text-center text-gray-500">
          <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No code generated yet</p>
          <p className="text-sm">Ask Sparrow to create some code for you</p>
          <Button
            onClick={() => setIsCreatingFile(true)}
            className="mt-4 bg-white text-black hover:bg-gray-200"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create File
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 flex"
    >
      {/* File Tabs */}
      <div className="w-64 border-r border-gray-700 flex flex-col">
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Files</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsCreatingFile(true)}
            className="text-gray-400 hover:text-white p-1"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* New File Creation */}
        {isCreatingFile && (
          <div className="p-2 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="filename.ext"
                className="text-xs bg-gray-800 border-gray-600"
                onKeyPress={(e) => {
                  if (e.key === "Enter") createNewFile()
                  if (e.key === "Escape") {
                    setIsCreatingFile(false)
                    setNewFileName("")
                  }
                }}
                autoFocus
              />
              <Button size="sm" onClick={createNewFile} className="p-1">
                <Save className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsCreatingFile(false)
                  setNewFileName("")
                }}
                className="p-1"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`group flex items-center space-x-2 p-2 rounded transition-colors ${
                  activeFileId === file.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {editingFileId === file.id ? (
                  <div className="flex items-center space-x-1 flex-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="text-xs bg-gray-800 border-gray-600 h-6"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") confirmRename()
                        if (e.key === "Escape") cancelRename()
                      }}
                      onBlur={confirmRename}
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onFileSelect(file.id)}
                      className={`flex items-center space-x-2 flex-1 text-left ${
                        isFileBlankOrIncomplete(file) ? 'opacity-60' : ''
                      }`}
                    >
                      {getFileIcon(file.name)}
                      <span className="truncate text-sm flex items-center">
                        {file.name}
                        {isFileBlankOrIncomplete(file) && (
                          <AlertCircle className="w-3 h-3 ml-1 text-yellow-400" title="File is incomplete" />
                        )}
                      </span>
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => startRename(file)} className="p-1 h-6 w-6">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onFileDelete(file.id)}
                        className="p-1 h-6 w-6 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        {activeFile && (
          <>
            {/* Editor Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                {getFileIcon(activeFile.name)}
                <span className="text-white font-medium">{activeFile.name}</span>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{activeFile.language}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" onClick={copyToClipboard} className="text-gray-400 hover:text-white">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={downloadFile} className="text-gray-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-4">
              <textarea
                value={editorContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full bg-black text-white font-mono text-sm p-4 rounded border border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
                placeholder="Your code will appear here..."
                spellCheck={false}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
