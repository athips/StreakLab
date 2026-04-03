/* eslint react-refresh/only-export-components: off */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  SAMPLE_BOOKS,
  SAMPLE_PROJECTS,
  SAMPLE_SKILLS,
  levelFromMilestoneProgress,
} from '../devNativeData'
import { HABITS, ROUTINE, STORAGE_KEY } from '../constants'
import type {
  AppState,
  ReadingBook,
  ReviewEntry,
  SessionEntry,
  SideProject,
  SkillRoadmapItem,
} from '../types'

const defaultState = (): AppState => ({
  checkedHabits: [],
  checkedRoutine: [],
  customHabits: [],
  totalXP: 0,
  xpEarned: 0,
  focusMinutes: 0,
  sessionsDone: 0,
  distractionsPhone: 2,
  distractionsSocial: 1,
  sessionLog: [],
  streak: 14,
  profile: { name: '', handle: '', goal: '' },
  settings: { reminder: true, freeze: false, sound: true, rescue: true },
  reviews: [],
  moodLog: {},
  rescueDone: [],
  rescueDismissed: false,
  lastDate: '',
  books: [],
  projects: [],
  skills: [],
  skillXP: 0,
})

function ensureDevSamples(s: AppState): AppState {
  return {
    ...s,
    books: !s.books?.length ? [...SAMPLE_BOOKS] : s.books,
    projects: !s.projects?.length ? [...SAMPLE_PROJECTS] : s.projects,
    skills: !s.skills?.length ? [...SAMPLE_SKILLS] : s.skills,
    skillXP: s.skillXP ?? 0,
  }
}

function syncSkillProgress(sk: SkillRoadmapItem): SkillRoadmapItem {
  const ms = sk.milestones || []
  const donePct = ms.length
    ? Math.round((ms.filter((m) => m.done).length / ms.length) * 100)
    : 0
  return {
    ...sk,
    progress: donePct,
    level: levelFromMilestoneProgress(donePct),
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return ensureDevSamples(defaultState())
    const d = JSON.parse(raw) as AppState
    const merged = ensureDevSamples({ ...defaultState(), ...d })
    const today = new Date().toDateString()
    if (merged.lastDate && merged.lastDate !== today) {
      merged.checkedHabits = []
      merged.checkedRoutine = []
      merged.xpEarned = 0
      merged.focusMinutes = 0
      merged.sessionsDone = 0
      merged.sessionLog = []
      merged.distractionsPhone = 0
      merged.distractionsSocial = 0
      merged.rescueDone = []
      merged.rescueDismissed = false
    }
    merged.lastDate = today
    return merged
  } catch {
    return ensureDevSamples(defaultState())
  }
}

function persist(s: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

type StreakContextValue = {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  toggleHabit: (id: string, xp: number) => void
  toggleRoutine: (id: string) => void
  setProfile: (p: Partial<AppState['profile']>) => void
  setSettings: (k: keyof AppState['settings'], v: boolean) => void
  addSession: (entry: SessionEntry, focusMins: number, xpGain: number) => void
  logDistraction: () => void
  saveReview: (r: Omit<ReviewEntry, 'date'> & { date?: string }) => void
  addCustomHabit: (h: AppState['customHabits'][number]) => void
  logMood: (val: number, note: string) => void
  completeRescue: (id: string, bonusXP: number) => void
  dismissRescue: () => void
  resetAll: () => void
  exportJson: () => void
  saveBook: (book: ReadingBook, editingId: string | null) => void
  deleteBook: (id: string) => void
  logBookPages: (id: string, pages: number) => void
  startReadingBook: (id: string) => void
  finishBook: (id: string) => void
  saveProject: (project: SideProject, editingId: string | null) => void
  logProjectSession: (id: string, hours: number, progressPct: number) => void
  saveSkill: (skill: SkillRoadmapItem, editingId: string | null) => void
  toggleSkillMilestone: (skillId: string, msId: string) => void
  logSkillStudy: (id: string, hours: number) => void
}

const StreakContext = createContext<StreakContextValue | null>(null)

export function StreakProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    const today = new Date().toDateString()
    persist({ ...state, lastDate: today })
  }, [state])

  const toggleHabit = useCallback((id: string, xp: number) => {
    setState((prev) => {
      const has = prev.checkedHabits.includes(id)
      const checkedHabits = has
        ? prev.checkedHabits.filter((x) => x !== id)
        : [...prev.checkedHabits, id]
      const totalXP = has ? Math.max(0, prev.totalXP - xp) : prev.totalXP + xp
      const xpEarned = has ? Math.max(0, prev.xpEarned - xp) : prev.xpEarned + xp
      return { ...prev, checkedHabits, totalXP, xpEarned }
    })
  }, [])

  const toggleRoutine = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.checkedRoutine.includes(id)
      const checkedRoutine = has
        ? prev.checkedRoutine.filter((x) => x !== id)
        : [...prev.checkedRoutine, id]
      return { ...prev, checkedRoutine }
    })
  }, [])

  const setProfile = useCallback((p: Partial<AppState['profile']>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...p },
    }))
  }, [])

  const setSettings = useCallback((k: keyof AppState['settings'], v: boolean) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, [k]: v },
    }))
  }, [])

  const addSession = useCallback((entry: SessionEntry, focusMins: number, xpGain: number) => {
    setState((prev) => ({
      ...prev,
      sessionsDone: prev.sessionsDone + 1,
      sessionLog: [entry, ...prev.sessionLog],
      focusMinutes: prev.focusMinutes + focusMins,
      totalXP: prev.totalXP + xpGain,
      xpEarned: prev.xpEarned + xpGain,
    }))
  }, [])

  const logDistraction = useCallback(() => {
    setState((prev) => ({
      ...prev,
      distractionsPhone: prev.distractionsPhone + 1,
    }))
  }, [])

  const addCustomHabit = useCallback((h: AppState['customHabits'][number]) => {
    setState((prev) => ({
      ...prev,
      customHabits: [...prev.customHabits, h],
    }))
  }, [])

  const logMood = useCallback((val: number, note: string) => {
    const todayKey = new Date().toISOString().slice(0, 10)
    setState((prev) => ({
      ...prev,
      moodLog: {
        ...prev.moodLog,
        [todayKey]: { val, note },
      },
    }))
  }, [])

  const completeRescue = useCallback((id: string, bonusXP: number) => {
    setState((prev) => {
      if (prev.rescueDone.includes(id)) return prev
      const rescueDone = [...prev.rescueDone, id]
      // Reference behavior: after the first completed challenge, resurrect streak to >= 1.
      const streak = rescueDone.length >= 1 ? Math.max(1, prev.streak) : prev.streak
      return {
        ...prev,
        rescueDone,
        totalXP: prev.totalXP + bonusXP,
        xpEarned: prev.xpEarned + bonusXP,
        streak,
      }
    })
  }, [])

  const dismissRescue = useCallback(() => {
    setState((prev) => ({ ...prev, rescueDismissed: true }))
  }, [])

  const saveReview = useCallback((r: Omit<ReviewEntry, 'date'> & { date?: string }) => {
    setState((prev) => {
      const rev: ReviewEntry = {
        ...r,
        date: r.date ?? new Date().toLocaleDateString(),
      }
      const reviews = prev.reviews.filter((x) => !(x.week === rev.week && x.year === rev.year))
      return { ...prev, reviews: [rev, ...reviews] }
    })
  }, [])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(ensureDevSamples(defaultState()))
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const u = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = u
    a.download = 'streaklab-export.json'
    a.click()
    URL.revokeObjectURL(u)
  }, [state])

  const saveBook = useCallback((book: ReadingBook, editingId: string | null) => {
    setState((prev) => {
      if (editingId) {
        const idx = prev.books.findIndex((b) => b.id === editingId)
        if (idx < 0) return prev
        const next = [...prev.books]
        const prevB = prev.books[idx]
        next[idx] = { ...book, color: book.color || prevB.color }
        return { ...prev, books: next }
      }
      return { ...prev, books: [...prev.books, book] }
    })
  }, [])

  const deleteBook = useCallback((id: string) => {
    setState((prev) => ({ ...prev, books: prev.books.filter((b) => b.id !== id) }))
  }, [])

  const logBookPages = useCallback((id: string, pages: number) => {
    if (pages <= 0 || Number.isNaN(pages)) return
    setState((prev) => {
      const books = prev.books.map((b) => {
        if (b.id !== id) return b
        let pagesRead = (b.pagesRead || 0) + pages
        if (b.pages && pagesRead > b.pages) pagesRead = b.pages
        return {
          ...b,
          pagesRead,
          lastRead: new Date().toISOString(),
        }
      })
      return { ...prev, books, totalXP: prev.totalXP + 5 }
    })
  }, [])

  const startReadingBook = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.map((b) =>
        b.id === id
          ? { ...b, status: 'reading' as const, startedAt: new Date().toISOString() }
          : b,
      ),
    }))
  }, [])

  const finishBook = useCallback((id: string) => {
    setState((prev) => {
      const books = prev.books.map((b) => {
        if (b.id !== id) return b
        return {
          ...b,
          status: 'done' as const,
          finishedAt: new Date().toISOString(),
          pagesRead: b.pages || b.pagesRead,
        }
      })
      return { ...prev, books, totalXP: prev.totalXP + 50 }
    })
  }, [])

  const saveProject = useCallback((project: SideProject, editingId: string | null) => {
    setState((prev) => {
      if (editingId) {
        const idx = prev.projects.findIndex((p) => p.id === editingId)
        if (idx < 0) return prev
        const next = [...prev.projects]
        const old = prev.projects[idx]
        next[idx] = {
          ...project,
          hours: old.hours,
          progress: old.progress,
          sessions: old.sessions,
          lastWorked: old.lastWorked,
        }
        return { ...prev, projects: next }
      }
      return { ...prev, projects: [...prev.projects, project] }
    })
  }, [])

  const logProjectSession = useCallback((id: string, hours: number, progressPct: number) => {
    if (hours <= 0 || Number.isNaN(hours)) return
    const xpGain = Math.round(hours * 10)
    setState((prev) => {
      const projects = prev.projects.map((p) => {
        if (p.id !== id) return p
        const progress = Number.isFinite(progressPct) ? Math.min(100, Math.max(0, progressPct)) : p.progress
        let status = p.status
        if (progress >= 100) status = 'shipped'
        return {
          ...p,
          hours: (p.hours || 0) + hours,
          progress,
          status,
          lastWorked: new Date().toISOString(),
        }
      })
      return { ...prev, projects, totalXP: prev.totalXP + xpGain }
    })
  }, [])

  const saveSkill = useCallback((skill: SkillRoadmapItem, editingId: string | null) => {
    setState((prev) => {
      const synced = syncSkillProgress(skill)
      if (editingId) {
        const idx = prev.skills.findIndex((s) => s.id === editingId)
        if (idx < 0) return prev
        const next = [...prev.skills]
        const old = prev.skills[idx]
        next[idx] = {
          ...synced,
          hours: old.hours,
          sessions: old.sessions,
          lastStudied: old.lastStudied,
        }
        return { ...prev, skills: next }
      }
      return { ...prev, skills: [...prev.skills, synced] }
    })
  }, [])

  const toggleSkillMilestone = useCallback((skillId: string, msId: string) => {
    setState((prev) => {
      const sk = prev.skills.find((s) => s.id === skillId)
      if (!sk) return prev
      const ms = sk.milestones.find((m) => m.id === msId)
      if (!ms) return prev
      const wasDone = ms.done
      const deltaXP = wasDone ? -ms.xp : ms.xp
      const milestones = sk.milestones.map((m) =>
        m.id === msId ? { ...m, done: !m.done } : m,
      )
      const nextSk = syncSkillProgress({ ...sk, milestones })
      const skills = prev.skills.map((s) => (s.id === skillId ? nextSk : s))
      return {
        ...prev,
        skills,
        totalXP: Math.max(0, prev.totalXP + deltaXP),
        skillXP: Math.max(0, prev.skillXP + deltaXP),
      }
    })
  }, [])

  const logSkillStudy = useCallback((id: string, hours: number) => {
    if (hours <= 0 || Number.isNaN(hours)) return
    const xpGain = Math.round(hours * 8)
    setState((prev) => ({
      ...prev,
      skills: prev.skills.map((sk) =>
        sk.id === id
          ? {
              ...sk,
              hours: (sk.hours || 0) + hours,
              sessions: (sk.sessions || 0) + 1,
              lastStudied: new Date().toISOString(),
            }
          : sk,
      ),
      totalXP: prev.totalXP + xpGain,
      skillXP: prev.skillXP + xpGain,
    }))
  }, [])

  const value = useMemo(
    () => ({
      state,
      setState,
      toggleHabit,
      toggleRoutine,
      setProfile,
      setSettings,
      addSession,
      logDistraction,
      saveReview,
      addCustomHabit,
      logMood,
      completeRescue,
      dismissRescue,
      resetAll,
      exportJson,
      saveBook,
      deleteBook,
      logBookPages,
      startReadingBook,
      finishBook,
      saveProject,
      logProjectSession,
      saveSkill,
      toggleSkillMilestone,
      logSkillStudy,
    }),
    [
      state,
      toggleHabit,
      toggleRoutine,
      setProfile,
      setSettings,
      addSession,
      logDistraction,
      saveReview,
      addCustomHabit,
      logMood,
      completeRescue,
      dismissRescue,
      resetAll,
      exportJson,
      saveBook,
      deleteBook,
      logBookPages,
      startReadingBook,
      finishBook,
      saveProject,
      logProjectSession,
      saveSkill,
      toggleSkillMilestone,
      logSkillStudy,
    ],
  )

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>
}

export function useStreak() {
  const ctx = useContext(StreakContext)
  if (!ctx) throw new Error('useStreak must be used within StreakProvider')
  return ctx
}

export { HABITS, ROUTINE }
export const habitCount = HABITS.length
export const routineCount = ROUTINE.length
