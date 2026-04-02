import { useEffect, useRef, useState } from 'react'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'

const MODES = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 } as const
const TLABELS: Record<keyof typeof MODES, string> = {
  pomodoro: 'FOCUS',
  short: 'SHORT BREAK',
  long: 'LONG BREAK',
}
const CIRCUM = 541

type Mode = keyof typeof MODES

export function Focus() {
  const { state, addSession, logDistraction } = useStreak()
  const toast = useToast()

  const [mode, setMode] = useState<Mode>('pomodoro')
  const [timerLeft, setTimerLeft] = useState(MODES.pomodoro)
  const [running, setRunning] = useState(false)
  const [pomoDone, setPomoDone] = useState(0)
  const [task, setTask] = useState('Code study')

  const modeRef = useRef(mode)
  const taskRef = useRef(task)
  useEffect(() => {
    // Keep latest values available to the timer completion callbacks.
    modeRef.current = mode
    taskRef.current = task
  }, [mode, task])

  const timerTotal = MODES[mode]

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setTimerLeft((left) => {
        const next = left - 1
        if (next <= 0) {
          window.setTimeout(() => {
            setRunning(false)
            const m = modeRef.current
            if (m === 'pomodoro') {
              const label = taskRef.current.trim() || 'Focus session'
              addSession({ task: label, dur: '25m' }, 25, 50)
              setPomoDone((p) => (p + 1) % 4)
              toast.show('🎉 Session done! +50 XP')
            } else {
              toast.show('⏰ Break over!')
            }
            setTimerLeft(MODES[modeRef.current])
          }, 0)
          return 0
        }
        return next
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [running, addSession, toast])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const dashOffset = CIRCUM * (timerLeft / timerTotal)

  return (
    <div className="grid-main">
      {/* Left: timer */}
      <div>
        <div className="glass" style={{ marginBottom: 16 }}>
          <div className="mode-tabs">
            {(['pomodoro', 'short', 'long'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`mode-tab${mode === m ? ' active' : ''}`}
                onClick={() => {
                  setMode(m)
                  setRunning(false)
                  setTimerLeft(MODES[m])
                }}
              >
                {m === 'pomodoro' ? 'Pomodoro · 25m' : m === 'short' ? 'Short · 5m' : 'Long · 15m'}
              </button>
            ))}
          </div>

          {/* Hidden defs so the circle can use stroke:url(#timerGrad) */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="timer-ring">
            <svg viewBox="0 0 190 190">
              <circle className="tr-bg" cx="95" cy="95" r="86" />
              <circle
                className="tr-fill"
                cx="95"
                cy="95"
                r="86"
                style={{ strokeDashoffset: dashOffset }}
                strokeDasharray={CIRCUM}
              />
            </svg>
            <div className="timer-center">
              <div className="timer-time">{formatTime(timerLeft)}</div>
              <div className="timer-ph">{TLABELS[mode]}</div>
            </div>
          </div>

          <div className="pdots">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`pdot${i < pomoDone ? ' done' : i === pomoDone ? ' cur' : ''}`} />
            ))}
          </div>

          <div className="timer-btns">
            <button
              type="button"
              className="tbtn"
              onClick={() => {
                setRunning(false)
                setTimerLeft(timerTotal)
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="tbtn primary"
              onClick={() => setRunning((r) => !r)}
            >
              {running ? 'Pause' : 'Start'}
            </button>
          </div>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.06)' }}>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,.25)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                fontFamily: 'var(--mono)',
              }}
            >
              Working on
            </div>
            <input
              id="task-input"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What are you working on?"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 13,
                fontFamily: 'var(--f)',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Right: stats */}
      <div>
        <div className="glass" style={{ marginBottom: 14 }}>
          <div className="card-title" style={{ marginBottom: 14 }}>
            Today's stats
          </div>
          <div className="grid2" style={{ gap: 10 }}>
            <div className="glass-sm" style={{ padding: 14 }}>
              <div className="hstat-val" style={{ fontSize: 22 }}>
                {state.sessionsDone}
              </div>
              <div className="hstat-lbl">sessions</div>
            </div>
            <div className="glass-sm" style={{ padding: 14 }}>
              <div className="hstat-val" style={{ fontSize: 22 }}>
                {state.focusMinutes}
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>m</span>
              </div>
              <div className="hstat-lbl">focus time</div>
            </div>
            <div className="glass-sm" style={{ padding: 14 }}>
              <div className="hstat-val" style={{ fontSize: 22 }}>
                {state.distractionsPhone + state.distractionsSocial}
              </div>
              <div className="hstat-lbl">distractions</div>
            </div>
            <div className="glass-sm" style={{ padding: 14 }}>
              <div className="hstat-val" style={{ fontSize: 22 }}>
                {state.sessionsDone ? Math.max(0, 100 - (state.distractionsPhone + state.distractionsSocial) * 10) : '—'}
              </div>
              <div className="hstat-lbl">score</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logDistraction()
              toast.show('📌 Distraction logged')
            }}
            style={{
              width: '100%',
              marginTop: 12,
              padding: 9,
              borderRadius: 10,
              border: '1px dashed rgba(255,255,255,.12)',
              background: 'transparent',
              color: 'rgba(255,255,255,.25)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'var(--f)',
              transition: 'color .15s',
            }}
          >
            + Log distraction
          </button>
        </div>

        <div className="glass">
          <div className="card-title" style={{ marginBottom: 12 }}>
            Session log
          </div>
          <div>
            {!state.sessionLog.length ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', padding: '6px 0' }}>No sessions yet today.</div>
            ) : (
              <div>
                {state.sessionLog.slice(0, 5).map((s, idx) => (
                  <div
                    key={`${s.task}-${idx}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(255,255,255,.05)',
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,.45)' }}>→ {s.task}</span>
                    <span style={{ color: 'rgba(255,255,255,.25)', fontFamily: 'var(--mono)' }}>{s.dur}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
