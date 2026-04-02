import { useMemo } from 'react'
import { HABITS } from '../constants'
import { useStreak } from '../context/StreakContext'
import { calcLevel } from '../lib/calc'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const codingHours = [
  { h: 3.5, pct: 70 },
  { h: 2, pct: 40 },
  { h: 4, pct: 80 },
  { h: 2.5, pct: 50 },
  { h: null, pct: 4 },
  { h: null, pct: 4 },
  { h: null, pct: 4 },
]

export function Dashboard() {
  const { state } = useStreak()
  const lv = calcLevel(state.totalXP)
  const done = state.checkedHabits.length
  const rate = Math.round((done / HABITS.length) * 100)
  const todayDow = new Date().getDay()
  const monFirstIndex = (todayDow + 6) % 7

  const weekCells = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const isToday = i === monFirstIndex
      const isPast = i < monFirstIndex
      return { isToday, isPast, label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] }
    })
  }, [monFirstIndex])

  const handle = state.profile.handle || 'devhero'
  const players = [
    { name: 'sarah_codes', xp: 520, me: false },
    { name: `you (${handle})`, xp: state.totalXP, me: true },
    { name: 'habitwolf', xp: 290, me: false },
    { name: 'morningpro', xp: 210, me: false },
    { name: 'keystroke99', xp: 180, me: false },
  ].sort((a, b) => b.xp - a.xp)

  const medals = ['🥇', '🥈', '🥉']
  const toNext = Math.max(0, 20 - state.streak)
  const pct = Math.min(100, (state.streak / 20) * 100)

  return (
    <div className="pb-4">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="mb-0.5 text-xs font-extrabold uppercase tracking-[0.06em] text-[#afafaf]">
            {DAY_NAMES[todayDow]}
          </div>
          <h1 className="font-display text-2xl font-black text-[#1f1f1f]">Dashboard 🏠</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-[#ffd900] px-3.5 py-1.5 font-display text-xs font-black text-[#7a5a00]">
          ⚡ {state.totalXP} XP
        </div>
      </div>

      <div className="relative mb-4 flex items-center justify-between overflow-hidden rounded-[20px] bg-gradient-to-br from-[#ff6b35] to-[#ff9a5c] px-5 py-5 text-white">
        <div className="pointer-events-none absolute -right-8 -top-8 h-[120px] w-[120px] rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-10 -left-5 h-[100px] w-[100px] rounded-full bg-white/[0.08]" />
        <div>
          <div className="mb-1.5 text-[28px] leading-none">🔥</div>
          <div className="text-[13px] font-extrabold uppercase tracking-[0.06em] opacity-80">Day streak</div>
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

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Today&apos;s summary
      </div>
      <div className="mb-3.5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-[#f7f7f7] px-3.5 py-3.5 text-center">
          <div className="font-display text-[26px] font-black text-[#1f1f1f]">{done}</div>
          <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">
            Habits Done
          </div>
        </div>
        <div className="rounded-2xl bg-[#f7f7f7] px-3.5 py-3.5 text-center">
          <div className="font-display text-[26px] font-black text-[#1f1f1f]">
            {rate}
            <span className="text-sm">%</span>
          </div>
          <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">
            Today Rate
          </div>
        </div>
        <div className="rounded-2xl bg-[#f7f7f7] px-3.5 py-3.5 text-center">
          <div className="font-display text-[26px] font-black text-[#1f1f1f]">Lv.{lv}</div>
          <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">
            Your Level
          </div>
        </div>
        <div className="rounded-2xl bg-[#f7f7f7] px-3.5 py-3.5 text-center">
          <div className="font-display text-[26px] font-black text-[#1f1f1f]">
            {state.focusMinutes ? `${state.focusMinutes}m` : '0m'}
          </div>
          <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-[#afafaf]">
            Focus Time
          </div>
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        This week
      </div>
      <div className="mb-3.5 rounded-2xl bg-[#f7f7f7] p-3.5">
        <div className="flex gap-1.5">
          {weekCells.map((c) => (
            <div key={c.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="font-display text-[10px] font-extrabold text-[#afafaf]">{c.label}</div>
              <div
                className={`flex aspect-square w-full max-w-[40px] items-center justify-center rounded-[10px] transition-colors ${
                  c.isToday
                    ? 'bg-[#ff6b35]'
                    : c.isPast
                      ? 'bg-[#58cc02]'
                      : 'bg-[#e5e5e5]'
                }`}
              >
                <span className="text-[9px] font-extrabold text-white">
                  {c.isToday ? '★' : c.isPast ? '✓' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Coding hours this week
      </div>
      <div className="mb-3.5 rounded-2xl bg-[#f7f7f7] p-4">
        <div className="flex h-[100px] items-end gap-1.5">
          {codingHours.map((row, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="text-[9px] font-extrabold text-[#3c3c3c]">
                {row.h != null ? `${row.h}h` : '—'}
              </div>
              <div
                className={`w-full min-h-1 rounded-t-lg transition-[height] duration-500 ${
                  i === monFirstIndex && row.h != null
                    ? 'bg-[#ff6b35]'
                    : row.h != null
                      ? 'bg-[#1cb0f6]'
                      : 'bg-[#e5e5e5]'
                }`}
                style={{ height: `${row.pct}%` }}
              />
              <div className="text-[9px] font-bold text-[#afafaf]">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Gold league 🏅
      </div>
      <div className="rounded-[20px] border-2 border-[#e5e5e5] bg-white p-[18px]">
        {players.map((p, i) => (
          <div
            key={p.name}
            className={`flex items-center gap-2.5 border-b-2 border-[#e5e5e5] py-2.5 last:border-b-0 ${p.me ? '' : ''}`}
          >
            <div className="w-6 font-display text-sm font-black text-[#afafaf]">
              {medals[i] || `${i + 1}.`}
            </div>
            <div className={`flex-1 text-sm font-bold ${p.me ? 'font-extrabold text-[#ff6b35]' : 'text-[#3c3c3c]'}`}>
              {p.name}
            </div>
            <div className={`font-display text-[13px] font-extrabold ${p.me ? 'text-[#ff6b35]' : 'text-[#afafaf]'}`}>
              {p.xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
