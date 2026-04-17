export type TechCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'DevOps'
  | 'Design'
  | 'OS'

export const techCategories: Record<TechCategory, string[]> = {
  Frontend: [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Next.js',
    'React Native',
    'Tailwind CSS',
    'TypeScript',
    'Fluent UI',
    'SharePoint Framework',
  ],

  Backend: [
    'Java',
    'C#',
    'Python',
    'Oracle APEX',
    'Firebase',
    'Node.js',
    'Power Automate',
    'Microsoft Teams',
  ],

  Database: [
    'MySQL',
    'Oracle Database',
    'SQL',
    'PL/SQL',
    'HeidiSQL',
    'SharePoint',
  ],

  DevOps: [
    'Git',
    'GitHub',
    'Docker',
    'PnPjs',
    'Microsoft Entra ID',
    'SharePoint Groups',
    'PnP PowerShell',
  ],

  Design: [
    'Figma',
    'Software Ideas Modular',
  ],

  OS: [
    'Windows',
    'Windows Server',
    'Linux',
    'Linux Server',
  ],
}

export const allTech: string[] = [
  ...new Set(Object.values(techCategories).flat()),
]