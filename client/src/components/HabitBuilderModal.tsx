import { useMemo, useState } from 'react'
import { COLORS, EMOJIS } from '../streakos4Data'
import type { Habit, HabitFrequency } from '../types'
import { useToast } from '../hooks/useToast'

const FREQ_TABS: Array<{ id: HabitFrequency; label: string }> = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekly', label: 'Weekly' },
]

export function HabitBuilderModal({
  onClose,
  onAddCustomHabit,
}: {
  onClose: () => void
  onAddCustomHabit: (habit: Habit) => void
}) {
  const toast = useToast()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState<(typeof EMOJIS)[number]>(EMOJIS[0])
  const [color, setColor] = useState<(typeof COLORS)[number]>(COLORS[0])
  const [freq, setFreq] = useState<HabitFrequency>('daily')
  const [xp, setXp] = useState(10)

  const xpLabel = useMemo(() => `+${xp} XP`, [xp])

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title">Add custom habit</div>
        <div className="modal-sub">Design your own habit with XP reward and frequency</div>

        <div className="field-lbl" style={{ marginTop: 0 }}>
          Habit name
        </div>
        <input
          className="edit-field"
          placeholder="e.g. Read 30 minutes"
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <div className="field-lbl" style={{ marginTop: 0 }}>
          Choose emoji
        </div>
        <div className="emoji-grid">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              className={`emoji-opt${e === emoji ? ' sel' : ''}`}
              onClick={() => setEmoji(e)}
              aria-pressed={e === emoji}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="field-lbl" style={{ marginTop: 0 }}>
          Accent color
        </div>
        <div className="color-grid">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`color-opt${c === color ? ' sel' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-pressed={c === color}
            />
          ))}
        </div>

        <div className="field-lbl" style={{ marginTop: 0 }}>
          Frequency
        </div>
        <div className="freq-tabs">
          {FREQ_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`freq-tab${t.id === freq ? ' active' : ''}`}
              onClick={() => setFreq(t.id)}
              aria-pressed={t.id === freq}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="xp-slider-wrap">
          <label>
            XP reward <span>{xpLabel}</span>
          </label>
          <input type="range" min={5} max={25} value={xp} step={5} onChange={(e) => setXp(parseInt(e.target.value, 10))} />
        </div>

        <div className="modal-btns">
          <button type="button" className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="modal-save"
            onClick={() => {
              const trimmed = name.trim()
              if (!trimmed) {
                toast.show('Please enter a habit name')
                return
              }
              const newHabit: Habit = {
                id: `custom_${Date.now()}`,
                name: trimmed,
                icon: emoji,
                streak: 0,
                xp,
                bg: color,
                dot: color,
                custom: true,
                freq,
              }
              onAddCustomHabit(newHabit)
              toast.show(`Habit added: ${trimmed} 🎯`)
              onClose()
            }}
          >
            Add habit →
          </button>
        </div>
      </div>
    </div>
  )
}

