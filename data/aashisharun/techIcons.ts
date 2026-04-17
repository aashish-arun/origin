import type { LucideIcon } from 'lucide-react'
import {
  Code,
  Paintbrush,
  Server,
  Database,
  GitBranch,
  Cloud,
  Cpu,
  Monitor,
  Building2,
  ShieldCheck,
  Users,
  Workflow,
  Boxes,
} from 'lucide-react'

export type CategoryIconKey =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'DevOps'
  | 'Design'
  | 'OS'

export const categoryIcons: Record<CategoryIconKey, LucideIcon> = {
  Frontend: Code,
  Backend: Server,
  Database: Database,
  DevOps: Cloud,
  Design: Paintbrush,
  OS: Monitor,
}

export const techIcons: Record<string, LucideIcon> = {
  // Frontend
  HTML: Code,
  CSS: Paintbrush,
  JavaScript: Code,
  React: Code,
  'Next.js': Code,
  'React Native': Code,
  'Tailwind CSS': Paintbrush,
  TypeScript: Code,
  'Fluent UI': Paintbrush,
  'SharePoint Framework': Building2,

  // Backend
  Java: Server,
  'C#': Server,
  Python: Server,
  'Node.js': Server,
  'Oracle APEX': Database,
  Firebase: Cloud,
  'Power Automate': Workflow,
  'Microsoft Teams': Users,

  // Database
  MySQL: Database,
  'Oracle Database': Database,
  SQL: Database,
  'PL/SQL': Database,
  HeidiSQL: Database,
  SharePoint: Boxes,

  // DevOps
  Git: GitBranch,
  GitHub: Code,
  Docker: Cloud,
  PnPjs: Cloud,
  'Microsoft Entra ID': ShieldCheck,
  'SharePoint Groups': Users,
  'PnP PowerShell': Cloud,

  // Design
  Figma: Paintbrush,
  'Software Ideas Modular': Cpu,

  // OS
  Windows: Monitor,
  'Windows Server': Monitor,
  Linux: Monitor,
  'Linux Server': Monitor,
}