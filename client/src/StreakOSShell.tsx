import { useEffect, useState } from 'react'
import { HABITS } from './constants'
import { calcLevel } from './lib/calc'
import { useStreak } from './context/StreakContext'
import { OnboardingModal } from './components/OnboardingModal'
import type { ScreenId } from './types'
import { Dashboard } from './screens/Dashboard'
import { Habits } from './screens/Habits'
import { Focus } from './screens/Focus'
import { Morning } from './screens/Morning'
import { Mood } from './screens/Mood'
import { Energy } from './screens/Energy'
import { Review } from './screens/Review'
import { Profile } from './screens/Profile'
import { ReadingList } from './screens/ReadingList'
import { SideProjects } from './screens/SideProjects'
import { SkillRoadmap } from './screens/SkillRoadmap'

const PAGE_TITLES: Record<ScreenId, string> = {
  dashboard: 'Dashboard',
  habits: 'Habits',
  morning: 'Morning routine',
  focus: 'Focus timer',
  mood: 'Mood log',
  energy: 'Energy insights',
  review: 'Weekly review',
  profile: 'Profile',
  reading: 'Reading list',
  projects: 'Side projects',
  skills: 'Skill roadmap',
}

/** Screens shown in the mobile “More” sheet (not in the 5-slot bar). */
const MORE_SCREENS: ScreenId[] = ['morning', 'mood', 'energy', 'review', 'reading', 'projects', 'skills']

export function StreakOSShell() {
  const { state } = useStreak()
  const [screen, setScreen] = useState<ScreenId>('dashboard')
  const [moreOpen, setMoreOpen] = useState(false)
  const showOnboarding = !state.profile?.name

  const allHabits = [...HABITS, ...state.customHabits]
  const showRescue = state.settings.rescue && state.checkedHabits.length === 0 && !state.rescueDismissed
  const readingActive = state.books.filter((b) => b.status === 'reading').length

  const lv = calcLevel(state.totalXP)
  const avatar = state.profile.name ? state.profile.name[0].toUpperCase() : '?'

  const pageTitle = PAGE_TITLES[screen]
  const moreHighlighted = MORE_SCREENS.includes(screen) || moreOpen

  function go(id: ScreenId) {
    setScreen(id)
    setMoreOpen(false)
  }

  function goFromMore(id: ScreenId) {
    setScreen(id)
    setMoreOpen(false)
  }

  useEffect(() => {
    if (!moreOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moreOpen])

  useEffect(() => {
    if (!moreOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [moreOpen])

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
      case 'mood':
        return <Mood />
      case 'energy':
        return <Energy />
      case 'review':
        return <Review />
      case 'profile':
        return <Profile onGoReview={() => go('review')} />
      case 'reading':
        return <ReadingList />
      case 'projects':
        return <SideProjects />
      case 'skills':
        return <SkillRoadmap />
      default:
        return null
    }
  }

  return (
    <>
      <OnboardingModal open={showOnboarding} />

      {/* Gradient mesh background (from the reference HTML) */}
      <div className="bg">
        <div className="bg-base" />
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="orb orb4" />
      </div>

      <div className="shell">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-mark">S</div>
            <div>
              <div className="logo-name">StreakOS</div>
              <div className="logo-ver">v4.1</div>
            </div>
          </div>

          <nav className="nav">
            <div className="nav-sec">Overview</div>
            <div className={`nav-item ${screen === 'dashboard' ? 'active' : ''}`} onClick={() => go('dashboard')}>
              <span className="nav-icon">○</span>
              <span className="nav-label">Dashboard</span>
            </div>

            <div className="nav-sec">Daily</div>
            <div className={`nav-item ${screen === 'habits' ? 'active' : ''}`} onClick={() => go('habits')}>
              <span className="nav-icon">◎</span>
              <span className="nav-label">Habits</span>
              <span className="nav-badge">
                {state.checkedHabits.length}/{allHabits.length}
              </span>
            </div>

            <div className={`nav-item ${screen === 'morning' ? 'active' : ''}`} onClick={() => go('morning')}>
              <span className="nav-icon">◐</span>
              <span className="nav-label">Morning</span>
            </div>

            <div className={`nav-item ${screen === 'focus' ? 'active' : ''}`} onClick={() => go('focus')}>
              <span className="nav-icon">◷</span>
              <span className="nav-label">Focus</span>
              <span className="nav-badge">{state.focusMinutes}m</span>
            </div>

            <div className="nav-sec">Insights</div>
            <div className={`nav-item ${screen === 'mood' ? 'active' : ''}`} onClick={() => go('mood')}>
              <span className="nav-icon">◑</span>
              <span className="nav-label">Mood</span>
            </div>
            <div className={`nav-item ${screen === 'energy' ? 'active' : ''}`} onClick={() => go('energy')}>
              <span className="nav-icon">◈</span>
              <span className="nav-label">Energy</span>
            </div>
            <div className={`nav-item ${screen === 'review' ? 'active' : ''}`} onClick={() => go('review')}>
              <span className="nav-icon">◻</span>
              <span className="nav-label">Review</span>
            </div>

            <div className="nav-sec">Dev</div>
            <div className={`nav-item ${screen === 'reading' ? 'active' : ''}`} onClick={() => go('reading')}>
              <span className="nav-icon">◫</span>
              <span className="nav-label">Reading</span>
              <span className="nav-badge">{readingActive}</span>
            </div>
            <div className={`nav-item ${screen === 'projects' ? 'active' : ''}`} onClick={() => go('projects')}>
              <span className="nav-icon">◧</span>
              <span className="nav-label">Projects</span>
              <span className="nav-badge">
                {state.projects.filter((p) => p.status === 'building').length}
              </span>
            </div>
            <div className={`nav-item ${screen === 'skills' ? 'active' : ''}`} onClick={() => go('skills')}>
              <span className="nav-icon">◬</span>
              <span className="nav-label">Skills</span>
            </div>
          </nav>

          <div className="sidebar-foot">
            <div className="profile-pill" onClick={() => go('profile')}>
              <div className="p-avatar">{avatar}</div>
              <div>
                <div className="p-name">{state.profile.name || 'Set up profile'}</div>
                <div className="p-level">Lv.{lv} · {state.totalXP} XP</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="page-title">{pageTitle}</div>
            <div className="topbar-chips">
              <div className="chip">
                <div className="chip-dot" style={{ background: '#f59e0b' }} />
                <span>{state.streak}</span> day streak
              </div>
              <div className="chip">
                <div className="chip-dot" style={{ background: '#a78bfa' }} />
                <span>{state.totalXP}</span> XP
              </div>
              <div
                id="rescue-chip"
                className="chip"
                style={{
                display: showRescue ? 'flex' : 'none',
                  background: 'rgba(245,158,11,.15)',
                  borderColor: 'rgba(245,158,11,.4)',
                  color: '#fbbf24',
                  cursor: 'pointer',
                }}
              onClick={() => go('habits')}
              >
                ⚠ Rescue streak
              </div>
            </div>
          </div>

          <div className="content">
            <div key={screen} className="screen active" id={`screen-${screen}`}>
              {renderScreen()}
            </div>
          </div>
        </main>
      </div>

      {moreOpen ? (
        <>
          <button
            type="button"
            className="mnav-backdrop"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div className="mnav-sheet" role="dialog" aria-modal="true" aria-label="More destinations">
            <div className="mnav-sheet-handle" aria-hidden />
            <div className="mnav-sheet-sec">Daily</div>
            <button
              type="button"
              className={`mnav-sheet-item ${screen === 'morning' ? 'active' : ''}`}
              onClick={() => goFromMore('morning')}
            >
              <span className="mnav-sheet-ico">◐</span>
              <span className="mnav-sheet-txt">Morning</span>
            </button>
            <button
              type="button"
              className={`mnav-sheet-item ${screen === 'mood' ? 'active' : ''}`}
              onClick={() => goFromMore('mood')}
            >
              <span className="mnav-sheet-ico">◑</span>
              <span className="mnav-sheet-txt">Mood</span>
            </button>
            <div className="mnav-sheet-sec">Insights</div>
            <button
              type="button"
              className={`mnav-sheet-item ${screen === 'energy' ? 'active' : ''}`}
              onClick={() => goFromMore('energy')}
            >
              <span className="mnav-sheet-ico">◈</span>
              <span className="mnav-sheet-txt">Energy</span>
            </button>
            <button
              type="button"
              className={`mnav-sheet-item ${screen === 'review' ? 'active' : ''}`}
              onClick={() => goFromMore('review')}
            >
              <span className="mnav-sheet-ico">◻</span>
              <span className="mnav-sheet-txt">Review</span>
            </button>
            <div className="mnav-sheet-sec">Dev</div>
            <button
              type="button"
              className={`mnav-sheet-item ${screen === 'reading' ? 'active' : ''}`}
              onClick={() => goFromMore('reading')}
            >
              <span className="mnav-sheet-ico">◫</span>
              <span className="mnav-sheet-txt">Reading</span>
              {readingActive > 0 ? (
                <span className="mnav-sheet-badge">{readingActive}</span>
              ) : null}
            </button>
            <button
              type="button"
              className={`mnav-sheet-item ${screen === 'projects' ? 'active' : ''}`}
              onClick={() => goFromMore('projects')}
            >
              <span className="mnav-sheet-ico">◧</span>
              <span className="mnav-sheet-txt">Projects</span>
              {state.projects.filter((p) => p.status === 'building').length > 0 ? (
                <span className="mnav-sheet-badge">
                  {state.projects.filter((p) => p.status === 'building').length}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className={`mnav-sheet-item ${screen === 'skills' ? 'active' : ''}`}
              onClick={() => goFromMore('skills')}
            >
              <span className="mnav-sheet-ico">◬</span>
              <span className="mnav-sheet-txt">Skills</span>
            </button>
          </div>
        </>
      ) : null}

      <nav className="mnav" aria-label="Primary">
        <button
          type="button"
          className={`mnav-btn ${screen === 'dashboard' ? 'active' : ''}`}
          onClick={() => go('dashboard')}
        >
          <span className="mnav-ico">○</span>
          <span className="mnav-lbl">Home</span>
        </button>
        <button
          type="button"
          className={`mnav-btn ${screen === 'habits' ? 'active' : ''}`}
          onClick={() => go('habits')}
        >
          <span className="mnav-ico">◎</span>
          <span className="mnav-lbl">Habits</span>
        </button>
        <button
          type="button"
          className={`mnav-btn ${screen === 'focus' ? 'active' : ''}`}
          onClick={() => go('focus')}
        >
          <span className="mnav-ico">◷</span>
          <span className="mnav-lbl">Focus</span>
        </button>
        <button
          type="button"
          className={`mnav-btn mnav-btn-more ${moreHighlighted ? 'active' : ''}`}
          aria-expanded={moreOpen}
          aria-haspopup="dialog"
          onClick={() => setMoreOpen((o) => !o)}
        >
          <span className="mnav-ico">{moreOpen ? '▾' : '▸'}</span>
          <span className="mnav-lbl">More</span>
        </button>
        <button
          type="button"
          className={`mnav-btn ${screen === 'profile' ? 'active' : ''}`}
          onClick={() => go('profile')}
        >
          <span className="mnav-ico">◉</span>
          <span className="mnav-lbl">Me</span>
        </button>
      </nav>
    </>
  )
}

