export function calcLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 200) + 1)
}

export function getWeek(): number {
  const n = new Date()
  const s = new Date(n.getFullYear(), 0, 1)
  return Math.ceil(((+n - +s) / 86400000 + s.getDay() + 1) / 7)
}

export function calcGrade(pct: number): { g: string; e: string; t: string } {
  if (pct >= 95) return { g: 'S', e: '🌟', t: 'Legendary week!' }
  if (pct >= 85) return { g: 'A', e: '🏆', t: 'Outstanding!' }
  if (pct >= 70) return { g: 'B+', e: '💪', t: 'Solid week! Keep the momentum.' }
  if (pct >= 55) return { g: 'B', e: '😊', t: 'Good progress!' }
  if (pct >= 40) return { g: 'C', e: '📈', t: 'Room to grow!' }
  return { g: 'D', e: '💡', t: "Let's bounce back next week." }
}
