import { useEffect, useState } from 'react'
import { DAYS, HABITS, WEEK_DATA } from '../constants'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
import { calcGrade, getWeek } from '../lib/calc'

export function Review() {
  const { state, saveReview } = useStreak()
  const toast = useToast()
  const wk = getWeek()
  const yr = new Date().getFullYear()
  const done = state.checkedHabits.length
  const pct = Math.round((done / HABITS.length) * 100)
  const g = calcGrade(pct)

  const [wentWell, setWentWell] = useState('')
  const [improve, setImprove] = useState('')
  const [next, setNext] = useState('')

  useEffect(() => {
    const saved = state.reviews.find((r) => r.week === wk && r.year === yr)
    if (saved) {
      setWentWell(saved.wentWell || '')
      setImprove(saved.improve || '')
      setNext(saved.next || '')
    }
  }, [state.reviews, wk, yr])

  function onSave() {
    saveReview({
      week: wk,
      year: yr,
      grade: g.g,
      pct,
      wentWell: wentWell.trim(),
      improve: improve.trim(),
      next: next.trim(),
    })
    toast.show('✅ Review saved!')
  }

  return (
    <div className="pb-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-[#1f1f1f]">Review 📝</h1>
        <div className="text-xs font-extrabold text-[#afafaf]">
          Week {wk}, {yr}
        </div>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#6c63ff] to-[#9b8fff] px-5 py-6 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-[140px] w-[140px] rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -left-5 h-[100px] w-[100px] rounded-full bg-white/[0.08]" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-1 text-xs font-extrabold uppercase tracking-[0.06em] opacity-80">
              This week&apos;s grade
            </div>
            <div className="font-display text-[72px] font-black leading-none">{g.g}</div>
            <div className="mt-1.5 text-xs font-semibold opacity-80">{g.t}</div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-[44px] leading-none">{g.e}</div>
            <div className="font-display text-lg font-black">{pct}%</div>
            <div className="text-[11px] font-semibold opacity-70">completion</div>
          </div>
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Week summary
      </div>
      <div className="mb-3.5 grid grid-cols-3 gap-2">
        <div className="rounded-[14px] bg-[#f7f7f7] px-3 py-3 text-center">
          <div className="font-display text-xl font-black text-[#1f1f1f]">
            {done}/{HABITS.length}
          </div>
          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.03em] text-[#afafaf]">Habits</div>
        </div>
        <div className="rounded-[14px] bg-[#f7f7f7] px-3 py-3 text-center">
          <div className="font-display text-xl font-black text-[#1f1f1f]">
            {state.focusMinutes >= 60
              ? `${Math.floor(state.focusMinutes / 60)}h ${state.focusMinutes % 60}m`
              : `${state.focusMinutes}m`}
          </div>
          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.03em] text-[#afafaf]">Focus</div>
        </div>
        <div className="rounded-[14px] bg-[#f7f7f7] px-3 py-3 text-center">
          <div className="font-display text-xl font-black text-[#1f1f1f]">{state.xpEarned}</div>
          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.03em] text-[#afafaf]">XP Earned</div>
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Habit breakdown
      </div>
      <div className="mb-3.5 rounded-[20px] border-2 border-[#e5e5e5] bg-white p-[18px]">
        {HABITS.map((h) => {
          const days = [...(WEEK_DATA[h.id] ?? [0, 0, 0, 0, 0, 0, 0])]
          if (state.checkedHabits.includes(h.id)) days[3] = 1
          const total = days.reduce((a, b) => a + b, 0)
          return (
            <div
              key={h.id}
              className="flex items-center justify-between border-b-2 border-[#e5e5e5] py-3 last:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-xl"
                  style={{ background: h.bg }}
                >
                  {h.icon}
                </div>
                <div>
                  <div className="font-display text-sm font-extrabold text-[#1f1f1f]">{h.name}</div>
                  <div className="mt-0.5 text-[11px] font-semibold text-[#afafaf]">
                    🔥 {h.streak + (state.checkedHabits.includes(h.id) ? 1 : 0)} day streak
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex justify-end gap-0.5">
                  {days.map((d, i) => (
                    <div
                      key={i}
                      title={DAYS[i]}
                      className={`h-2.5 w-2.5 rounded-[3px] ${
                        d ? 'bg-[#58cc02]' : i < 3 ? 'bg-[#fca5a5]' : 'bg-[#e5e5e5]'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-1 text-[11px] font-extrabold text-[#afafaf]">{total}/7</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Weekly journal
      </div>
      <div className="mb-2.5">
        <div className="mb-1.5 text-xs font-extrabold text-[#58cc02]">✅ What went well?</div>
        <textarea
          className="w-full resize-none rounded-[14px] border-2 border-[#e5e5e5] bg-white px-3.5 py-3 font-body text-sm font-semibold leading-relaxed text-[#3c3c3c] outline-none transition-[border-color] focus:border-[#1cb0f6]"
          rows={3}
          placeholder="e.g. Maintained my coding streak for 5 days..."
          value={wentWell}
          onChange={(e) => setWentWell(e.target.value)}
        />
      </div>
      <div className="mb-2.5">
        <div className="mb-1.5 text-xs font-extrabold text-[#ff6b35]">⚡ What to improve?</div>
        <textarea
          className="w-full resize-none rounded-[14px] border-2 border-[#e5e5e5] bg-white px-3.5 py-3 font-body text-sm font-semibold leading-relaxed text-[#3c3c3c] outline-none transition-[border-color] focus:border-[#1cb0f6]"
          rows={3}
          placeholder="e.g. Sleep schedule was inconsistent..."
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
        />
      </div>
      <div className="mb-3.5">
        <div className="mb-1.5 text-xs font-extrabold text-[#1cb0f6]">🎯 Next week&apos;s focus</div>
        <textarea
          className="w-full resize-none rounded-[14px] border-2 border-[#e5e5e5] bg-white px-3.5 py-3 font-body text-sm font-semibold leading-relaxed text-[#3c3c3c] outline-none transition-[border-color] focus:border-[#1cb0f6]"
          rows={2}
          placeholder="e.g. Hit 7h sleep every day..."
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={onSave}
        className="w-full rounded-[14px] border-none bg-gradient-to-br from-[#6c63ff] to-[#9b8fff] py-3.5 font-display text-base font-black text-white shadow-[0_4px_0_#4a43cc] transition-[transform,box-shadow] active:translate-y-[3px] active:shadow-[0_1px_0_#4a43cc]"
      >
        Save this week&apos;s review 💜
      </button>

      <div className="mb-2.5 mt-[18px] font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Past reviews
      </div>
      {!state.reviews.length ? (
        <div className="py-5 text-center text-[13px] font-bold text-[#afafaf]">
          No past reviews yet. Save your first one above! ☝️
        </div>
      ) : (
        <div className="space-y-2.5">
          {state.reviews.slice(0, 6).map((r) => (
            <div
              key={`${r.week}-${r.year}`}
              className="rounded-2xl border-2 border-[#e2c4ff] bg-[#f4e6ff] px-3.5 py-3.5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#6b3fa0]">
                  Week {r.week}, {r.year} · {r.date}
                </span>
                <span className="font-display text-[22px] font-black text-[#6b3fa0]">
                  {r.grade}{' '}
                  <span className="text-sm">
                    {r.pct}%
                  </span>
                </span>
              </div>
              {r.wentWell ? (
                <div className="text-[13px] font-semibold leading-relaxed text-[#7a52a8]">
                  ✅ <strong>Went well:</strong> {r.wentWell}
                </div>
              ) : null}
              {r.improve ? (
                <div className="mt-1 text-[13px] font-semibold leading-relaxed text-[#7a52a8]">
                  ⚡ <strong>Improve:</strong> {r.improve}
                </div>
              ) : null}
              {r.next ? (
                <div className="mt-1 text-[13px] font-semibold leading-relaxed text-[#7a52a8]">
                  🎯 <strong>Next week:</strong> {r.next}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
