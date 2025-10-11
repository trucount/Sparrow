"use client"

import { motion } from "framer-motion"
import { Activity, FileText, Code, Clock, FolderOpen } from "lucide-react"
import type { ProjectFile, Project } from "./workspace-area"

interface StatusPanelProps {
  files: ProjectFile[]
  project: Project | null
}

export function StatusPanel({ files, project }: StatusPanelProps) {
  const getTotalLines = () => {
    return files.reduce((total, file) => {
      return total + file.content.split("\n").length
    }, 0)
  }

  const getLanguageStats = () => {
    const stats: Record<string, number> = {}
    files.forEach((file) => {
      stats[file.language] = (stats[file.language] || 0) + 1
    })
    return stats
  }

  const getRecentFiles = () => {
    return [...files]
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 5)
  }

  const languageStats = getLanguageStats()
  const recentFiles = getRecentFiles()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 p-4 overflow-auto"
    >
      <div className="space-y-6">
        {/* Console */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Console
          </h3>
          <div className="bg-black rounded p-4 font-mono text-sm min-h-32 max-h-48 overflow-y-auto">
            <div className="text-green-400">Sparrow AI v1.0.0</div>
            <div className="text-gray-400">Ready to assist with your coding projects</div>
            {project && (
              <>
                <div className="text-blue-400 mt-2">Project: {project.name}</div>
                <div className="text-gray-400">{files.length} file(s) loaded</div>
                <div className="text-gray-400">Last modified: {project.lastModified.toLocaleString()}</div>
              </>
            )}
            {files.length > 0 && <div className="text-green-400 mt-1">All files synchronized</div>}
          </div>
        </div>

        {/* Project Info */}
        {project && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              Project Information
            </h3>
            <div className="bg-gray-800 rounded p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">{project.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Created:</span>
                <span className="text-white">{project.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Modified:</span>
                <span className="text-white">{project.lastModified.toLocaleString()}</span>
              </div>
              {project.description && (
                <div>
                  <span className="text-gray-400">Description:</span>
                  <p className="text-white mt-1 text-sm">{project.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Project Stats */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Project Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 p-4 rounded-lg"
            >
              <div className="text-2xl font-bold text-white">{files.length}</div>
              <div className="text-sm text-gray-400">Files Generated</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 p-4 rounded-lg"
            >
              <div className="text-2xl font-bold text-white">{getTotalLines()}</div>
              <div className="text-sm text-gray-400">Lines of Code</div>
            </motion.div>
          </div>
        </div>

        {/* Language Breakdown */}
        {Object.keys(languageStats).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Languages Used
            </h3>
            <div className="space-y-2">
              {Object.entries(languageStats).map(([language, count]) => (
                <motion.div
                  key={language}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center justify-between bg-gray-800 p-3 rounded"
                >
                  <span className="text-white capitalize">{language}</span>
                  <span className="text-gray-400">
                    {count} file{count > 1 ? "s" : ""}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentFiles.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-2">
              {recentFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-3 text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(file.lastModified).toLocaleTimeString()}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
