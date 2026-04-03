export interface SessionEntry {
  task: string
  dur: string
}

export type HabitFrequency = 'daily' | 'weekdays' | 'weekly'

export interface Habit {
  id: string
  name: string
  icon: string
  streak: number
  xp: number
  bg: string
  dot: string
  custom?: boolean
  freq?: HabitFrequency
}

export interface MoodEntry {
  val: number
  note: string
}

export interface ReviewEntry {
  week: number
  year: number
  grade: string
  pct: number
  wentWell: string
  improve: string
  next: string
  date: string
}

export type BookStatus = 'queued' | 'reading' | 'paused' | 'done'

export interface ReadingBook {
  id: string
  title: string
  author: string
  pages: number
  pagesRead: number
  status: BookStatus
  icon: string
  color: string
  notes?: string
  lastRead: string | null
  startedAt?: string
  finishedAt?: string
}

export type ProjectStatus = 'ideation' | 'building' | 'paused' | 'shipped' | 'archived'

export interface SideProject {
  id: string
  name: string
  desc: string
  status: ProjectStatus
  icon: string
  color: string
  tech: string[]
  repo?: string
  hours: number
  progress: number
  sessions: number
  goalHours: number
  lastWorked: string | null
}

export type SkillLevelId = 'queued' | 'exploring' | 'learning' | 'proficient'

export interface SkillMilestone {
  id: string
  text: string
  xp: number
  done: boolean
}

export interface SkillRoadmapItem {
  id: string
  name: string
  category: string
  level: SkillLevelId
  icon: string
  goal: string
  milestones: SkillMilestone[]
  progress: number
  hours: number
  sessions: number
  lastStudied: string | null
}

export interface AppState {
  checkedHabits: string[]
  checkedRoutine: string[]
  customHabits: Habit[]
  totalXP: number
  xpEarned: number
  focusMinutes: number
  sessionsDone: number
  distractionsPhone: number
  distractionsSocial: number
  sessionLog: SessionEntry[]
  streak: number
  profile: { name: string; handle: string; goal: string }
  settings: { reminder: boolean; freeze: boolean; sound: boolean; rescue: boolean }
  reviews: ReviewEntry[]
  moodLog: Record<string, MoodEntry>
  rescueDone: string[]
  rescueDismissed: boolean
  lastDate: string
  books: ReadingBook[]
  projects: SideProject[]
  skills: SkillRoadmapItem[]
  skillXP: number
}

export type ScreenId =
  | 'dashboard'
  | 'habits'
  | 'focus'
  | 'morning'
  | 'mood'
  | 'energy'
  | 'review'
  | 'profile'
  | 'reading'
  | 'projects'
  | 'skills'
