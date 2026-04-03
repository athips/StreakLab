import { useState } from 'react'
import { DevNativeModal } from '../components/DevNativeModal'
import { useNow } from '../hooks/useNow'
import { PROJ_STATUSES } from '../devNativeData'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
export function SideProjects() {
  const { state, logProjectSession } = useStreak()
  const toast = useToast()
  const now = useNow()
  const [modal, setModal] = useState<'add' | { edit: string } | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [hrs, setHrs] = useState('')
  const [pct, setPct] = useState('')

  const shipped = state.projects.filter((p) => p.status === 'shipped').length
  const totalHrs = state.projects.reduce((a, p) => a + (p.hours || 0), 0)

  const editing = modal && typeof modal === 'object' ? state.projects.find((p) => p.id === modal.edit) : null

  function openSession(id: string, currentPct: number) {
    setSessionId(id)
    setHrs('')
    setPct(String(currentPct))
  }

  function submitSession() {
    if (!sessionId) return
    const h = parseFloat(hrs)
    if (Number.isNaN(h) || h <= 0) return
    const progress = parseInt(pct, 10)
    logProjectSession(sessionId, h, Number.isNaN(progress) ? 0 : progress)
    const p = state.projects.find((x) => x.id === sessionId)
    toast(`+${Math.round(h * 10)} XP · ${h}h logged${p ? ` on ${p.name}` : ''}`)
    setSessionId(null)
  }

  return (
    <>
      <div className="read-stat-strip">
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">{state.projects.filter((p) => p.status === 'building').length}</div>
          <div className="hstat-lbl">active builds</div>
        </div>
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">{shipped}</div>
          <div className="hstat-lbl">shipped</div>
        </div>
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">
            {totalHrs}
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>h</span>
          </div>
          <div className="hstat-lbl">total logged</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>Side projects</div>
        <button
          type="button"
          className="proj-log-btn"
          style={{ borderColor: 'rgba(74,222,128,.45)' }}
          onClick={() => setModal('add')}
        >
          + New project
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!state.projects.length ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,.2)', fontSize: 14 }}>
            No projects yet — start tracking your first one!
          </div>
        ) : (
          state.projects.map((p) => {
            const st = PROJ_STATUSES.find((s) => s.id === p.status) ?? PROJ_STATUSES[0]
            const prog = p.progress || 0
            const staleDays = p.lastWorked
              ? Math.floor((now - new Date(p.lastWorked).getTime()) / (1000 * 60 * 60 * 24))
              : 999
            const stale = p.status === 'building' && staleDays > 3

            return (
              <div key={p.id} className="proj-card">
                <div className="proj-header">
                  <div className="proj-icon" style={{ background: `${p.color || 'rgba(255,255,255,.08)'}18` }}>
                    {p.icon || '💡'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="proj-name">{p.name}</div>
                    <div className="proj-desc">{p.desc || 'No description'}</div>
                  </div>
                  <div
                    className="proj-status"
                    style={{ color: st.color, background: st.bg, borderColor: st.border }}
                  >
                    <div className="status-dot" style={{ background: st.color }} />
                    {st.label}
                  </div>
                </div>
                <div className="proj-stats-row">
                  <span className="proj-stat">⏱ {p.hours || 0}h logged</span>
                  {p.goalHours ? <span className="proj-stat">🎯 {p.goalHours}h/week goal</span> : null}
                  {stale ? (
                    <span
                      className="proj-stat"
                      style={{ color: '#fbbf24', borderColor: 'rgba(251,191,36,.2)' }}
                    >
                      <span className="stale-dot" /> {staleDays}d since last session
                    </span>
                  ) : null}
                  {p.repo ? (
                    <a
                      className="proj-stat"
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      style={{ cursor: 'pointer', color: '#60a5fa', textDecoration: 'none' }}
                    >
                      ⌥ repo
                    </a>
                  ) : null}
                  {(p.tech || []).map((t) => (
                    <span key={t} className="proj-stat">
                      {t}
                    </span>
                  ))}
                </div>
                {p.status !== 'ideation' ? (
                  <div className="proj-progress-track">
                    <div
                      className="proj-progress-fill"
                      style={{ width: `${prog}%`, background: p.color || '#60a5fa' }}
                    />
                  </div>
                ) : null}
                <div className="proj-footer">
                  <div className="proj-footer-left">
                    {p.status !== 'ideation' ? `${prog}% complete` : ''}{' '}
                    {p.lastWorked ? `· last: ${new Date(p.lastWorked).toLocaleDateString()}` : ''}
                  </div>
                  <div className="proj-actions">
                    {p.status === 'building' ? (
                      <button type="button" className="proj-log-btn" onClick={() => openSession(p.id, prog)}>
                        + Log session
                      </button>
                    ) : null}
                    <button type="button" className="proj-edit-btn" onClick={() => setModal({ edit: p.id })}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {modal === 'add' ? (
        <DevNativeModal variant="project" editingId={null} onClose={() => setModal(null)} initialProject={{}} />
      ) : null}
      {editing ? (
        <DevNativeModal
          variant="project"
          editingId={editing.id}
          onClose={() => setModal(null)}
          initialProject={editing}
        />
      ) : null}

      {sessionId ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-box dev-modal-box">
            <div className="modal-title">Log session</div>
            <div className="modal-sub">Hours and completion %</div>
            <div className="field-lbl" style={{ marginTop: 0 }}>
              Hours (e.g. 1.5)
            </div>
            <input
              className="glass-input"
              type="number"
              min={0}
              step={0.25}
              value={hrs}
              onChange={(e) => setHrs(e.target.value)}
              style={{ marginBottom: 10 }}
              autoFocus
            />
            <div className="field-lbl" style={{ marginTop: 0 }}>
              Completion %
            </div>
            <input
              className="glass-input"
              type="number"
              min={0}
              max={100}
              value={pct}
              onChange={(e) => setPct(e.target.value)}
            />
            <div className="modal-btns" style={{ marginTop: 20 }}>
              <button type="button" className="modal-cancel" onClick={() => setSessionId(null)}>
                Cancel
              </button>
              <button type="button" className="modal-save" onClick={submitSession}>
                Save →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
