import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { OnboardingModal } from './components/OnboardingModal'
import { DesktopBackdrop } from './components/DesktopBackdrop'
import { StreakProvider, useStreak } from './context/StreakContext'
import { ToastProvider } from './hooks/useToast'
import { calcLevel } from './lib/calc'
import { HABITS, ROUTINE } from './constants'
import { StreakOSShell } from './StreakOSShell'
import { Dashboard } from './screens/Dashboard'
import { Energy } from './screens/Energy'
import { Focus } from './screens/Focus'
import { Habits } from './screens/Habits'
import { Morning } from './screens/Morning'
import { Profile } from './screens/Profile'
import { Review } from './screens/Review'
import type { ScreenId } from './types'

const PRIMARY_NAV: { id: Exclude<ScreenId, 'review'>; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'habits', label: 'Habits', icon: '🔥' },
  { id: 'focus', label: 'Focus', icon: '⏱️' },
  { id: 'morning', label: 'Morning', icon: '☀️' },
  { id: 'energy', label: 'Energy', icon: '📊' },
  { id: 'profile', label: 'Profile', icon: '👤' },
]

const SCREEN_INFO: Record<ScreenId, { title: string; vibe: string }> = {
  dashboard: { title: 'Home Command', vibe: 'Track the whole day at a glance.' },
  habits: { title: 'Habit Engine', vibe: 'Build momentum with repeatable wins.' },
  focus: { title: 'Deep Focus', vibe: 'Short bursts. Clean execution.' },
  morning: { title: 'Morning Ritual', vibe: 'Prime your brain before the noise.' },
  mood: { title: 'Mood Log', vibe: 'Track feelings and spot patterns.' },
  energy: { title: 'Energy Lab', vibe: 'See what habits lift your output.' },
  review: { title: 'Weekly Debrief', vibe: 'Close loops and set your next sprint.' },
  profile: { title: 'Pilot Profile', vibe: 'Tune your identity and system settings.' },
}

function DesktopCompanion({ screen }: { screen: ScreenId }) {
  const { state } = useStreak()
  const doneHabits = state.checkedHabits.length
  const doneRoutine = state.checkedRoutine.length
  const level = calcLevel(state.totalXP)
  const info = SCREEN_INFO[screen]
  const focusSessions = Math.floor(state.focusMinutes / 25)
  const nextLevelXP = level * 200
  const levelProgress = Math.min(100, ((state.totalXP % 200) / 200) * 100)
  const healthScore = Math.round(
    ((doneHabits / HABITS.length) * 45 +
      (doneRoutine / ROUTINE.length) * 35 +
      Math.min(1, state.focusMinutes / 120) * 20),
  )

  return (
    <aside className="hidden w-[370px] shrink-0 2xl:block">
      <div className="sticky top-8 space-y-4">
        <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(28,176,246,0.14)] backdrop-blur">
          <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#afafaf]">Active zone</div>
          <div className="font-display text-[22px] font-black text-[#1f1f1f]">{info.title}</div>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-[#6f6f6f]">{info.vibe}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e8f7ff]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1cb0f6] to-[#6dd5ff]"
              style={{ width: `${Math.min(100, (state.xpEarned / 200) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#e5e5e5] bg-white/90 p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#afafaf]">Level</div>
            <div className="mt-1 font-display text-3xl font-black text-[#1f1f1f]">Lv.{level}</div>
          </div>
          <div className="rounded-2xl border border-[#e5e5e5] bg-white/90 p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#afafaf]">Total XP</div>
            <div className="mt-1 font-display text-3xl font-black text-[#1cb0f6]">{state.totalXP}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e5e5] bg-white/90 p-4">
          <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#afafaf]">Today pulse</div>
          <div className="space-y-2 text-sm font-semibold text-[#3c3c3c]">
            <div className="flex items-center justify-between">
              <span>Habits</span>
              <span className="font-display font-black text-[#ff6b35]">
                {doneHabits}/{HABITS.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Routine</span>
              <span className="font-display font-black text-[#58cc02]">
                {doneRoutine}/{ROUTINE.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Focus</span>
              <span className="font-display font-black text-[#1cb0f6]">{state.focusMinutes}m</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Streak</span>
              <span className="font-display font-black text-[#ff6b35]">🔥 {state.streak}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e5e5] bg-white/90 p-4">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#afafaf]">Progress systems</div>
          <div className="mb-2.5 flex items-center justify-between text-sm font-semibold text-[#3c3c3c]">
            <span>To next level</span>
            <span className="font-display font-black text-[#1cb0f6]">{nextLevelXP - state.totalXP} XP</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#e8f7ff]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#1cb0f6] to-[#6dd5ff]" style={{ width: `${levelProgress}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[#3c3c3c]">
            <span>Focus sessions</span>
            <span className="font-display font-black text-[#6c63ff]">{focusSessions}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e5e5] bg-white/90 p-4">
          <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#afafaf]">System health</div>
          <div className="mb-2 font-display text-3xl font-black text-[#1f1f1f]">{healthScore}<span className="text-lg">/100</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-[#f0f0f0]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#58cc02] via-[#ffd900] to-[#ff6b35]"
              style={{ width: `${healthScore}%` }}
            />
          </div>
          <p className="mt-2.5 text-xs font-semibold text-[#6f6f6f]">
            Balanced from habits, morning consistency, and focus depth.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e5e5] bg-white/90 p-4">
          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#afafaf]">Recent focus log</div>
          {state.sessionLog.length ? (
            <div className="space-y-1.5">
              {state.sessionLog.slice(0, 3).map((entry, idx) => (
                <div key={`${entry.task}-${idx}`} className="flex items-center justify-between rounded-xl bg-[#f7f7f7] px-3 py-2 text-xs">
                  <span className="max-w-[70%] truncate font-semibold text-[#3c3c3c]">{entry.task}</span>
                  <span className="font-display font-black text-[#1cb0f6]">{entry.dur}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-semibold text-[#8a8a8a]">No sessions yet. Start one in Focus mode.</p>
          )}
        </div>
      </div>
    </aside>
  )
}

function Shell() {
  const { state } = useStreak()
  const [screen, setScreen] = useState<ScreenId>('dashboard')
  const showOnboarding = !state.profile?.name
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  function renderScreen() {
    switch (screen) {
      case 'dashboard':
        return <Dashboard />
      case 'habits':
        return <Habits />
      case 'focus':
        return <Focus />
      case 'morning':
        return <Morning />
      case 'energy':
        return <Energy />
      case 'review':
        return <Review />
      case 'profile':
        return <Profile onGoReview={() => setScreen('review')} />
      default:
        return null
    }
  }

  function go(id: ScreenId) {
    setScreen(id)
  }

  return (
    <>
      <OnboardingModal open={showOnboarding} />
      <div className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden md:flex-row">
        <DesktopBackdrop />

        {/* Desktop sidebar */}
        <aside className="relative z-10 hidden w-[260px] shrink-0 flex-col border-r-2 border-[#e5e5e5] bg-white/90 py-6 pl-6 pr-4 shadow-[4px_0_40px_rgba(28,176,246,0.08)] backdrop-blur-md md:flex">
          <div className="mb-8 pr-2">
            <div className="font-display text-2xl font-black tracking-tight text-[#1f1f1f]">
              Streak<span className="text-[#1cb0f6]">Lab</span>
            </div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#afafaf]">Life OS</div>
          </div>
          <nav className="flex flex-1 flex-col gap-1.5">
            {PRIMARY_NAV.map((item) => {
              const active = screen === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left font-display text-sm font-extrabold transition-[transform,background,box-shadow] duration-200 md:hover:scale-[1.02] ${
                    active
                      ? 'bg-[#e8f7ff] text-[#1cb0f6] sl-sidebar-active-glow'
                      : 'text-[#3c3c3c] hover:bg-[#f7f7f7]'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                  {active && (
                    <motion.span layoutId="nav-pip" className="ml-auto h-2 w-2 rounded-full bg-[#1cb0f6]" />
                  )}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => go('review')}
              className={`mt-2 flex items-center gap-3 rounded-2xl border-2 border-dashed px-3 py-3 text-left font-display text-sm font-extrabold transition-colors ${
                screen === 'review'
                  ? 'border-[#6c63ff] bg-[#f4e6ff] text-[#6b3fa0]'
                  : 'border-[#e5e5e5] text-[#afafaf] hover:border-[#e2c4ff] hover:bg-[#faf8ff]'
              }`}
            >
              <span className="text-xl">📝</span>
              Weekly review
            </button>
          </nav>
          <div className="mt-auto pr-2 pt-6 text-[11px] font-semibold leading-relaxed text-[#afafaf]">
            Desktop: fluid nav · XP glow · ambient field
          </div>
        </aside>

        {/* Mobile: column [scrollable main | tab bar] keeps bar at true bottom without position:fixed */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:min-h-0">
          <main className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col bg-[#f0f9ff] md:bg-transparent">
            <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col md:px-8 md:py-8 xl:px-12">
              <div className="flex min-h-0 gap-6">
                <section className="min-h-0 flex-1 overflow-hidden md:rounded-[30px] md:border md:border-white/70 md:bg-[#f8fcff]/85 md:shadow-[0_18px_70px_rgba(31,64,106,0.12)]">
                  <div className="hidden items-center justify-between border-b border-[#eaf2fb] px-7 py-4 xl:flex">
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.11em] text-[#8da6be]">StreakLab workspace</div>
                      <div className="font-display text-[22px] font-black text-[#203040]">{SCREEN_INFO[screen].title}</div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-[#dfeaf7] bg-white px-3.5 py-2 text-xs font-bold text-[#5b748b]">
                      <span className="text-sm">📅</span>
                      {todayLabel}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={screen}
                      role="main"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="min-h-0 h-full overflow-y-auto overflow-x-hidden px-[18px] pb-4 pt-5 md:px-7 md:pb-8 md:pt-6 xl:px-9"
                    >
                      {renderScreen()}
                    </motion.div>
                  </AnimatePresence>
                </section>
                <DesktopCompanion screen={screen} />
              </div>
            </div>
          </main>

          <nav
            className="flex shrink-0 border-t-2 border-[#e5e5e5] bg-white pt-2 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] md:hidden"
            style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
          >
            {PRIMARY_NAV.map((item) => {
              const active = screen === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className="flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-transform active:scale-95"
                >
                  <span className="text-[19px] leading-none">{item.icon}</span>
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                      active ? 'bg-[#1cb0f6]' : 'bg-transparent'
                    }`}
                  />
                  <span
                    className={`max-w-full truncate px-0.5 font-display text-[9px] font-extrabold uppercase tracking-[0.04em] ${
                      active ? 'text-[#1cb0f6]' : 'text-[#afafaf]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default function App() {
  // Keep the original shell code around as a reference (not rendered),
  // but mark it as "used" so TypeScript doesn't fail noUnusedLocals.
  void Shell
  return (
    <StreakProvider>
      <ToastProvider>
        <StreakOSShell />
      </ToastProvider>
    </StreakProvider>
  )
}
