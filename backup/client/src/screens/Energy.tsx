import { EnergyLevelsChart, SleepCodingChart } from '../components/charts/EnergyCharts'

export function Energy() {
  return (
    <div className="pb-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-[#1f1f1f]">Energy 📊</h1>
        <div className="text-xs font-extrabold text-[#afafaf]">This week</div>
      </div>

      <div className="relative mb-3.5 overflow-hidden rounded-[20px] border-2 border-[#e2c4ff] bg-gradient-to-br from-[#f4e6ff] to-[#e8daff] p-4">
        <div className="mb-2 text-[28px]">💡</div>
        <div className="mb-1 font-display text-sm font-black text-[#6b3fa0]">Your top insight</div>
        <div className="text-[13px] font-semibold leading-relaxed text-[#7a52a8]">
          When you sleep 8h + exercise, coding productivity increases{' '}
          <span className="font-black text-[#ff6b35]">+35%</span>. You&apos;ve had 3 such days this week!
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Habit × Energy correlation
      </div>
      <div className="mb-3.5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border-2 border-[#ffd5c2] bg-[#fff0eb] px-3 py-3.5 text-center">
          <div className="mb-1.5 text-[28px]">🏃</div>
          <div className="font-display text-xs font-extrabold text-[#1f1f1f]">Exercise</div>
          <div className="font-display text-xl font-black text-[#ff6b35]">+28%</div>
          <div className="mt-0.5 text-[10px] font-bold text-[#afafaf]">Energy boost</div>
        </div>
        <div className="rounded-2xl border-2 border-[#b4f078] bg-[#e9ffd4] px-3 py-3.5 text-center">
          <div className="mb-1.5 text-[28px]">😴</div>
          <div className="font-display text-xs font-extrabold text-[#1f1f1f]">Sleep 8h</div>
          <div className="font-display text-xl font-black text-[#58cc02]">+35%</div>
          <div className="mt-0.5 text-[10px] font-bold text-[#afafaf]">Focus boost</div>
        </div>
        <div className="rounded-2xl border-2 border-[#9ee0fb] bg-[#e8f7ff] px-3 py-3.5 text-center">
          <div className="mb-1.5 text-[28px]">🍱</div>
          <div className="font-display text-xs font-extrabold text-[#1f1f1f]">Healthy meal</div>
          <div className="font-display text-xl font-black text-[#1cb0f6]">+18%</div>
          <div className="mt-0.5 text-[10px] font-bold text-[#afafaf]">Mood boost</div>
        </div>
        <div className="rounded-2xl border-2 border-[#e2c4ff] bg-[#f4e6ff] px-3 py-3.5 text-center">
          <div className="mb-1.5 text-[28px]">🗣️</div>
          <div className="font-display text-xs font-extrabold text-[#1f1f1f]">Language</div>
          <div className="font-display text-xl font-black text-[#ce82ff]">+12%</div>
          <div className="mt-0.5 text-[10px] font-bold text-[#afafaf]">Mental agility</div>
        </div>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Sleep vs. coding output
      </div>
      <div className="relative mb-3.5 h-[140px] rounded-2xl bg-[#f7f7f7] p-4">
        <SleepCodingChart />
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Energy levels this week
      </div>
      <div className="relative mb-3.5 h-[120px] rounded-2xl bg-[#f7f7f7] p-4">
        <EnergyLevelsChart />
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Best habit combos
      </div>
      <div className="rounded-[20px] border-2 border-[#e5e5e5] bg-white p-[18px]">
        <div className="flex items-center justify-between border-b-2 border-[#e5e5e5] py-3 text-sm font-bold">
          <span>😴 + 🏃 Sleep & Exercise</span>
          <span className="rounded-full bg-[#e9ffd4] px-2 py-0.5 text-[11px] font-extrabold text-[#2a7a00]">
            +35% 🔥
          </span>
        </div>
        <div className="flex items-center justify-between border-b-2 border-[#e5e5e5] py-3 text-sm font-bold">
          <span>🍱 + 💻 Meal & Study</span>
          <span className="rounded-full bg-[#e8f7ff] px-2 py-0.5 text-[11px] font-extrabold text-[#0a5f8a]">
            +22% ⚡
          </span>
        </div>
        <div className="flex items-center justify-between py-3 text-sm font-bold">
          <span>☀️ + 🗣️ Routine & Lang</span>
          <span className="rounded-full bg-[#fffbd0] px-2 py-0.5 text-[11px] font-extrabold text-[#7a5a00]">
            +18% 🌟
          </span>
        </div>
      </div>
    </div>
  )
}
