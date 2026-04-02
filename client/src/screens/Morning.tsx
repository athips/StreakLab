import { ROUTINE } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'

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

export function Morning() {
  const { state, toggleRoutine } = useStreak()
  const toast = useToast()

  const rdone = state.checkedRoutine.length
  const rpct = Math.round((rdone / ROUTINE.length) * 100)
  const timeSaved = state.checkedRoutine.reduce((acc, id) => {
    const r = ROUTINE.find((x) => x.id === id)
    return acc + (r?.mins ?? 0)
  }, 0)

  const name = state.profile.name ? state.profile.name.split(' ')[0] : 'there'

  return (
    <div className="grid-main">
      <div>
        <div className="glass" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-.02em' }}>
                Good morning, <span style={{ color: '#fbbf24' }}>{name}</span>.
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.3)', marginTop: 4, marginBottom: 20 }}>
                Your morning routine
              </div>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
              <span>{rpct}</span>%
            </div>
          </div>

          <div className="progress-track" style={{ maxWidth: '100%', width: '100%', marginBottom: 20, height: 3 }}>
            <div className="progress-fill" style={{ width: `${rpct}%` }} />
          </div>

          <div>
            {ROUTINE.map((r) => {
              const done = state.checkedRoutine.includes(r.id)
              return (
                <div
                  key={r.id}
                  className={`routine-row${done ? ' done' : ''}`}
                  onClick={() => {
                    toggleRoutine(r.id)
                    if (!done) toast.show(`✅ ${r.title} done!`)
                  }}
                >
                  <div className={`rr-check${done ? ' on' : ''}`}>{done ? habitCheckSvg() : null}</div>
                  <div className="rr-icon">{r.icon}</div>
                  <div className="rr-title">{r.title}</div>
                  <div className="rr-dur">{r.mins}m</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="glass" style={{ marginBottom: 14 }}>
          <div className="card-title" style={{ marginBottom: 14 }}>
            Morning stats
          </div>
          <div className="grid2" style={{ gap: 10 }}>
            <div className="glass-sm" style={{ padding: 14 }}>
              <div className="hstat-val" style={{ fontSize: 22 }}>
                {rdone}
              </div>
              <div className="hstat-lbl">done</div>
            </div>
            <div className="glass-sm" style={{ padding: 14 }}>
              <div className="hstat-val" style={{ fontSize: 22 }}>
                {state.streak}
              </div>
              <div className="hstat-lbl">day streak</div>
            </div>
            <div className="glass-sm" style={{ padding: 14, gridColumn: '1 / -1' }}>
              <div className="hstat-val" style={{ fontSize: 22 }}>
                {timeSaved}
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>m</span>
              </div>
              <div className="hstat-lbl">time saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
