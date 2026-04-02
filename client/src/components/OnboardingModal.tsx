import { useState } from 'react'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'

export function OnboardingModal({ open }: { open: boolean }) {
  const { setState } = useStreak()
  const toast = useToast()
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [goal, setGoal] = useState('')

  if (!open) return null

  function submit() {
    const n = name.trim()
    if (!n) {
      toast.show('Please enter your name')
      return
    }
    setState((prev) => ({
      ...prev,
      profile: {
        name: n,
        handle: handle.trim().replace('@', '') || 'devhero',
        goal: goal.trim() || 'Build great habits',
      },
    }))
    toast.show(`Welcome, ${n}! 🎉`)
  }

  return (
    <div className="ob-overlay">
      <div className="ob-box">
        <div className="ob-logo">S</div>
        <div className="ob-title">Welcome to StreakOS</div>
        <div className="ob-sub">Your personal life operating system</div>

        <div className="field-lbl" style={{ marginTop: 0 }}>
          Your name
        </div>
        <input
          className="edit-field"
          placeholder="e.g. Alex"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="field-lbl">Username</div>
        <input
          className="edit-field"
          placeholder="e.g. devhero"
          maxLength={20}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />

        <div className="field-lbl">Main goal</div>
        <input
          className="edit-field"
          placeholder="e.g. Become a full-stack developer"
          maxLength={60}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{ marginBottom: 0 }}
        />

        <button type="button" className="ob-btn" onClick={submit}>
          Get started →
        </button>
      </div>
    </div>
  )
}
