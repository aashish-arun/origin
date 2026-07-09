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

export type TechCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Microsoft 365'
  | 'DevOps'
  | 'Design'
  | 'Infrastructure'

export const techCategories: Record<TechCategory, string[]> = {
  Frontend: [
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'React Native',
    'Tailwind CSS',
    'Fluent UI',
  ],

  Backend: ['Node.js', 'Java', 'C#', 'Python', 'Oracle APEX'],

  Database: [
    'SQL',
    'PL/SQL',
    'MySQL',
    'Oracle Database',
    'Supabase',
    'Firebase',
    'SharePoint Lists',
    'HeidiSQL',
  ],

  'Microsoft 365': [
    'SharePoint Framework',
    'SharePoint',
    'Microsoft Teams',
    'Power Automate',
    'Microsoft Entra ID',
    'SharePoint Groups',
    'PnPjs',
    'PnP PowerShell',
  ],

  DevOps: ['Git', 'GitHub', 'Docker', 'Vercel'],

  Design: ['Figma', 'Software Ideas Modeler'],

  Infrastructure: ['Windows', 'Windows Server', 'Linux', 'Linux Server'],
}

export const featuredTech: string[] = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'Python',
  'C#',
  'SQL',
  'Supabase',
  'SharePoint Framework',
  'Microsoft 365',
  'Power Automate',
  'Git',
  'GitHub',
  'Docker',
  'Vercel',
]

export const techMeta: Record<string, string> = {
  HTML: 'Markup',
  CSS: 'Styling',
  JavaScript: 'Programming Language',
  TypeScript: 'Programming Language',
  React: 'Frontend Library',
  'Next.js': 'React Framework',
  'React Native': 'Mobile Framework',
  'Tailwind CSS': 'CSS Framework',
  'Fluent UI': 'UI Library',

  'Node.js': 'Backend Runtime',
  Java: 'Programming Language',
  'C#': 'Programming Language',
  Python: 'Programming Language',
  'Oracle APEX': 'Low-Code Platform',

  SQL: 'Query Language',
  'PL/SQL': 'Oracle SQL',
  MySQL: 'Relational Database',
  'Oracle Database': 'Enterprise Database',
  Supabase: 'Backend Platform',
  Firebase: 'Backend Platform',
  'SharePoint Lists': 'Data Storage',
  HeidiSQL: 'Database Tool',

  'Microsoft 365': 'Enterprise Platform',
  'SharePoint Framework': 'SPFx Development',
  SharePoint: 'Collaboration Platform',
  'Microsoft Teams': 'Collaboration Platform',
  'Power Automate': 'Workflow Automation',
  'Microsoft Entra ID': 'Identity Platform',
  'SharePoint Groups': 'Access Control',
  PnPjs: 'SharePoint Library',
  'PnP PowerShell': 'Admin Automation',

  Git: 'Version Control',
  GitHub: 'Code Hosting',
  Docker: 'Containerization',
  Vercel: 'Deployment Platform',

  Figma: 'Design Tool',
  'Software Ideas Modeler': 'Modeling Tool',

  Windows: 'Operating System',
  'Windows Server': 'Server OS',
  Linux: 'Operating System',
  'Linux Server': 'Server OS',
}

export const techIcons: Record<string, LucideIcon> = {
  HTML: Code,
  CSS: Paintbrush,
  JavaScript: Code,
  TypeScript: Code,
  React: Code,
  'Next.js': Code,
  'React Native': Code,
  'Tailwind CSS': Paintbrush,
  'Fluent UI': Paintbrush,

  'Node.js': Server,
  Java: Server,
  'C#': Server,
  Python: Server,
  'Oracle APEX': Database,

  SQL: Database,
  'PL/SQL': Database,
  MySQL: Database,
  'Oracle Database': Database,
  Supabase: Database,
  Firebase: Cloud,
  'SharePoint Lists': Boxes,
  HeidiSQL: Database,

  'Microsoft 365': Building2,
  'SharePoint Framework': Building2,
  SharePoint: Boxes,
  'Microsoft Teams': Users,
  'Power Automate': Workflow,
  'Microsoft Entra ID': ShieldCheck,
  'SharePoint Groups': Users,
  PnPjs: Cloud,
  'PnP PowerShell': Cloud,

  Git: GitBranch,
  GitHub: GitBranch,
  Docker: Cloud,
  Vercel: Cloud,

  Figma: Paintbrush,
  'Software Ideas Modeler': Cpu,

  Windows: Monitor,
  'Windows Server': Monitor,
  Linux: Monitor,
  'Linux Server': Monitor,
}