import { useEffect, useRef, useState } from 'react'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'

const MODES = { pomodoro: 25 * 60, short: 5 * 60, long: 15 * 60 } as const
const TLABELS: Record<keyof typeof MODES, string> = {
  pomodoro: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
}
const CIRCUM = 502

type Mode = keyof typeof MODES

export function Focus() {
  const { state, addSession, logDistraction } = useStreak()
  const toast = useToast()
  const [mode, setMode] = useState<Mode>('pomodoro')
  const [timerLeft, setTimerLeft] = useState(MODES.pomodoro)
  const [running, setRunning] = useState(false)
  const [pomoDone, setPomoDone] = useState(0)
  const [task, setTask] = useState('Code study')
  const modeRef = useRef(mode)
  const taskRef = useRef(task)
  modeRef.current = mode
  taskRef.current = task

  const timerTotal = MODES[mode]

  useEffect(() => {
    setTimerLeft(MODES[mode])
    setRunning(false)
  }, [mode])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setTimerLeft((left) => {
        const next = left - 1
        if (next <= 0) {
          window.setTimeout(() => {
            setRunning(false)
            const m = modeRef.current
            if (m === 'pomodoro') {
              const label = taskRef.current.trim() || 'Focus session'
              addSession({ task: label, dur: '25m' }, 25, 50)
              setPomoDone((p) => (p + 1) % 4)
              toast.show('🎉 Session done! +50 XP')
            } else {
              toast.show('⏰ Break over!')
            }
            setTimerLeft(MODES[modeRef.current])
          }, 0)
          return 0
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, addSession, toast])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const dashOffset = CIRCUM * (timerLeft / timerTotal)

  return (
    <div className="pb-4">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-[#1f1f1f]">Focus ⏱️</h1>
        <div className="text-[13px] font-extrabold text-[#afafaf]">
          Sessions: <span className="text-[#1cb0f6]">{state.sessionsDone}</span>
        </div>
      </div>

      <div className="mb-4 flex gap-2 rounded-[14px] bg-[#f7f7f7] p-1.5">
        {(['pomodoro', 'short', 'long'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m)
              setRunning(false)
            }}
            className={`flex-1 rounded-[10px] py-2 font-display text-xs font-extrabold transition-all ${
              mode === m ? 'bg-white text-[#1cb0f6] shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'bg-transparent text-[#afafaf]'
            }`}
          >
            {m === 'pomodoro' ? 'Pomodoro' : m === 'short' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      <div className="relative mb-4 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1cb0f6] to-[#6dd5ff] px-5 py-7 text-center text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-[150px] w-[150px] rounded-full bg-white/10" />
        <div className="relative mx-auto mb-4 h-[180px] w-[180px]">
          <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
            <circle className="fill-none stroke-white/25" strokeWidth={10} cx="90" cy="90" r="80" />
            <circle
              className="fill-none stroke-white stroke-[10px] stroke-round transition-[stroke-dashoffset] duration-500"
              cx="90"
              cy="90"
              r="80"
              strokeDasharray={CIRCUM}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="font-display text-[42px] font-black leading-none">{formatTime(timerLeft)}</div>
            <div className="mt-1 text-xs font-extrabold uppercase tracking-[0.08em] opacity-80">
              {TLABELS[mode]}
            </div>
          </div>
        </div>
        <div className="mb-2 flex justify-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-3.5 w-3.5 rounded-full transition-colors ${
                i < pomoDone ? 'bg-[#ff6b35]' : i === pomoDone ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mb-4 flex justify-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            setRunning(false)
            setTimerLeft(MODES[mode])
          }}
          className="rounded-[14px] border-none bg-[#e5e5e5] px-7 py-3 font-display text-[15px] font-extrabold text-[#3c3c3c] shadow-[0_4px_0_#c8c8c8] transition-[transform,box-shadow] active:translate-y-[3px] active:shadow-[0_1px_0_#c8c8c8]"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-[14px] border-none bg-[#1cb0f6] px-7 py-3 font-display text-[15px] font-extrabold text-white shadow-[0_4px_0_#0e8bc9] transition-[transform,box-shadow] active:translate-y-[3px] active:shadow-[0_1px_0_#0e8bc9]"
        >
          {running ? 'Pause' : 'Start'}
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2.5 rounded-[14px] bg-[#f7f7f7] px-4 py-3">
        <span className="text-lg">💻</span>
        <input
          className="min-w-0 flex-1 border-none bg-transparent font-body text-sm font-bold text-[#3c3c3c] outline-none"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What are you working on?"
        />
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Distractions today
      </div>
      <div className="mb-4 rounded-2xl bg-[#f7f7f7] p-3.5">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] py-2.5 text-sm font-bold text-[#3c3c3c]">
          <span>📱 Phone check</span>
          <span className="rounded-full bg-[#e8f7ff] px-2.5 py-0.5 text-[11px] font-extrabold text-[#0e7bb5]">
            {state.distractionsPhone}x
          </span>
        </div>
        <div className="flex items-center justify-between py-2.5 text-sm font-bold text-[#3c3c3c]">
          <span>💬 Social media</span>
          <span className="rounded-full bg-[#e8f7ff] px-2.5 py-0.5 text-[11px] font-extrabold text-[#0e7bb5]">
            {state.distractionsSocial}x
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            logDistraction()
            toast.show('Distraction logged 📌')
          }}
          className="mt-2.5 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#e5e5e5] bg-transparent py-2.5 font-display text-[13px] font-extrabold text-[#afafaf]"
        >
          + Log distraction
        </button>
      </div>

      <div className="mb-2.5 font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#afafaf]">
        Session log
      </div>
      <div className="rounded-2xl bg-[#f7f7f7] p-3.5">
        {!state.sessionLog.length ? (
          <div className="py-4 text-center text-[13px] font-bold text-[#afafaf]">No sessions yet today</div>
        ) : (
          state.sessionLog.slice(0, 5).map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-[#e5e5e5] py-2 text-[13px] last:border-b-0"
            >
              <span className="font-bold text-[#3c3c3c]">💻 {s.task}</span>
              <span className="font-display font-extrabold text-[#1cb0f6]">{s.dur}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
