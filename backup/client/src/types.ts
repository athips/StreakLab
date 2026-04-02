export interface SessionEntry {
  task: string
  dur: string
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
  totalXP: number
  xpEarned: number
  focusMinutes: number
  sessionsDone: number
  distractionsPhone: number
  distractionsSocial: number
  sessionLog: SessionEntry[]
  streak: number
  profile: { name: string; handle: string; goal: string }
  settings: { reminder: boolean; freeze: boolean; sound: boolean }
  reviews: ReviewEntry[]
  lastDate: string
}

export type ScreenId =
  | 'dashboard'
  | 'habits'
  | 'focus'
  | 'morning'
  | 'energy'
  | 'review'
  | 'profile'
