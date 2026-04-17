export type ProjectCategory =
  | 'Status'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'DevOps'
  | 'Design'

export const projectFilters: Record<ProjectCategory, string[]> = {
  Status: ['Completed', 'In Progress'],

  Frontend: [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Next.js',
    'React Native',
    'Tailwind CSS',
    'TypeScript',
    'SharePoint Framework',
  ],

  Backend: [
    'Java',
    'C#',
    'Python',
    'Node.js',
    'Oracle APEX',
    'Firebase',
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
    'PnP PowerShell',
    'Microsoft Entra ID',
    'SharePoint Groups',
  ],

  Design: [
    'Figma',
    'Software Ideas Modular',
  ],
}