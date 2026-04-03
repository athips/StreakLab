import { useState } from 'react'
import { DevNativeModal } from '../components/DevNativeModal'
import { SKILL_LEVELS } from '../devNativeData'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
import type { SkillRoadmapItem } from '../types'

function habitCheckSvg() {
  return (
    <svg viewBox="0 0 10 10" fill="none">
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

export function SkillRoadmap() {
  const { state, toggleSkillMilestone, logSkillStudy } = useStreak()
  const toast = useToast()
  const [modal, setModal] = useState<'add' | { edit: string } | null>(null)
  const [studyId, setStudyId] = useState<string | null>(null)
  const [studyHrs, setStudyHrs] = useState('')

  const allMs = state.skills.reduce((a, s) => a + (s.milestones?.length || 0), 0)
  const doneMs = state.skills.reduce(
    (a, s) => a + (s.milestones?.filter((m) => m.done).length || 0),
    0,
  )
  const totalHrs = state.skills.reduce((a, s) => a + (s.hours || 0), 0)

  const editing = modal && typeof modal === 'object' ? state.skills.find((s) => s.id === modal.edit) : null

  function progColor(level: SkillRoadmapItem['level']) {
    if (level === 'proficient') return '#4ade80'
    if (level === 'learning') return '#60a5fa'
    if (level === 'exploring') return '#fbbf24'
    return 'rgba(255,255,255,.2)'
  }

  function submitStudy() {
    if (!studyId) return
    const h = parseFloat(studyHrs)
    if (Number.isNaN(h) || h <= 0) return
    logSkillStudy(studyId, h)
    const sk = state.skills.find((s) => s.id === studyId)
    toast(`+${Math.round(h * 8)} XP · ${h}h${sk ? ` on ${sk.name}` : ''}`)
    setStudyId(null)
    setStudyHrs('')
  }

  return (
    <>
      <div className="read-stat-strip">
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">{state.skills.length}</div>
          <div className="hstat-lbl">skills tracked</div>
        </div>
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">
            {doneMs}/{allMs}
          </div>
          <div className="hstat-lbl">milestones</div>
        </div>
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">
            {totalHrs}
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>h</span>
          </div>
          <div className="hstat-lbl">studied</div>
        </div>
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">{state.skillXP}</div>
          <div className="hstat-lbl">XP from skills</div>
        </div>
      </div>

      <div className="roadmap-legend">
        {SKILL_LEVELS.map((l) => (
          <div key={l.id} className="rl-item">
            <span className="rl-dot" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>Skill learning roadmap</div>
        <button
          type="button"
          className="skill-log-btn"
          onClick={() => setModal('add')}
        >
          + Add skill
        </button>
      </div>

      <div className="skills-grid">
        {!state.skills.length ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,.2)', fontSize: 14 }}>
            No skills tracked yet — build your roadmap!
          </div>
        ) : (
          state.skills.map((sk) => {
            const lv = SKILL_LEVELS.find((l) => l.id === sk.level) ?? SKILL_LEVELS[0]
            const prog = sk.progress || 0
            const pc = progColor(sk.level)
            const msHtml = (sk.milestones || []).map((m) => (
              <button
                key={m.id}
                type="button"
                className={`milestone${m.done ? ' done-m' : ''}`}
                onClick={() => {
                  toggleSkillMilestone(sk.id, m.id)
                  if (!m.done) toast(`+${m.xp} XP · ${m.text}`)
                }}
              >
                <div className={`ms-check${m.done ? ' on' : ''}`}>{habitCheckSvg()}</div>
                <div className="ms-text">{m.text}</div>
                <div className="ms-xp">{m.done ? `+${m.xp} ✓` : `+${m.xp}`}</div>
              </button>
            ))

            return (
              <div key={sk.id} className="skill-card">
                <div className="skill-header">
                  <div className="skill-icon" style={{ background: `${pc}15` }}>
                    {sk.icon || '⚡'}
                  </div>
                  <div>
                    <div className="skill-name">{sk.name}</div>
                    <div className="skill-category">
                      {sk.category || 'Other'} · {sk.hours || 0}h studied
                    </div>
                  </div>
                  <div
                    className="skill-level-badge"
                    style={{ color: lv.color, background: lv.bg, borderColor: lv.border }}
                  >
                    {lv.label}
                  </div>
                </div>
                <div className="skill-progress-wrap">
                  <div className="skill-progress-track">
                    <div className="skill-progress-fill" style={{ width: `${prog}%`, background: pc }} />
                  </div>
                  <div className="skill-progress-labels">
                    <span>{prog}%</span>
                    <span>{sk.goal || 'No goal set'}</span>
                  </div>
                </div>
                {msHtml.length ? <div className="skill-milestones">{msHtml}</div> : null}
                <div className="skill-footer">
                  <div className="skill-sessions">
                    {sk.sessions || 0} sessions · last:{' '}
                    {sk.lastStudied ? new Date(sk.lastStudied).toLocaleDateString() : 'never'}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" className="skill-log-btn" onClick={() => setStudyId(sk.id)}>
                      + Study session
                    </button>
                    <button type="button" className="proj-edit-btn" onClick={() => setModal({ edit: sk.id })}>
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
        <DevNativeModal variant="skill" editingId={null} onClose={() => setModal(null)} initialSkill={{}} />
      ) : null}
      {editing ? (
        <DevNativeModal
          variant="skill"
          editingId={editing.id}
          onClose={() => setModal(null)}
          initialSkill={editing}
        />
      ) : null}

      {studyId ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-box dev-modal-box">
            <div className="modal-title">Study session</div>
            <div className="modal-sub">Log hours (XP = 8× hours)</div>
            <input
              className="glass-input"
              type="number"
              min={0}
              step={0.25}
              value={studyHrs}
              onChange={(e) => setStudyHrs(e.target.value)}
              placeholder="e.g. 1.5"
              autoFocus
            />
            <div className="modal-btns" style={{ marginTop: 20 }}>
              <button type="button" className="modal-cancel" onClick={() => setStudyId(null)}>
                Cancel
              </button>
              <button type="button" className="modal-save" onClick={submitStudy}>
                Log →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
