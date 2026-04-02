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
