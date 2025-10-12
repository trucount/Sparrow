"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, RefreshCw, ExternalLink, Terminal, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ProjectFile } from "./workspace-area"

interface NextJSPreviewPanelProps {
  files: ProjectFile[]
}

export function NextJSPreviewPanel({ files }: NextJSPreviewPanelProps) {
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildOutput, setBuildOutput] = useState<string[]>([])
  const [deployedUrl, setDeployedUrl] = useState<string>("")
  const [showConsole, setShowConsole] = useState(false)

  const buildProject = async () => {
    setIsBuilding(true)
    setBuildOutput([])

    const outputs = [
      "Installing dependencies...",
      "npm install",
      "Installing react@19.0.0",
      "Installing next@15.2.4",
      "Dependencies installed successfully",
      "",
      "Building Next.js application...",
      "npm run build",
      "Creating optimized production build...",
      "Compiling pages...",
      "✓ Compiled successfully",
      "Collecting page data...",
      "Generating static pages (0/3)",
      "Generating static pages (3/3)",
      "Finalizing page optimization...",
      "",
      "Build completed successfully!",
      "Ready to deploy"
    ]

    for (let i = 0; i < outputs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setBuildOutput(prev => [...prev, outputs[i]])
    }

    setIsBuilding(false)
  }

  const installPackage = async (packageName: string) => {
    setBuildOutput(prev => [...prev, "", `Installing ${packageName}...`, `npm install ${packageName}`, `✓ ${packageName} installed successfully`])
  }

  const runCommand = async (command: string) => {
    setBuildOutput(prev => [...prev, "", `Running: ${command}`, "..."])
    await new Promise(resolve => setTimeout(resolve, 1000))
    setBuildOutput(prev => [...prev, `✓ Command completed`])
  }

  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center"
      >
        <div className="text-center text-gray-400">
          <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Next.js Preview</p>
          <p className="text-sm">Start a conversation to generate your Next.js app</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 bg-gray-900 rounded-lg border border-gray-800 flex flex-col"
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-200">Next.js Preview</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={buildProject}
              disabled={isBuilding}
              className="text-gray-400 hover:text-gray-200"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isBuilding ? "animate-spin" : ""}`} />
              Build
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowConsole(!showConsole)}
              className="text-gray-400 hover:text-gray-200"
            >
              <Terminal className="w-4 h-4 mr-1" />
              Console
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Next.js Application</h3>
            <p className="text-gray-400 mb-6">{files.length} files in project</p>

            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={buildProject}
                disabled={isBuilding}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isBuilding ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Building...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Build Project
                  </>
                )}
              </Button>
              {deployedUrl && (
                <Button
                  onClick={() => window.open(deployedUrl, "_blank")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open App
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {showConsole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-64 bg-gray-950 rounded-lg border border-gray-800 flex flex-col"
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-200">Console</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setBuildOutput([])}
              className="text-gray-400 hover:text-gray-200"
            >
              Clear
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="font-mono text-sm space-y-1">
              {buildOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.startsWith("✓")
                      ? "text-green-400"
                      : line.startsWith("npm") || line.startsWith("Running")
                      ? "text-blue-400"
                      : "text-gray-300"
                  }`}
                >
                  {line || "\u00A0"}
                </div>
              ))}
              {isBuilding && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-gray-400"
                >
                  ▋
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </div>
  )
}
