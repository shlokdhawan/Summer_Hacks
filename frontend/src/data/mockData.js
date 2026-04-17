export const channels = [
  { id: 'gmail', name: 'Gmail', icon: 'Mail', description: 'Personal and work email from Google', color: '#EA4335' },
  { id: 'slack', name: 'Slack', icon: 'MessageSquare', description: 'Internal team communication', color: '#4A154B' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'Phone', description: 'Direct messaging and group chats', color: '#25D366' },
  { id: 'telegram', name: 'Telegram', icon: 'Send', description: 'Secure broadcast and groups', color: '#0088CC' },
];

export const mockMessages = [
  {
    id: '1',
    source: 'gmail',
    sender: 'Sarah Jenkins',
    email: 'sarah.j@acmecorp.com',
    subject: 'Q3 Board Deck Final Revisions Needed',
    snippet: 'The board deck needs final approval by 2 PM EST. Sarah noted missing revenue projections on slide 14.',
    time: '10 mins ago',
    priority: 9,
    status: 'urgent',
    unread: true,
  },
  {
    id: '2',
    source: 'slack',
    sender: 'Design Team',
    email: '#general-ui',
    subject: 'New Color Tokens Merged',
    snippet: 'Mark merged the new dark mode color tokens into main. Minor updates to the button component shadows.',
    time: '1 hour ago',
    priority: 4,
    status: 'fyi',
    unread: false,
  },
  {
    id: '3',
    source: 'whatsapp',
    sender: 'Alex Mercer',
    email: '+1 (555) 0123',
    subject: 'Lunch next week?',
    snippet: 'Hey! Are we still on for lunch next Tuesday? Thinking of that Thai place on 5th.',
    time: '2 hours ago',
    priority: 2,
    status: 'none',
    unread: true,
  },
  {
    id: '4',
    source: 'telegram',
    sender: 'Crypto Devs',
    email: 'Telegram Group',
    subject: 'Mainnet Launch Update',
    snippet: 'The mainnet launch has been scheduled for Friday midnight. All nodes must upgrade to v2.1.',
    time: '4 hours ago',
    priority: 7,
    status: 'fyi',
    unread: false,
  },
  {
    id: '5',
    source: 'gmail',
    sender: 'GitHub',
    email: 'notifications@github.com',
    subject: '[curator-frontend] New Pull Request: Feature/onboarding',
    snippet: 'John Doe opened a new PR: "Implement 3-step onboarding flow". Review required.',
    time: '6 hours ago',
    priority: 6,
    status: 'urgent',
    unread: true,
  }
];

export const mockNotifications = [
  { id: 'n1', type: 'urgent', icon: 'AlertTriangle', title: 'Action Required', description: 'Board Deck revisions are overdue.', time: '5m ago', unread: true, group: 'Today' },
  { id: 'n2', type: 'mention', icon: 'AtSign', title: '@sarah mentioned you', description: 'Check the revenue tab in Sarah\'s sheet.', time: '1h ago', unread: true, group: 'Today' },
  { id: 'n3', type: 'system', icon: 'Bell', title: 'System Update', description: 'Curator AI v2.4 has been successfully deployed.', time: 'Yesterday', unread: false, group: 'Yesterday' },
  { id: 'n4', type: 'mention', icon: 'MessageCircle', title: 'New message from Alex', description: 'Waiting for your reply on Slack.', time: 'Yesterday', unread: false, group: 'Yesterday' },
];

export const mockContacts = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Product Manager',
    email: 'sarah.j@acmecorp.com',
    phone: '+1 (555) 342-1100',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    importance: 9,
    threads: 12,
    lastContact: 1,
    company: 'Acme Corp',
    tags: ['Decision Maker', 'Frequent'],
    stats: {
      responseTime: '2.5h',
      activeHours: [5, 12, 18, 15, 8, 4, 10], // Mock volume per 4h blocks or similar
      volume30d: [12, 15, 8, 22, 19, 14, 25], // Last 7 blocks
      toneBreakdown: { professional: 70, neutral: 20, urgent: 10 }
    }
  }
];

export const mockAnalysis = {
  summary: [
    'Sarah is requesting final approval for the Q3 Board Deck by 2 PM EST today.',
    'Revenue projections are missing on slide 14, which is a critical item.',
    'User growth charts on slide 18 need simplification to MAU vs DAU.',
    'Meeting with Finance at 1 PM could potentially provide the missing data.'
  ],
  entities: [
    { type: 'person', label: 'Sarah Jenkins', color: 'teal' },
    { type: 'date', label: 'Today, 2 PM EST', color: 'amber' },
    { type: 'amount', label: 'Q3 Revenue', color: 'green' },
    { type: 'action', label: 'Slide 14 Approval', color: 'red' }
  ],
  actions: [
    { icon: 'FileText', title: 'Update Slide 14', description: 'Add missing revenue projections after Finance sync.' },
    { icon: 'PieChart', title: 'Simplify Chart 18', description: 'Reduce density to show only MAU vs DAU.' },
    { icon: 'Send', title: 'Confirm Receipt', description: 'Tell Sarah you\'re on it and sync is at 1 PM.' }
  ],
  sentiment: [
    { label: 'Neutral', tone: 'neutral', time: '9:00 AM' },
    { label: 'Collaborative', tone: 'fyi', time: '10:00 AM' },
    { label: 'Urgent', tone: 'urgent', time: '10:42 AM' }
  ],
  related: [
    { id: 'r1', subject: 'Q2 Performance Review', time: '3 months ago' },
    { id: 'r2', subject: 'Finance Sync Notes', time: 'Yesterday' }
  ]
};
