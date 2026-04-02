import { useState } from 'react'
import { BADGES } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
import { calcLevel } from '../lib/calc'

export function Profile({ onGoReview }: { onGoReview: () => void }) {
  const { state, setProfile, setSettings, exportJson, resetAll } = useStreak()
  const toast = useToast()

  const lv = calcLevel(state.totalXP)
  const [name, setName] = useState(state.profile.name)
  const [handle, setHandle] = useState(state.profile.handle)
  const [goal, setGoal] = useState(state.profile.goal)

  const earned = new Set<string>(['first'])
  if (state.streak >= 7) earned.add('week1')
  if (state.focusMinutes >= 300) earned.add('focus')
  if (state.checkedHabits.length > 0) earned.add('coder')

  function save() {
    setProfile({
      name: name.trim() || state.profile.name,
      handle: handle.trim().replace('@', '') || state.profile.handle,
      goal: goal.trim() || state.profile.goal,
    })
    toast.show('Profile saved! 🎉')
  }

  return (
    <div>
      <div className="profile-hero">
        <div className="ph-av" id="ph-av" style={{ cursor: 'default' }}>
          {state.profile.name ? state.profile.name[0].toUpperCase() : '?'}
          <div className="ph-badge" id="ph-badge">
            Lv.{lv}
          </div>
        </div>

        <div style={{ position: 'relative', flex: 1 }}>
          <div className="ph-name" id="ph-name">
            {state.profile.name || 'Your Name'}
          </div>
          <div className="ph-handle" id="ph-handle">
            @{state.profile.handle || 'username'}
          </div>
          <div className="ph-goal" id="ph-goal">
            {state.profile.goal || 'Add your goal to get started'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          <button
            type="button"
            className="card-action"
            style={{ alignSelf: 'flex-end' }}
            onClick={onGoReview}
          >
            📝 Review
          </button>
          <div className="ph-stats" aria-hidden>
            <div>
              <div className="phs-val">{state.streak}</div>
              <div className="phs-lbl">streak</div>
            </div>
            <div>
              <div className="phs-val">{state.totalXP}</div>
              <div className="phs-lbl">total XP</div>
            </div>
            <div>
              <div className="phs-val">{lv}</div>
              <div className="phs-lbl">level</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-title" style={{ marginBottom: 12 }}>
        Badges
      </div>
      <div className="badge-grid" id="badge-grid">
        {BADGES.map((b) => {
          const on = b.baseEarned || earned.has(b.id)
          return (
            <div key={b.id} className={`badge-tile${on ? ' earned' : ''}`}>
              <div className="be">{b.emoji}</div>
              <div className="bn">{b.name}</div>
            </div>
          )
        })}
      </div>

      <div className="grid-main">
        <div>
          <div className="glass" style={{ marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 16 }}>
              Edit profile
            </div>

            <div className="field-lbl">Display name</div>
            <input className="edit-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

            <div className="field-lbl">Username</div>
            <input
              className="edit-field"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@username"
            />

            <div className="field-lbl">Main goal</div>
            <input
              className="edit-field"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Your #1 goal"
              style={{ marginBottom: 0 }}
            />

            <button type="button" className="save-btn" onClick={save}>
              Save changes
            </button>
          </div>
        </div>

        <div>
          <div className="glass" style={{ marginBottom: 14 }}>
            <div className="card-title" style={{ marginBottom: 14 }}>
              Settings
            </div>

            <div className="s-row">
              <div>
                <div className="s-lbl">Daily reminder</div>
                <div className="s-sub">Get nudged if you haven&apos;t checked in</div>
              </div>
              <button
                type="button"
                className={`toggle ${state.settings.reminder ? 'on' : 'off'}`}
                aria-pressed={state.settings.reminder}
                onClick={() => setSettings('reminder', !state.settings.reminder)}
              />
            </div>

            <div className="s-row">
              <div>
                <div className="s-lbl">Streak freeze</div>
                <div className="s-sub">Protect streak on missed days</div>
              </div>
              <button
                type="button"
                className={`toggle ${state.settings.freeze ? 'on' : 'off'}`}
                aria-pressed={state.settings.freeze}
                onClick={() => setSettings('freeze', !state.settings.freeze)}
              />
            </div>

            <div className="s-row">
              <div>
                <div className="s-lbl">Rescue challenges</div>
                <div className="s-sub">Show rescue when streak at risk</div>
              </div>
              <button
                type="button"
                className={`toggle ${state.settings.rescue ? 'on' : 'off'}`}
                aria-pressed={state.settings.rescue}
                onClick={() => setSettings('rescue', !state.settings.rescue)}
              />
            </div>
          </div>

          <div className="glass">
            <div className="card-title" style={{ marginBottom: 12 }}>
              Data
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginBottom: 14, lineHeight: 1.6 }}>
              Your data is saved locally in this browser. The API can sync to the server when configured. Clears if you clear
              browser data.
            </div>

            <button
              type="button"
              className="action-btn"
              onClick={() => {
                exportJson()
                toast.show('📤 Exported!')
              }}
            >
              📤 Export my data (JSON)
            </button>
            <button
              type="button"
              className="danger-btn"
              onClick={() => {
                if (confirm('Reset ALL data? This cannot be undone.')) {
                  resetAll()
                  setName('')
                  setHandle('')
                  setGoal('')
                }
              }}
            >
              🗑️ Reset all data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
