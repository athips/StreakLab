import type { ReadingBook, SideProject, SkillLevelId, SkillRoadmapItem } from './types'

export const BOOK_COLORS = [
  '#60a5fa',
  '#4ade80',
  '#c084fc',
  '#fb923c',
  '#f472b6',
  '#fbbf24',
  '#34d399',
  '#f87171',
] as const

export const BOOK_ICONS = ['📗', '📘', '📙', '📕', '📔', '📒', '📚', '🔖'] as const

export const PROJ_STATUSES = [
  { id: 'building' as const, label: 'Building', color: '#60a5fa', bg: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)' },
  { id: 'shipped' as const, label: 'Shipped', color: '#4ade80', bg: 'rgba(74,222,128,.1)', border: 'rgba(74,222,128,.3)' },
  { id: 'paused' as const, label: 'Paused', color: '#fbbf24', bg: 'rgba(251,191,36,.1)', border: 'rgba(251,191,36,.3)' },
  { id: 'ideation' as const, label: 'Ideation', color: '#c084fc', bg: 'rgba(192,132,252,.1)', border: 'rgba(192,132,252,.3)' },
  { id: 'archived' as const, label: 'Archived', color: 'rgba(255,255,255,.25)', bg: 'rgba(255,255,255,.04)', border: 'rgba(255,255,255,.08)' },
]

export const SKILL_LEVELS: {
  id: SkillLevelId
  label: string
  color: string
  bg: string
  border: string
}[] = [
  { id: 'queued', label: 'Queued', color: 'rgba(255,255,255,.25)', bg: 'rgba(255,255,255,.05)', border: 'rgba(255,255,255,.1)' },
  { id: 'exploring', label: 'Exploring', color: '#fbbf24', bg: 'rgba(251,191,36,.1)', border: 'rgba(251,191,36,.3)' },
  { id: 'learning', label: 'Learning', color: '#60a5fa', bg: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)' },
  { id: 'proficient', label: 'Proficient', color: '#4ade80', bg: 'rgba(74,222,128,.1)', border: 'rgba(74,222,128,.3)' },
]

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'DevOps',
  'Database',
  'Mobile',
  'Language',
  'AI/ML',
  'Other',
] as const

export const SAMPLE_BOOKS: ReadingBook[] = [
  {
    id: 'b1',
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt',
    pages: 352,
    pagesRead: 180,
    status: 'reading',
    icon: '📗',
    color: '#60a5fa',
    lastRead: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'b2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    pages: 431,
    pagesRead: 431,
    status: 'done',
    icon: '📘',
    color: '#4ade80',
    finishedAt: new Date().toISOString(),
    lastRead: new Date().toISOString(),
  },
  {
    id: 'b3',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    pages: 562,
    pagesRead: 0,
    status: 'queued',
    icon: '📙',
    color: '#c084fc',
    lastRead: null,
  },
  {
    id: 'b4',
    title: "You Don't Know JS",
    author: 'Kyle Simpson',
    pages: 278,
    pagesRead: 80,
    status: 'reading',
    icon: '📕',
    color: '#fbbf24',
    lastRead: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
]

export const SAMPLE_PROJECTS: SideProject[] = [
  {
    id: 'p1',
    name: 'StreakOS',
    desc: 'Personal life operating system for developers',
    status: 'building',
    icon: '🚀',
    color: '#7c3aed',
    tech: ['HTML', 'CSS', 'JS'],
    hours: 24,
    progress: 65,
    sessions: 12,
    goalHours: 5,
    lastWorked: new Date(Date.now() - 86400000 * 1).toISOString(),
    repo: '',
  },
  {
    id: 'p2',
    name: 'Dev Portfolio v2',
    desc: 'Redesigned personal portfolio with case studies',
    status: 'paused',
    icon: '🎨',
    color: '#60a5fa',
    tech: ['Next.js', 'Tailwind', 'Framer'],
    hours: 8,
    progress: 30,
    sessions: 4,
    goalHours: 3,
    lastWorked: new Date(Date.now() - 86400000 * 7).toISOString(),
    repo: '',
  },
  {
    id: 'p3',
    name: 'CLI Task Manager',
    desc: 'A minimal terminal-based task tracker in Rust',
    status: 'ideation',
    icon: '🦀',
    color: '#fb923c',
    tech: ['Rust'],
    hours: 0,
    progress: 0,
    sessions: 0,
    goalHours: 4,
    lastWorked: null,
    repo: '',
  },
]

export const SAMPLE_SKILLS: SkillRoadmapItem[] = [
  {
    id: 'sk1',
    name: 'TypeScript',
    category: 'Frontend',
    level: 'learning',
    icon: '🔷',
    goal: 'Build 2 full projects',
    hours: 18,
    sessions: 9,
    progress: 50,
    lastStudied: new Date(Date.now() - 86400000 * 2).toISOString(),
    milestones: [
      { id: 'm1', text: 'Complete official handbook', xp: 20, done: true },
      { id: 'm2', text: 'Type a full REST API', xp: 30, done: true },
      { id: 'm3', text: 'Use generics & utility types', xp: 25, done: false },
      { id: 'm4', text: 'Build with strict mode enabled', xp: 20, done: false },
    ],
  },
  {
    id: 'sk2',
    name: 'PostgreSQL',
    category: 'Database',
    level: 'exploring',
    icon: '🐘',
    goal: 'Design a production schema',
    hours: 6,
    sessions: 4,
    progress: 25,
    lastStudied: new Date(Date.now() - 86400000 * 4).toISOString(),
    milestones: [
      { id: 'm5', text: 'Learn joins & aggregations', xp: 15, done: true },
      { id: 'm6', text: 'Set up indexing strategy', xp: 20, done: false },
      { id: 'm7', text: 'Write a complex migration', xp: 25, done: false },
    ],
  },
  {
    id: 'sk3',
    name: 'Rust',
    category: 'Backend',
    level: 'queued',
    icon: '🦀',
    goal: 'Write a CLI tool from scratch',
    hours: 0,
    sessions: 0,
    progress: 0,
    lastStudied: null,
    milestones: [
      { id: 'm8', text: 'Read "The Book" ch. 1–6', xp: 20, done: false },
      { id: 'm9', text: 'Understand ownership model', xp: 30, done: false },
      { id: 'm10', text: 'Build a CLI with clap', xp: 25, done: false },
    ],
  },
  {
    id: 'sk4',
    name: 'System Design',
    category: 'Backend',
    level: 'learning',
    icon: '🏗️',
    goal: 'Design 5 real systems end-to-end',
    hours: 12,
    sessions: 6,
    progress: 40,
    lastStudied: new Date(Date.now() - 86400000 * 1).toISOString(),
    milestones: [
      { id: 'm11', text: 'URL shortener deep-dive', xp: 15, done: true },
      { id: 'm12', text: 'Design a rate limiter', xp: 20, done: true },
      { id: 'm13', text: 'Distributed caching layer', xp: 25, done: false },
      { id: 'm14', text: 'Design Slack/messaging system', xp: 30, done: false },
    ],
  },
]

export function levelFromMilestoneProgress(donePct: number): SkillLevelId {
  if (donePct >= 100) return 'proficient'
  if (donePct >= 50) return 'learning'
  if (donePct > 0) return 'exploring'
  return 'queued'
}

export function randomBookColor(): string {
  return BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)]
}
