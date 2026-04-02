import { ROUTINE } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'

export function Morning() {
  const { state, toggleRoutine } = useStreak()
  const toast = useToast()
  const rdone = state.checkedRoutine.length
  const rpct = Math.round((rdone / ROUTINE.length) * 100)
  const timeSaved = state.checkedRoutine.reduce((acc, id) => {
    const r = ROUTINE.find((x) => x.id === id)
    return acc + (r?.mins ?? 0)
  }, 0)
  const name = state.profile.name?.split(' ')[0] || 'there'

  return (
    <div className="pb-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-[#1f1f1f]">Morning ☀️</h1>
        <div className="text-[13px] font-extrabold text-[#afafaf]">{rpct}% done</div>
      </div>

      <div className="relative mb-4 flex items-center gap-4 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#ffd900] to-[#ffaa00] px-5 py-5 text-white">
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-[120px] w-[120px] rounded-full bg-white/10" />
        <div className="relative text-[48px] leading-none">☀️</div>
        <div className="relative min-w-0">
          <div className="font-display text-lg font-black">Good morning, {name}! 👋</div>
          <div className="text-[13px] font-bold opacity-85">Let&apos;s crush your routine today</div>
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">Progress</div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#e5e5e5]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#58cc02] to-[#7ceb3a] transition-[width] duration-400"
          style={{ width: `${rpct}%` }}
        />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-[14px] bg-[#f7f7f7] px-3 py-3 text-center">
          <div className="font-display text-xl font-black text-[#1f1f1f]">{rdone}</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">Done</div>
        </div>
        <div className="rounded-[14px] bg-[#f7f7f7] px-3 py-3 text-center">
          <div className="font-display text-xl font-black text-[#1f1f1f]">{state.streak}</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">Day streak</div>
        </div>
        <div className="rounded-[14px] bg-[#f7f7f7] px-3 py-3 text-center">
          <div className="font-display text-xl font-black text-[#1f1f1f]">{timeSaved}m</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">Time saved</div>
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Your routine
      </div>
      <div className="space-y-2.5">
        {ROUTINE.map((r) => {
          const done = state.checkedRoutine.includes(r.id)
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                if (done) toggleRoutine(r.id)
                else {
                  toggleRoutine(r.id)
                  toast.show(`✅ ${r.title} done!`)
                }
              }}
              className={`flex w-full cursor-pointer select-none items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left transition-all active:scale-[0.98] ${
                done ? 'border-[#b4f078] bg-[#e9ffd4]' : 'border-[#e5e5e5] bg-white'
              }`}
            >
              <div className="w-10 shrink-0 text-center text-2xl">{r.icon}</div>
              <div className="min-w-0 flex-1">
                <div
                  className={`font-display text-[15px] font-extrabold text-[#1f1f1f] ${done ? 'text-[#afafaf] line-through' : ''}`}
                >
                  {r.title}
                </div>
                <div className="mt-0.5 text-xs font-semibold text-[#afafaf]">
                  {r.sub} ·{' '}
                  <span className="font-extrabold text-[#1cb0f6]">{r.mins} min</span>
                </div>
              </div>
              <div
                className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  done ? 'border-[#58cc02] bg-[#58cc02]' : 'border-[#e5e5e5]'
                }`}
              >
                {done && (
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
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
