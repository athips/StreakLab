import { useState } from 'react'
import { DAYS, HABITS, WEEK_DATA } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
import { calcGrade, getWeek } from '../lib/calc'

function ReviewJournal({
  wk,
  yr,
  grade,
  pct,
  initialWentWell,
  initialImprove,
  initialNext,
  onSaveReview,
  toast,
}: {
  wk: number
  yr: number
  grade: string
  pct: number
  initialWentWell: string
  initialImprove: string
  initialNext: string
  onSaveReview: (entry: {
    week: number
    year: number
    grade: string
    pct: number
    wentWell: string
    improve: string
    next: string
  }) => void
  toast: { show: (m: string) => void }
}) {
  const [wentWell, setWentWell] = useState(initialWentWell)
  const [improve, setImprove] = useState(initialImprove)
  const [next, setNext] = useState(initialNext)

  function onSave() {
    onSaveReview({
      week: wk,
      year: yr,
      grade,
      pct,
      wentWell: wentWell.trim(),
      improve: improve.trim(),
      next: next.trim(),
    })
    toast.show('✅ Review saved!')
  }

  return (
    <>
      <div className="review-section">
        <div className="review-lbl">✓ What went well?</div>
        <textarea
          className="review-ta"
          rows={3}
          placeholder="e.g. Maintained my coding streak 5 days straight..."
          value={wentWell}
          onChange={(e) => setWentWell(e.target.value)}
        />
      </div>

      <div className="review-section">
        <div className="review-lbl">↑ What to improve?</div>
        <textarea
          className="review-ta"
          rows={3}
          placeholder="e.g. Sleep schedule was inconsistent mid-week..."
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
        />
      </div>

      <div className="review-section">
        <div className="review-lbl">→ Next week&apos;s focus</div>
        <textarea
          className="review-ta"
          rows={2}
          placeholder="e.g. Hit 7h+ sleep every day..."
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
      </div>

      <button type="button" className="save-btn" onClick={onSave}>
        Save weekly review
      </button>
    </>
  )
}

export function Review() {
  const { state, saveReview } = useStreak()
  const toast = useToast()

  const wk = getWeek()
  const yr = new Date().getFullYear()
  const done = state.checkedHabits.length

  const allHabits = [...HABITS, ...state.customHabits]
  const pct = allHabits.length ? Math.round((done / allHabits.length) * 100) : 0
  const g = calcGrade(pct)

  const saved = state.reviews.find((r) => r.week === wk && r.year === yr)
  const journalKey = saved ? `${wk}-${yr}-${saved.date}` : `${wk}-${yr}-new`

  return (
    <div className="grid-main">
      <div>
        <div className="grade-hero">
          <div className="grade-letter">{g.g}</div>
          <div className="grade-info">
            <div className="grade-title">{g.t}</div>
            <div className="grade-sub">Keep the loop tight. Small improvements compound.</div>
            <div className="grade-nums">
              <div>
                <div className="gn-val">{pct}%</div>
                <div className="gn-lbl">completion</div>
              </div>
              <div>
                <div className="gn-val">{state.xpEarned}</div>
                <div className="gn-lbl">XP earned</div>
              </div>
              <div>
                <div className="gn-val">
                  {state.focusMinutes}
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)' }}>m</span>
                </div>
                <div className="gn-lbl">focused</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass" style={{ marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 14 }}>
            Habit breakdown
          </div>
          <div>
            {allHabits.map((h) => {
              const days = [...(WEEK_DATA[h.id] ?? [0, 0, 0, 0, 0, 0, 0])]
              if (state.checkedHabits.includes(h.id)) days[3] = 1
              const total = days.reduce((a, b) => a + b, 0)

              const dots = days.map((d, i) => {
                const bg = d
                  ? `${h.dot}80`
                  : i < 3
                    ? 'rgba(239,68,68,.2)'
                    : 'rgba(255,255,255,.06)'
                return <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: bg }} title={DAYS[i]} />
              })

              return (
                <div
                  key={h.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '9px 0',
                    borderBottom: '1px solid rgba(255,255,255,.05)',
                  }}
                >
                  <div style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{h.icon}</div>
                  <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,.45)' }}>{h.name}</div>
                  <div style={{ display: 'flex', gap: 3 }}>{dots}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'rgba(255,255,255,.25)' }}>{total}/7</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass">
          <div className="card-title" style={{ marginBottom: 14 }}>
            Journal
          </div>
          <ReviewJournal
            key={journalKey}
            wk={wk}
            yr={yr}
            grade={g.g}
            pct={pct}
            initialWentWell={saved?.wentWell ?? ''}
            initialImprove={saved?.improve ?? ''}
            initialNext={saved?.next ?? ''}
            onSaveReview={saveReview}
            toast={toast}
          />
        </div>
      </div>

      <div>
        <div className="glass">
          <div className="card-title" style={{ marginBottom: 14 }}>
            Past reviews
          </div>

          {!state.reviews.length ? (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', padding: '6px 0' }}>
              No past reviews yet.
            </div>
          ) : (
            <div>
              {state.reviews.slice(0, 8).map((r) => (
                <div key={`${r.week}-${r.year}`} className="past-card">
                  <div className="pc-head">
                    <span className="pc-week">
                      Week {r.week}, {r.year} · {r.date}
                    </span>
                    <span className="pc-grade">
                      {r.grade} <span style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>{r.pct}%</span>
                    </span>
                  </div>
                  <div className="pc-body">
                    {r.wentWell ? <>✓ {r.wentWell}<br /></> : null}
                    {r.improve ? <>↑ {r.improve}<br /></> : null}
                    {r.next ? <>→ {r.next}</> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
