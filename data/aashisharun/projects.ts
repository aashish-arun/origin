export type ProjectStatus = "Completed" | "In Progress"

export interface ProjectImage {
  src: string
  title: string
  description?: string
}

export interface Project {
  slug: string
  title: string
  description: string
  techUsed: string[]
  images: ProjectImage[]
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
    slug: "sharepoint-marketplace",
    title: "SharePoint Marketplace",

    description:
      "Internal marketplace built to extend a Donation Centre storefront beyond Facebook Marketplace, enabling organization-wide visibility, streamlined reservations, and centralized inventory management.",

    techUsed: [
      "SharePoint Framework (SPFx)",
      "React",
      "Microsoft Entra ID",
      "Azure Groups",
      "SharePoint Lists",
      "PnPjs",
      "PnP PowerShell",
      "Power Automate",
      "Microsoft Teams",
    ],

    images: [
      {
        src: "/images/projects/sharepoint-marketplace/1.png",
        title: "Marketplace Listings",
        description:
          "Browse available Donation Centre items with search, category filters, pricing, stock availability, and detailed product information.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/2.png",
        title: "Reservation Request",
        description:
          "Customers select the desired quantity along with their preferred pickup date and time before submitting a reservation request.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/3.png",
        title: "Reservation Confirmation",
        description:
          "Confirmation dialog displayed after a reservation request has been successfully submitted.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/4.png",
        title: "Reservation Management Dashboard",
        description:
          "Staff dashboard for reviewing, searching, filtering, approving, rejecting, completing, and cancelling reservation requests.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/6.png",
        title: "Customer Reservation History",
        description:
          "Customers can view active reservations, monitor approval status, and review upcoming pickup details from their profile.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/7.png",
        title: "Complete Reservation Workflow",
        description:
          "Staff finalize reservations by confirming the final price, payment method, payment reference, and completion status.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/9.png",
        title: "Customer Transaction History",
        description:
          "Completed reservations are automatically converted into transaction records, allowing customers to review their purchase history.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/10.png",
        title: "Facebook Sales Management",
        description:
          "Staff can manually record Facebook Marketplace sales to maintain a unified transaction history and end-of-day reporting.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/12.png",
        title: "Bulk Listing Creation",
        description:
          "Create up to ten marketplace listings simultaneously, significantly reducing the time required to add new inventory.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/15.png",
        title: "User Role Management",
        description:
          "Administrators can assign and manage Customer, Staff, and Manager roles directly within the SharePoint environment.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/16.png",
        title: "Analytics Dashboard",
        description:
          "Interactive analytics and reporting dashboard with multiple filtering options for monitoring marketplace activity and sales trends.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/17.png",
        title: "System Health Dashboard",
        description:
          "Displays application health, configuration status, service availability, and overall system diagnostics.",
      },
      {
        src: "/images/projects/sharepoint-marketplace/18.png",
        title: "Activity Log",
        description:
          "Comprehensive audit log capturing important system events, user actions, administrative changes, and operational history.",
      },
    ],

    status: "In Progress",

    details: {
      overview:
        "A role-based internal marketplace designed to promote Donation Centre resale items across the organization while replacing reliance on external platforms and improving operational efficiency.",

      problem:
        "Inventory was managed manually and promoted mainly through a small physical storefront and Facebook Marketplace, giving internal staff little visibility into available items. Reservation handling, sales tracking, role management, and reporting were spread across manual processes with no centralized internal system.",

      solution:
        "Developed a SharePoint-based internal marketplace using SPFx, React, SharePoint Lists, PnPjs, Power Automate, Microsoft Teams, and Microsoft Entra ID to centralize listings, reservations, approvals, user roles, analytics, transactions, and operational monitoring.",

      features: [
        "Organization-wide inventory visibility",
        "Role-based access for Customers, Staff, and Managers",
        "Searchable and filterable listing interface",
        "Reservation request workflow",
        "Approval, rejection, cancellation, and completion flows",
        "Customer profile with active reservations and transaction history",
        "Manual Facebook Marketplace transaction entry",
        "Bulk listing creation for faster inventory intake",
        "Real-time inventory tracking",
        "Multi-image listing support",
        "Analytics and reporting dashboard",
        "System health dashboard",
        "Activity logging and audit history",
        "SharePoint role management",
        "Microsoft 365 and SharePoint integration",
      ],
    },
  },
]
