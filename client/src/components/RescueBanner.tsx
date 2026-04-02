import { RESCUE_CHALLENGES } from '../streakos4Data'

type RescueVariant = 'dash' | 'habits'

export function RescueBanner({
  variant,
  show,
  doneIds,
  onComplete,
  onDismiss,
}: {
  variant: RescueVariant
  show: boolean
  doneIds: string[]
  onComplete: (id: string) => void
  onDismiss?: () => void
}) {
  const isDash = variant === 'dash'

  return (
    <div className={`rescue-banner${show ? '' : ' hidden'}`} style={{ marginBottom: 20 }}>
      <div className="rb-head">
        <div className="rb-icon">⚡</div>
        <div>
          <div className="rb-title">{isDash ? 'Streak in danger!' : 'Streak rescue available'}</div>
          <div className="rb-sub">
            {isDash ? 'Complete a rescue challenge to save your streak' : 'You missed yesterday — complete a challenge to save your streak'}
          </div>
        </div>
      </div>
      <div className="rb-body">
        {isDash
          ? 'Your streak is at risk. Complete any challenge below before midnight to keep it alive.'
          : 'Pick any challenge below. Completing it will restore your streak and award bonus XP.'}
      </div>

      <div className="rescue-challenges">
        {RESCUE_CHALLENGES.map((c) => {
          const done = doneIds.includes(c.id)
          return (
            <div
              key={c.id}
              className={`rc-item${done ? ' done-c' : ''}`}
              onClick={() => {
                if (done) return
                onComplete(c.id)
              }}
              role="button"
              tabIndex={done ? -1 : 0}
            >
              <div className={`rc-check${done ? ' on' : ''}`}>
                <svg viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path
                    d="M1.5 5L4 7.5L8.5 2.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="rc-text">{c.text}</div>
              <div className="rc-xp">{`+${c.bonusXP} XP`}</div>
            </div>
          )
        })}
      </div>

      {!isDash && (
        <button type="button" className="rescue-close-btn" onClick={() => onDismiss?.()}>
          Dismiss rescue
        </button>
      )}
    </div>
  )
}

