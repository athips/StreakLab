import { EnergyLevelsChart, SleepCodingChart } from '../components/charts/EnergyCharts'

export function Energy() {
  return (
    <div>
      <div className="insight-banner">
        <div className="ib-icon">↑</div>
        <div className="ib-text">
          When you sleep 8h + exercise, coding productivity increases by <strong>+35%</strong>. You&apos;ve had 3 such
          days this week.
        </div>
      </div>

      <div className="corr-grid">
        <div className="corr-card">
          <div className="corr-emoji">🏃</div>
          <div className="corr-name">Exercise</div>
          <div className="corr-pct" style={{ color: '#fb923c' }}>
            +28%
          </div>
          <div className="corr-sub">energy boost</div>
        </div>
        <div className="corr-card">
          <div className="corr-emoji">😴</div>
          <div className="corr-name">Sleep 8h</div>
          <div className="corr-pct" style={{ color: '#4ade80' }}>
            +35%
          </div>
          <div className="corr-sub">focus boost</div>
        </div>
        <div className="corr-card">
          <div className="corr-emoji">🍱</div>
          <div className="corr-name">Healthy meal</div>
          <div className="corr-pct" style={{ color: '#60a5fa' }}>
            +18%
          </div>
          <div className="corr-sub">mood boost</div>
        </div>
        <div className="corr-card">
          <div className="corr-emoji">🗣️</div>
          <div className="corr-name">Language</div>
          <div className="corr-pct" style={{ color: '#c084fc' }}>
            +12%
          </div>
          <div className="corr-sub">mental agility</div>
        </div>
      </div>

      <div className="grid2" style={{ gap: 16 }}>
        <div className="scatter-box" style={{ marginBottom: 0 }}>
          <div className="scatter-lbl">Sleep vs. coding output</div>
          <div style={{ height: 160 }}>
            <SleepCodingChart />
          </div>
        </div>
        <div className="scatter-box" style={{ marginBottom: 0 }}>
          <div className="scatter-lbl">Energy this week</div>
          <div style={{ height: 160 }}>
            <EnergyLevelsChart />
          </div>
        </div>
      </div>

      <div className="glass" style={{ marginTop: 20 }}>
        <div className="card-title" style={{ marginBottom: 14 }}>
          Best habit combinations
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '11px 0',
              borderBottom: '1px solid rgba(255,255,255,.05)',
            }}
          >
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>😴 Sleep + 🏃 Exercise</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: '#4ade80' }}>+35%</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '11px 0',
              borderBottom: '1px solid rgba(255,255,255,.05)',
            }}
          >
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>🍱 Meal + 💻 Code study</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: '#4ade80' }}>+22%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>☀️ Routine + 🗣️ Language</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: '#4ade80' }}>+18%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
