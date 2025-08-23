import type { Project } from "./workspace-area"

export interface ProjectManagerProps {
  currentProject: Project | null
  onProjectCreate: (name: string, description?: string) => void
  onProjectUpdate: (project: Project) => void
}