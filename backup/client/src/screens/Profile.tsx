import { useEffect, useState } from 'react'
import { BADGES } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
import { calcLevel } from '../lib/calc'
export function Profile({
  onGoReview,
}: {
  onGoReview: () => void
}) {
  const { state, setProfile, setSettings, exportJson, resetAll } = useStreak()
  const toast = useToast()
  const lv = calcLevel(state.totalXP)
  const [name, setName] = useState(state.profile.name)
  const [handle, setHandle] = useState(state.profile.handle)
  const [goal, setGoal] = useState(state.profile.goal)

  useEffect(() => {
    setName(state.profile.name)
    setHandle(state.profile.handle)
    setGoal(state.profile.goal)
  }, [state.profile.name, state.profile.handle, state.profile.goal])

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
    <div className="pb-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-[#1f1f1f]">Profile 👤</h1>
        <button
          type="button"
          onClick={onGoReview}
          className="cursor-pointer rounded-full bg-[#f4e6ff] px-3 py-1.5 font-display text-xs font-black text-[#6b3fa0]"
        >
          📝 Review
        </button>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1cb0f6] to-[#38d9a9] px-6 py-6 text-center text-white">
        <div className="pointer-events-none absolute -right-8 -top-8 h-[130px] w-[130px] rounded-full bg-white/10" />
        <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-white/60 bg-white/20 text-[40px]">
          🧑‍💻
          <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-[#ffd900] px-1.5 py-0.5 font-display text-[10px] font-black text-[#7a5a00]">
            Lv.{lv}
          </div>
        </div>
        <div className="font-display text-[22px] font-black">{state.profile.name || 'Your Name'}</div>
        <div className="text-[13px] font-bold opacity-80">@{state.profile.handle || 'username'}</div>
        <div className="mt-1.5 text-xs font-semibold opacity-70">
          {state.profile.goal || 'Add your goal to get started'}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[14px] bg-white/20">
          <div className="bg-white/15 px-2 py-3 text-center">
            <div className="font-display text-lg font-black">{state.streak}</div>
            <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.04em] opacity-80">Streak</div>
          </div>
          <div className="bg-white/15 px-2 py-3 text-center">
            <div className="font-display text-lg font-black">{state.totalXP}</div>
            <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.04em] opacity-80">Total XP</div>
          </div>
          <div className="bg-white/15 px-2 py-3 text-center">
            <div className="font-display text-lg font-black">{lv}</div>
            <div className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.04em] opacity-80">Level</div>
          </div>
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">Badges</div>
      <div className="mb-3.5 grid grid-cols-4 gap-2.5">
        {BADGES.map((b) => {
          const on = b.baseEarned || earned.has(b.id)
          return (
            <div
              key={b.id}
              className={`rounded-[14px] border-2 px-2 py-3 text-center ${
                on ? 'border-[#fff0a0] bg-[#fffbd0]' : 'border-[#e5e5e5] bg-[#f7f7f7]'
              }`}
            >
              <div className={`mb-1 text-2xl ${on ? '' : 'opacity-30'}`}>{b.emoji}</div>
              <div
                className={`text-[9px] font-extrabold uppercase tracking-[0.03em] ${on ? 'text-[#7a5a00]' : 'text-[#afafaf]'}`}
              >
                {b.name}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Edit profile
      </div>
      <div className="mb-3.5 rounded-[20px] border-2 border-[#e5e5e5] bg-white p-[18px]">
        <div className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.04em] text-[#afafaf]">Display name</div>
        <input
          className="mb-3 w-full rounded-xl border-2 border-[#e5e5e5] px-3.5 py-2.5 font-body text-sm font-bold outline-none focus:border-[#1cb0f6]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <div className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.04em] text-[#afafaf]">Username</div>
        <input
          className="mb-3 w-full rounded-xl border-2 border-[#e5e5e5] px-3.5 py-2.5 font-body text-sm font-bold outline-none focus:border-[#1cb0f6]"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@username"
        />
        <div className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.04em] text-[#afafaf]">Main goal</div>
        <input
          className="mb-4 w-full rounded-xl border-2 border-[#e5e5e5] px-3.5 py-2.5 font-body text-sm font-bold outline-none focus:border-[#1cb0f6]"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Your #1 goal"
        />
        <button
          type="button"
          onClick={save}
          className="w-full rounded-[14px] border-none bg-[#1cb0f6] py-3 font-display text-[15px] font-black text-white shadow-[0_4px_0_#0e8bc9] active:translate-y-[3px] active:shadow-[0_1px_0_#0e8bc9]"
        >
          Save changes
        </button>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">Settings</div>
      <div className="mb-3.5 rounded-[20px] border-2 border-[#e5e5e5] bg-white p-[18px]">
        <div className="flex items-center justify-between border-b-2 border-[#e5e5e5] py-3.5">
          <div>
            <div className="text-sm font-bold text-[#3c3c3c]">Daily reminder</div>
            <div className="mt-0.5 text-xs font-semibold text-[#afafaf]">Get nudged if you haven&apos;t checked in</div>
          </div>
          <button
            type="button"
            aria-pressed={state.settings.reminder}
            onClick={() => setSettings('reminder', !state.settings.reminder)}
            className={`h-[26px] w-[46px] shrink-0 rounded-full border-none transition-colors after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-[left] relative ${
              state.settings.reminder ? 'bg-[#58cc02] after:left-[23px]' : 'bg-[#e5e5e5]'
            }`}
          />
        </div>
        <div className="flex items-center justify-between border-b-2 border-[#e5e5e5] py-3.5">
          <div>
            <div className="text-sm font-bold text-[#3c3c3c]">Streak freeze</div>
            <div className="mt-0.5 text-xs font-semibold text-[#afafaf]">Protect streak on missed days</div>
          </div>
          <button
            type="button"
            aria-pressed={state.settings.freeze}
            onClick={() => setSettings('freeze', !state.settings.freeze)}
            className={`h-[26px] w-[46px] shrink-0 rounded-full border-none transition-colors after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-[left] relative ${
              state.settings.freeze ? 'bg-[#58cc02] after:left-[23px]' : 'bg-[#e5e5e5]'
            }`}
          />
        </div>
        <div className="flex items-center justify-between py-3.5">
          <div>
            <div className="text-sm font-bold text-[#3c3c3c]">Sound effects</div>
            <div className="mt-0.5 text-xs font-semibold text-[#afafaf]">Play sounds on completion</div>
          </div>
          <button
            type="button"
            aria-pressed={state.settings.sound}
            onClick={() => setSettings('sound', !state.settings.sound)}
            className={`h-[26px] w-[46px] shrink-0 rounded-full border-none transition-colors after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-[left] relative ${
              state.settings.sound ? 'bg-[#58cc02] after:left-[23px]' : 'bg-[#e5e5e5]'
            }`}
          />
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">Data</div>
      <div className="rounded-[20px] border-2 border-[#e5e5e5] bg-white p-[18px]">
        <p className="mb-3 text-[13px] font-bold leading-relaxed text-[#afafaf]">
          Your data is saved locally in this browser. The API can sync to the server when configured. Clears if you clear
          browser data.
        </p>
        <button
          type="button"
          onClick={() => {
            exportJson()
            toast.show('📤 Exported!')
          }}
          className="mb-2 w-full rounded-[14px] border-2 border-[#1cb0f6] bg-[#e8f7ff] py-3 font-display text-sm font-extrabold text-[#1cb0f6]"
        >
          📤 Export my data (JSON)
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm('Reset ALL data? This cannot be undone.')) {
              resetAll()
              setName('')
              setHandle('')
              setGoal('')
            }
          }}
          className="w-full rounded-[14px] border-2 border-[#ff4b4b] bg-transparent py-3 font-display text-sm font-extrabold text-[#ff4b4b]"
        >
          🗑️ Reset all data
        </button>
      </div>
    </div>
  )
}
