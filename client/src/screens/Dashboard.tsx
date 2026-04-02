import { useMemo } from 'react'
import { HABITS } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
import { calcLevel } from '../lib/calc'
import { RescueBanner } from '../components/RescueBanner'
import { RESCUE_CHALLENGES } from '../streakos4Data'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

const codingHours = [
  { h: '3.5h', pct: 70, color: 'rgba(91,156,246,.5)', lbl: 'Mon' },
  { h: '2h', pct: 40, color: 'rgba(91,156,246,.5)', lbl: 'Tue' },
  { h: '4h', pct: 80, color: 'rgba(91,156,246,.5)', lbl: 'Wed' },
  { h: '2.5h', pct: 50, color: 'rgba(245,158,11,.5)', lbl: 'Thu' },
  { h: '—', pct: 2, color: 'rgba(255,255,255,.12)', lbl: 'Fri' },
  { h: '—', pct: 2, color: 'rgba(255,255,255,.12)', lbl: 'Sat' },
  { h: '—', pct: 2, color: 'rgba(255,255,255,.12)', lbl: 'Sun' },
] as const

function habitCheckSvg() {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="M1.5 5L4 7.5L8.5 2.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Dashboard() {
  const { state, toggleHabit, completeRescue } = useStreak()
  const toast = useToast()

  const allHabits = [...HABITS, ...state.customHabits]
  const showRescue = state.settings.rescue && state.checkedHabits.length === 0 && !state.rescueDismissed

  const lv = calcLevel(state.totalXP)
  const done = state.checkedHabits.length
  const pct = Math.min(100, (state.streak / 20) * 100)
  const toNext = Math.max(0, 20 - state.streak)
  const fname = state.profile.name ? state.profile.name.split(' ')[0] : 'friend'

  const todayDow = new Date().getDay() // 0=Sun..6=Sat
  const todayIdx = (todayDow + 6) % 7 // 0=Mon..6=Sun
  const streakDays = Math.min(state.streak, 7)
  const pastWithinWeek = Math.min(streakDays, todayIdx + 1)

  const weekCells = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const isToday = i === todayIdx
      const isDone = !isToday && i >= todayIdx - pastWithinWeek + 1 && i < todayIdx
      const score = isToday ? '★' : isDone ? '✓' : ''
      return { i, isToday, isDone, label: DAYS[i], score }
    })
  }, [todayIdx, pastWithinWeek])

  const handle = state.profile.handle || 'devhero'
  const players = [
    { name: 'sarah_codes', xp: 520, me: false, init: 'S', c: '#60a5fa' },
    { name: `you (${handle})`, xp: state.totalXP, me: true, init: fname[0]?.toUpperCase() || 'Y', c: '#a78bfa' },
    { name: 'habitwolf', xp: 290, me: false, init: 'H', c: '#4ade80' },
    { name: 'morningpro', xp: 210, me: false, init: 'M', c: '#f472b6' },
    { name: 'keystroke99', xp: 180, me: false, init: 'K', c: '#fbbf24' },
  ].sort((a, b) => b.xp - a.xp)

  const max = players[0]?.xp || 1
  const medals = ['🥇', '🥈', '🥉']

  function onCompleteRescue(id: string) {
    const c = RESCUE_CHALLENGES.find((x) => x.id === id)
    if (!c) return
    const first = state.rescueDone.length === 0
    completeRescue(id, c.bonusXP)
    toast.show(first ? `Streak rescued! 🔥 +${c.bonusXP} bonus` : `Challenge done! +${c.bonusXP}`)
  }

  return (
    <div>
      <div className="hero-card">
        <div className="hero-glow" />
        <div className="hero-main">
          <div className="hero-left">
            <div className="greeting">
              Hey <span id="dash-fname">{fname}</span>,
            </div>
            <div className="name-line">
              <span>here's your</span> plan
            </div>
            <div className="sub" id="dash-streak-sub">
              {toNext > 0 ? `${toNext} more days to unlock Bronze Shield` : 'Bronze Shield earned! 🛡️'}
            </div>
            <div className="hero-progress-row">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-txt" id="dash-prog-label">
                {state.streak} / 20
              </div>
            </div>
          </div>
          <div className="streak-big">
            <div className="streak-num" id="dash-streak-num">
              {state.streak}
            </div>
            <div className="streak-label">day streak</div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hstat">
            <div className="hstat-val" id="dash-done">
              {done}
            </div>
            <div className="hstat-lbl">habits done</div>
          </div>
          <div className="hstat">
            <div className="hstat-val" id="dash-xp">
              {state.totalXP}
            </div>
            <div className="hstat-lbl">total XP</div>
          </div>
          <div className="hstat">
            <div className="hstat-val" id="dash-level">
              Lv.{lv}
            </div>
            <div className="hstat-lbl">level</div>
          </div>
          <div className="hstat">
            <div className="hstat-val" id="dash-focus">
              {state.focusMinutes}
              <span>m</span>
            </div>
            <div className="hstat-lbl">focused</div>
          </div>
        </div>
      </div>

      <div className="grid-main">
        <div>
          <RescueBanner
            variant="dash"
            show={showRescue}
            doneIds={state.rescueDone}
            onComplete={onCompleteRescue}
          />

          <div className="glass" style={{ marginBottom: 16 }}>
            <div className="card-head">
              <div className="card-title">This week</div>
            </div>
            <div className="week-track">
              {weekCells.map((c) => (
                <div key={c.label} className="wday">
                  <div className="wday-lbl">{c.label}</div>
                  <div className={`wday-block${c.isDone ? ' done' : ''}${c.isToday ? ' today' : ''}`}>
                    <div className="wday-score">{c.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass">
            <div className="card-head">
              <div className="card-title">Coding hours this week</div>
            </div>
            <div className="bar-chart">
              {codingHours.map((row) => (
                <div key={row.lbl} className="bc">
                  <div className="bc-val">{row.h}</div>
                  <div className="bc-bar" style={{ height: `${row.pct}%`, background: row.color }} />
                  <div className="bc-lbl">{row.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="glass" style={{ marginBottom: 14 }}>
            <div className="card-head">
              <div className="card-title">Gold league 🏅</div>
            </div>
            <div id="league-list">
              {players.map((p, i) => (
                <div key={p.name} className="league-row">
                  <div className="lr-rank">{medals[i] || `${i + 1}.`}</div>
                  <div className="lr-av" style={{ background: `${p.c}18`, color: p.c }}>
                    {p.init}
                  </div>
                  <div className={`lr-name${p.me ? ' me' : ''}`}>{p.me ? 'you (you)' : p.name}</div>
                  <div className="lr-bar">
                    <div className={`lr-fill${p.me ? ' me' : ''}`} style={{ width: `${Math.round((p.xp / max) * 100)}%` }} />
                  </div>
                  <div className={`lr-xp${p.me ? ' me' : ''}`}>{p.xp}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass">
            <div className="card-head">
              <div className="card-title">Today's habits</div>
            </div>
            <div>
              {allHabits.map((h) => {
                const done = state.checkedHabits.includes(h.id)
                return (
                  <div
                    key={h.id}
                    className={`habit-row${done ? ' done' : ''}`}
                    onClick={() => {
                      toggleHabit(h.id, h.xp)
                      toast.show((done ? 'Unchecked' : 'Checked') + ` ${h.icon}`)
                    }}
                  >
                    <div className={`h-check${done ? ' on' : ''}`}>{done ? habitCheckSvg() : null}</div>
                    <div className="h-icon" style={{ background: `${h.dot}18` }}>
                      {h.icon}
                    </div>
                    <div className="h-body">
                      <div className="h-name">{h.name}</div>
                    </div>
                    <div className="h-xp">{done ? `+${h.xp} ✓` : `+${h.xp}`}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
