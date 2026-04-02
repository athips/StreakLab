export const HABITS = [
  { id: 'ex', name: 'Exercise', icon: '🏃', streak: 12, xp: 10, bg: '#FFF0EB', dot: '#FF6B35' },
  { id: 'study', name: 'Code study', icon: '💻', streak: 8, xp: 15, bg: '#E8F7FF', dot: '#1CB0F6' },
  { id: 'lang', name: 'Language', icon: '🗣️', streak: 20, xp: 8, bg: '#E9FFD4', dot: '#58CC02' },
  { id: 'sleep', name: 'Sleep 8h', icon: '😴', streak: 5, xp: 5, bg: '#F4E6FF', dot: '#CE82FF' },
  { id: 'meal', name: 'Healthy meal', icon: '🍱', streak: 3, xp: 5, bg: '#FFF0F8', dot: '#FF86C8' },
] as const

export const ROUTINE = [
  { id: 'water', title: 'Drink water', icon: '💧', sub: 'Start hydrated', mins: 1 },
  { id: 'supps', title: 'Supplements', icon: '💊', sub: 'Daily vitamins', mins: 1 },
  { id: 'skin', title: 'Skincare', icon: '✨', sub: '5-min routine', mins: 5 },
  { id: 'groom', title: 'Grooming', icon: '🪒', sub: 'Look your best', mins: 5 },
  { id: 'stretch', title: 'Stretch', icon: '🧘', sub: '3-min mobility', mins: 3 },
  { id: 'plan', title: 'Plan the day', icon: '📋', sub: 'Set your top 3 tasks', mins: 3 },
  { id: 'journal', title: 'Gratitude note', icon: '📓', sub: '1-minute journal', mins: 1 },
] as const

export const BADGES = [
  { id: 'first', emoji: '🌟', name: 'First Day', baseEarned: true },
  { id: 'week1', emoji: '🔥', name: 'Week Streak', baseEarned: false },
  { id: 'coder', emoji: '💻', name: 'Code 10h', baseEarned: false },
  { id: 'month1', emoji: '💎', name: '30 Days', baseEarned: false },
  { id: 'early', emoji: '☀️', name: 'Early Bird', baseEarned: false },
  { id: 'focus', emoji: '⏱️', name: 'Focus 5h', baseEarned: false },
  { id: 'perfect', emoji: '🏆', name: 'Perfect Week', baseEarned: false },
  { id: 'lang', emoji: '🗣️', name: 'Polyglot', baseEarned: false },
] as const

export const WEEK_DATA: Record<string, number[]> = {
  ex: [1, 1, 1, 1, 1, 0, 0],
  study: [1, 0, 1, 1, 0, 0, 0],
  lang: [1, 1, 1, 1, 1, 0, 0],
  sleep: [1, 1, 0, 0, 0, 0, 0],
  meal: [1, 1, 1, 0, 0, 0, 0],
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const STORAGE_KEY = 'streaklab_v1'
