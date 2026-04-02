import { useState } from 'react'
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

export function StreakOSShell() {
  const { state } = useStreak()
  const [screen, setScreen] = useState<ScreenId>('dashboard')
  const showOnboarding = !state.profile?.name

  const allHabits = [...HABITS, ...state.customHabits]
  const showRescue = state.settings.rescue && state.checkedHabits.length === 0 && !state.rescueDismissed

  const lv = calcLevel(state.totalXP)
  const avatar = state.profile.name ? state.profile.name[0].toUpperCase() : '?'

  const pageTitle =
    screen === 'dashboard'
      ? 'Dashboard'
      : screen === 'habits'
        ? 'Habits'
        : screen === 'morning'
          ? 'Morning'
          : screen === 'focus'
            ? 'Focus'
              : screen === 'mood'
                ? 'Mood log'
            : screen === 'energy'
              ? 'Energy'
              : screen === 'review'
                ? 'Review'
                : 'Profile'

  function go(id: ScreenId) {
    setScreen(id)
  }

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
              <div className="logo-ver">v4.0</div>
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
          className={`mnav-btn ${screen === 'mood' ? 'active' : ''}`}
          onClick={() => go('mood')}
        >
          <span className="mnav-ico">◑</span>
          <span className="mnav-lbl">Mood</span>
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

