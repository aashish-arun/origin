export type TimelineEventType = 'study' | 'work'

export type TimelineEvent = {
  startDate: string
  endDate: string
  type: TimelineEventType
  title: string
  achievements: string[]
}

export const timelineEvents: TimelineEvent[] = [
  {
    startDate: '2019-03-15',
    endDate: '2020-03-20',
    type: 'study',
    title: 'AISSE @ St. Thomas Central School',
    achievements: [],
  },
  {
    startDate: '2021-01-10',
    endDate: '2022-01-18',
    type: 'study',
    title: 'AISSCE @ St. Thomas Central School',
    achievements: [],
  },
  {
    startDate: '2022-08-01',
    endDate: '2023-10-15',
    type: 'work',
    title: 'Billing Clerk @ Kairali Fresh',
    achievements: [
      'Zero-error cash handling',
      'Excellent customer feedback',
      'Trained new staff members',
    ],
  },
  {
    startDate: '2023-11-05',
    endDate: '2024-07-01',
    type: 'work',
    title: 'Cashier @ 1000 Lights Food Court',
    achievements: [
      'Handled high-volume transactions',
      'Inventory assistance',
      'Employee of the Month',
    ],
  },
  {
    startDate: '2024-09-01',
    endDate: 'Present',
    type: 'study',
    title: 'Diploma in Software Development @ SAIT',
    achievements: [
      'Full-stack development projects',
      'Web & mobile applications',
      'Databases, APIs, and frameworks',
    ],
  },
  {
    startDate: '2024-11-20',
    endDate: 'Present',
    type: 'work',
    title: 'Gas Bar Clerk @ Calgary Co-op',
    achievements: [
      'Daily sales & cash management',
      'Customer service excellence',
      'Stock and safety operations',
    ],
  },
]

export const formatDate = (date: string): string =>
  date === 'Present'
    ? 'Present'
    : new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })