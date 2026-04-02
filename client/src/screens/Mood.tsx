import { useMemo, useState } from 'react'
import { MOOD_EMOJIS, MOOD_LABELS } from '../streakos4Data'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'

function isoDateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function Mood() {
  const { state, logMood } = useStreak()
  const toast = useToast()

  const todayKey = isoDateKey(new Date())
  const todayVal = state.moodLog[todayKey]?.val ?? 0

  const [note, setNote] = useState('')
  const [savedMsg, setSavedMsg] = useState(false)

  const last7 = useMemo(() => {
    const out: Array<{ key: string; label: string; val: number | null }> = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = isoDateKey(d)
      const val = state.moodLog[key]?.val ?? null
      const label = d.toLocaleDateString(undefined, { weekday: 'short' })
      out.push({ key, label, val })
    }
    return out
  }, [state.moodLog])

  const insights = useMemo(() => {
    const vals = last7.map((d) => d.val).filter((v): v is number => typeof v === 'number')
    if (!vals.length) {
      return { avg: null as number | null, best: null as { val: number; label: string } | null, count: 0 }
    }
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    const bestVal = Math.max(...vals)
    const best = last7.find((d) => d.val === bestVal) ?? null
    return { avg, best: best ? { val: bestVal, label: best.label } : null, count: vals.length }
  }, [last7])

  return (
    <div className="grid-main">
      <div>
        <div className="glass" style={{ marginBottom: 16 }}>
          <div className="card-head">
            <div className="card-title">How are you feeling today?</div>
          </div>

          <div className="mood-strip">
            {MOOD_EMOJIS.map((emoji, idx) => {
              const val = idx + 1
              const active = val === todayVal
              return (
                <button
                  key={val}
                  type="button"
                  className={`mood-btn${active ? ' active' : ''}`}
                  onClick={() => {
                    logMood(val, note.trim())
                    setSavedMsg(true)
                    toast.show(`Mood logged ${MOOD_EMOJIS[idx]}`)
                    window.setTimeout(() => setSavedMsg(false), 1400)
                  }}
                  aria-pressed={active}
                >
                  <div className="mood-emoji">{emoji}</div>
                  <div className="mood-label">{MOOD_LABELS[idx]}</div>
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,.25)',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                marginBottom: 8,
              }}
            >
              Add a note (optional)
            </div>
            <input
              className="edit-field"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's influencing your mood today?"
              style={{ marginBottom: 0 }}
            />
          </div>

          {savedMsg && (
            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 13, color: '#4ade80' }}>
              ✓ Mood logged for today
            </div>
          )}
        </div>

        <div className="glass">
          <div className="card-head">
            <div className="card-title">Mood this week</div>
          </div>

          <div className="mood-history">
            {last7.map((d) => {
              const val = d.val ?? 0
              const pct = val ? (val / 5) * 100 : 8
              const bg =
                val === 0
                  ? 'rgba(255,255,255,.08)'
                  : val <= 2
                    ? 'rgba(239,68,68,.22)'
                    : val === 3
                      ? 'rgba(245,158,11,.18)'
                      : val === 4
                        ? 'rgba(124,58,237,.22)'
                        : 'rgba(74,222,128,.22)'

              return (
                <div key={d.key} className="mh-day">
                  <div className="mh-bar" style={{ height: `${pct}%`, background: bg }} />
                  <div className="mh-lbl">{d.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="glass" style={{ marginBottom: 14 }}>
          <div className="card-title" style={{ marginBottom: 14 }}>
            Mood insights
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="glass-sm" style={{ padding: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--mono)', color: '#fff' }}>
                {insights.avg == null ? '—' : insights.avg.toFixed(1)}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 3 }}>7-day average</div>
            </div>

            <div className="glass-sm" style={{ padding: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--mono)', color: '#4ade80' }}>
                {insights.best ? `${MOOD_EMOJIS[(insights.best.val ?? 1) - 1]} ${MOOD_LABELS[(insights.best.val ?? 1) - 1]}` : '—'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 3 }}>best day this week</div>
            </div>

            <div className="glass-sm" style={{ padding: 14 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
                {insights.count < 2 ? 'Log a few days to see patterns.' : 'Your mood trend is starting to form — keep logging.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

