export type ProjectStatus = 'Completed' | 'In Progress'

export interface Project {
  slug: string
  title: string
  description: string
  techUsed: string[]
  images: string[]
  liveLink?: string
  githubLink?: string
  status: ProjectStatus
  details: {
    overview: string
    problem: string
    solution: string
    features: string[]
  }
}

export const projects: Project[] = [
  {
    slug: 'sharepoint-marketplace',
    title: 'SharePoint Marketplace',
    description:
      'Internal marketplace built to extend a Donation Centre storefront beyond Facebook Marketplace, enabling organization-wide visibility, streamlined reservations, and centralized inventory management.',

    techUsed: [
      'SharePoint Framework (SPFx)',
      'React',
      'Microsoft Entra ID',
      'Azure Groups',
      'SharePoint Lists',
      'PnPjs',
      'PnP PowerShell',
      'Power Automate',
      'Microsoft Teams',
    ],

    images: [
      '/images/projects/sharepoint-marketplace/listings.png',
      '/images/projects/sharepoint-marketplace/reservation.png',
      '/images/projects/sharepoint-marketplace/dashboard.png',
    ],

    status: 'In Progress',

    details: {
      overview:
        'A role-based internal marketplace designed to promote Donation Centre resale items across the organization, replacing reliance on external platforms and improving operational efficiency.',

      problem:
        'Resale items were primarily advertised through a small physical storefront and Facebook Marketplace, resulting in high visibility to external audiences while internal staff had little to no awareness of available items. Inventory tracking and request handling were manual, inconsistent, and inefficient, with no centralized internal system.',

      solution:
        'Built a SharePoint-based internal marketplace using SPFx, React, and PnPjs that enables staff across the organization to browse items, submit reservation requests, and receive automated updates, while staff and managers manage listings, approvals, and inventory through role-based workflows.',

      features: [
        'Organization-wide visibility of Donation Centre items',
        'Role-based access (Customer, Staff, Manager) using Azure Groups',
        'Browse, search, and filter listings',
        'Reservation system with approval workflow',
        'Automated notifications for approvals and pickups',
        'Inventory tracking with real-time status updates',
        'Multi-image listing support (up to 10 images)',
        'Analytics dashboard for sales trends',
        'Activity logging for system monitoring',
        'User profile with role-based UI',
        'Secure, internal Microsoft environment (no public exposure)',
      ],
    },
  },
]