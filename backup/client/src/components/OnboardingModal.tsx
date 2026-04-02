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
    <div className="fixed inset-0 z-[9998] flex items-end justify-center bg-black/55">
      <div className="w-full max-w-[480px] animate-[slideUp_0.35s_ease] rounded-t-[24px] bg-white px-[22px] pb-9 pt-7">
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div className="mb-3 text-center text-[52px]">👋</div>
        <div className="mb-1.5 text-center font-display text-[22px] font-black text-[#1f1f1f]">
          Welcome to StreakLab!
        </div>
        <div className="mb-6 text-center text-sm font-semibold text-[#afafaf]">
          Tell us about yourself to get started
        </div>
        <input
          className="mb-2.5 w-full rounded-xl border-2 border-[#e5e5e5] bg-white px-3.5 py-2.5 font-body text-sm font-bold text-[#3c3c3c] outline-none transition-[border-color] focus:border-[#1cb0f6]"
          placeholder="Your name (e.g. Alex)"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="mb-2.5 w-full rounded-xl border-2 border-[#e5e5e5] bg-white px-3.5 py-2.5 font-body text-sm font-bold text-[#3c3c3c] outline-none transition-[border-color] focus:border-[#1cb0f6]"
          placeholder="Username (e.g. devhero)"
          maxLength={20}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <input
          className="mb-[18px] w-full rounded-xl border-2 border-[#e5e5e5] bg-white px-3.5 py-2.5 font-body text-sm font-bold text-[#3c3c3c] outline-none transition-[border-color] focus:border-[#1cb0f6]"
          placeholder="Your #1 goal (e.g. Become a dev)"
          maxLength={60}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button
          type="button"
          className="w-full rounded-[14px] border-none bg-[#1cb0f6] py-3.5 font-display text-[15px] font-black text-white shadow-[0_4px_0_#0e8bc9] transition-[transform,box-shadow] active:translate-y-[3px] active:shadow-[0_1px_0_#0e8bc9]"
          onClick={submit}
        >
          Let&apos;s go! 🚀
        </button>
      </div>
    </div>
  )
}
