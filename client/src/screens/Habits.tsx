import { useState } from 'react'
import { HABITS } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
import { calcLevel } from '../lib/calc'
import { HabitBuilderModal } from '../components/HabitBuilderModal'
import { RescueBanner } from '../components/RescueBanner'
import { RESCUE_CHALLENGES } from '../streakos4Data'

const WEEK_PATTERN = [1, 1, 1, 1, 1, 0, 0] as const

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

export function Habits() {
  const { state, toggleHabit, addCustomHabit, completeRescue, dismissRescue } = useStreak()
  const toast = useToast()

  const allHabits = [...HABITS, ...state.customHabits]
  const showRescue = state.settings.rescue && state.checkedHabits.length === 0 && !state.rescueDismissed

  const [builderOpen, setBuilderOpen] = useState(false)

  const done = state.checkedHabits.length
  const total = allHabits.length
  const rem = total - done
  const toNext = Math.max(0, 20 - state.streak)
  const pct = Math.min(100, (state.streak / 20) * 100)

  const lv = calcLevel(state.totalXP)

  const completionPct = total ? Math.round((done / total) * 100) : 0

  function onCompleteRescue(id: string) {
    const c = RESCUE_CHALLENGES.find((x) => x.id === id)
    if (!c) return
    const first = state.rescueDone.length === 0
    completeRescue(id, c.bonusXP)
    toast.show(first ? `Streak rescued! 🔥 +${c.bonusXP} bonus` : `Challenge done! +${c.bonusXP}`)
  }

  return (
    <div>
      <RescueBanner
        variant="habits"
        show={showRescue}
        doneIds={state.rescueDone}
        onComplete={onCompleteRescue}
        onDismiss={() => dismissRescue()}
      />

      {builderOpen && (
        <HabitBuilderModal onClose={() => setBuilderOpen(false)} onAddCustomHabit={addCustomHabit} />
      )}

      <div className="grid-main">
        {/* Left: today's habits */}
        <div>
          <div className="glass" style={{ marginBottom: 16 }}>
            <div className="card-head">
              <div className="card-title">Today's habits</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'rgba(255,255,255,.25)' }}>
                  <span>{done}</span> done
                </div>
                <div
                  className="card-action"
                  style={{
                    background: 'rgba(124,58,237,.2)',
                    border: '1px solid rgba(124,58,237,.35)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    color: '#a78bfa',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setBuilderOpen(true)}
                >
                  + Add habit
                </div>
              </div>
            </div>
            <div>
              {allHabits.map((h) => {
                const isDone = state.checkedHabits.includes(h.id)

                const dots = WEEK_PATTERN.map((f, i) => {
                  const on = f === 1 || (isDone && i === 4)
                  const cur = !f && !isDone && i === 4
                  return <div key={i} className={`hdot${on ? ' on' : ''}${cur ? ' cur' : ''}`} />
                })

                return (
                  <div
                    key={h.id}
                    className={`habit-row${isDone ? ' done' : ''}`}
                    onClick={() => {
                      toggleHabit(h.id, h.xp)
                      if (isDone) toast.show(`Unchecked ${h.name}`)
                      else toast.show(`+${h.xp} XP · ${h.name}`)
                    }}
                  >
                    <div className={`h-check${isDone ? ' on' : ''}`}>{isDone ? habitCheckSvg() : null}</div>
                    <div className="h-icon" style={{ background: `${h.bg}18` }}>
                      {h.icon}
                    </div>
                    <div className="h-body">
                      <div className="h-name">{h.name}</div>
                      <div className="h-meta">
                        <span>🔥 {h.streak + (isDone ? 1 : 0)}</span>
                        <div className="h-dots">{dots}</div>
                      </div>
                    </div>
                    <div className="h-xp">{isDone ? `+${h.xp} XP ✓` : `+${h.xp} XP`}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: stats + streak card */}
        <div>
          <div className="glass" style={{ marginBottom: 14 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>
              Stats
            </div>
            <div className="grid2" style={{ gap: 10 }}>
              <div className="glass-sm" style={{ padding: 14 }}>
                <div className="hstat-val" style={{ fontSize: 22 }}>
                  {done}
                </div>
                <div className="hstat-lbl">done</div>
              </div>
              <div className="glass-sm" style={{ padding: 14 }}>
                <div className="hstat-val" style={{ fontSize: 22 }}>
                  {rem}
                </div>
                <div className="hstat-lbl">remaining</div>
              </div>
              <div className="glass-sm" style={{ padding: 14 }}>
                <div className="hstat-val" style={{ fontSize: 22 }}>
                  +{state.xpEarned}
                </div>
                <div className="hstat-lbl">XP today</div>
              </div>
              <div className="glass-sm" style={{ padding: 14 }}>
                <div className="hstat-val" style={{ fontSize: 22 }}>
                  {completionPct}
                  <span>%</span>
                </div>
                <div className="hstat-lbl">completion</div>
              </div>
            </div>
          </div>

          <div className="glass">
            <div className="card-title" style={{ marginBottom: 12 }}>
              Streak
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                fontFamily: 'var(--mono)',
                color: '#fff',
                marginBottom: 6,
                letterSpacing: '-.04em',
              }}
            >
              {state.streak}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginBottom: 12 }}>consecutive days</div>
            <div className="progress-track" style={{ maxWidth: '100%', width: '100%' }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 8, fontFamily: 'var(--mono)' }}>
              {toNext > 0 ? `${toNext} days to Bronze Shield` : 'Bronze Shield earned! 🛡️'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 6, fontFamily: 'var(--mono)' }}>
              Lv.{lv}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
