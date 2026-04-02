import { HABITS } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'

const weekPattern = [1, 1, 1, 1, 1, 0, 0]

export function Habits() {
  const { state, toggleHabit } = useStreak()
  const toast = useToast()
  const done = state.checkedHabits.length
  const rem = HABITS.length - done
  const toNext = Math.max(0, 20 - state.streak)
  const pct = Math.min(100, (state.streak / 20) * 100)

  return (
    <div className="pb-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-[#1f1f1f]">Habits 🔥</h1>
        <div className="flex items-center gap-1 rounded-full bg-[#ffd900] px-3.5 py-1.5 font-display text-xs font-black text-[#7a5a00]">
          ⚡ {state.totalXP} XP
        </div>
      </div>

      <div className="relative mb-4 flex items-center justify-between overflow-hidden rounded-[20px] bg-gradient-to-br from-[#ff6b35] to-[#ff9a5c] px-5 py-5 text-white">
        <div className="pointer-events-none absolute -right-8 -top-8 h-[120px] w-[120px] rounded-full bg-white/10" />
        <div>
          <div className="mb-1.5 text-[28px] leading-none">🔥</div>
          <div className="text-xs font-extrabold uppercase tracking-[0.06em] opacity-80">DAY STREAK</div>
          <div className="mt-2.5 h-2 w-[140px] rounded-full bg-white/30">
            <div className="h-2 rounded-full bg-white transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1.5 text-[11px] font-bold opacity-90">
            {toNext > 0 ? `${toNext} days to Bronze Shield 🛡️` : 'Bronze Shield earned! 🛡️'}
          </div>
        </div>
        <div className="relative text-right">
          <div className="font-display text-[64px] font-black leading-none">{state.streak}</div>
          <div className="text-[13px] font-extrabold opacity-80">days</div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="flex-1 rounded-[14px] bg-[#e9ffd4] px-3 py-3 text-center">
          <div className="font-display text-[22px] font-black text-[#1f1f1f]">{done}</div>
          <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">Done</div>
        </div>
        <div className="flex-1 rounded-[14px] bg-[#fff0eb] px-3 py-3 text-center">
          <div className="font-display text-[22px] font-black text-[#1f1f1f]">{rem}</div>
          <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">Left</div>
        </div>
        <div className="flex-1 rounded-[14px] bg-[#e8f7ff] px-3 py-3 text-center">
          <div className="font-display text-[22px] font-black text-[#1f1f1f]">+{state.xpEarned}</div>
          <div className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">XP Today</div>
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Today&apos;s habits
      </div>

      <div className="space-y-2.5">
        {HABITS.map((h) => {
          const isDone = state.checkedHabits.includes(h.id)
          const dots = weekPattern.map((f, i) => {
            const on = f === 1 || (isDone && i === 4)
            return (
              <div
                key={i}
                className="h-[9px] w-[9px] rounded-full"
                style={{ background: on ? h.dot : 'var(--color-sl-gray-mid)' }}
              />
            )
          })
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => {
                if (isDone) {
                  toggleHabit(h.id, h.xp)
                  toast.show(`Unchecked ${h.name}`)
                } else {
                  toggleHabit(h.id, h.xp)
                  const m = ['💪 +' + h.xp + ' XP!', '🔥 Streak growing!', '⚡ Keep going!', '🎉 Crushed it!']
                  toast.show(m[Math.floor(Math.random() * m.length)])
                }
              }}
              className={`flex w-full cursor-pointer select-none items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-[border-color,background,transform] active:scale-[0.98] ${
                isDone ? 'border-transparent' : 'border-[#e5e5e5] bg-white'
              }`}
              style={isDone ? { background: h.bg } : undefined}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] text-[22px]"
                style={{ background: h.bg }}
              >
                {h.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[15px] font-extrabold text-[#1f1f1f]">{h.name}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#afafaf]">
                  <span className="text-[#ff6b35]">🔥</span>
                  {h.streak + (isDone ? 1 : 0)} day streak · +{h.xp} XP
                </div>
                <div className="mt-1.5 flex gap-0.5">{dots}</div>
              </div>
              <div
                className={`ml-auto flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isDone ? 'border-[#58cc02] bg-[#58cc02]' : 'border-[#e5e5e5]'
                }`}
              >
                {isDone && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
