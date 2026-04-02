import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { HABITS, ROUTINE, STORAGE_KEY } from '../constants'
import type { AppState, ReviewEntry, SessionEntry } from '../types'

const defaultState = (): AppState => ({
  checkedHabits: [],
  checkedRoutine: [],
  totalXP: 0,
  xpEarned: 0,
  focusMinutes: 0,
  sessionsDone: 0,
  distractionsPhone: 2,
  distractionsSocial: 1,
  sessionLog: [],
  streak: 14,
  profile: { name: '', handle: '', goal: '' },
  settings: { reminder: true, freeze: false, sound: true },
  reviews: [],
  lastDate: '',
})

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const d = JSON.parse(raw) as AppState
    const merged = { ...defaultState(), ...d }
    const today = new Date().toDateString()
    if (merged.lastDate && merged.lastDate !== today) {
      merged.checkedHabits = []
      merged.checkedRoutine = []
      merged.xpEarned = 0
      merged.focusMinutes = 0
      merged.sessionsDone = 0
      merged.sessionLog = []
    }
    merged.lastDate = today
    return merged
  } catch {
    return defaultState()
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
  resetAll: () => void
  exportJson: () => void
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
    setState(defaultState())
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
      resetAll,
      exportJson,
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
      resetAll,
      exportJson,
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
