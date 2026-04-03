import { useState } from 'react'
import { DevNativeModal } from '../components/DevNativeModal'
import { useNow } from '../hooks/useNow'
import { useStreak } from '../context/StreakContext'
import { useToast } from '../hooks/useToast'
import type { BookStatus } from '../types'

type Filter = 'all' | BookStatus

const STATUS_MAP: Record<
  BookStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  reading: { label: 'Reading', color: '#60a5fa', bg: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)' },
  queued: {
    label: 'Up next',
    color: 'rgba(255,255,255,.3)',
    bg: 'rgba(255,255,255,.05)',
    border: 'rgba(255,255,255,.1)',
  },
  done: { label: 'Done', color: '#4ade80', bg: 'rgba(74,222,128,.1)', border: 'rgba(74,222,128,.3)' },
  paused: { label: 'Paused', color: '#fbbf24', bg: 'rgba(251,191,36,.1)', border: 'rgba(251,191,36,.3)' },
}

export function ReadingList() {
  const {
    state,
    logBookPages,
    startReadingBook,
    finishBook,
    deleteBook,
  } = useStreak()
  const toast = useToast()
  const now = useNow()
  const [filter, setFilter] = useState<Filter>('all')
  const [modal, setModal] = useState<'add' | { edit: string } | null>(null)
  const [logId, setLogId] = useState<string | null>(null)
  const [logInput, setLogInput] = useState('')

  const filtered = state.books.filter((b) => {
    if (filter === 'all') return true
    return b.status === filter
  })

  function openLog(id: string) {
    setLogId(id)
    setLogInput('')
  }

  function submitLog() {
    if (!logId) return
    const n = parseInt(logInput, 10)
    if (Number.isNaN(n) || n <= 0) return
    logBookPages(logId, n)
    toast(`+5 XP · ${n} pages logged 📖`)
    setLogId(null)
  }

  function onDelete(id: string) {
    if (!confirm('Remove this book?')) return
    deleteBook(id)
    toast('Book removed')
  }

  function onFinish(id: string) {
    finishBook(id)
    toast('+50 XP · Book finished! 🎉')
  }

  function onStart(id: string) {
    startReadingBook(id)
    const b = state.books.find((x) => x.id === id)
    if (b) toast(`Started reading "${b.title}" 📖`)
  }

  const editingBook =
    modal && typeof modal === 'object' ? state.books.find((b) => b.id === modal.edit) : null

  return (
    <>
      <div className="read-stat-strip">
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">{state.books.length}</div>
          <div className="hstat-lbl">in library</div>
        </div>
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">{state.books.filter((b) => b.status === 'reading').length}</div>
          <div className="hstat-lbl">currently reading</div>
        </div>
        <div className="glass-sm" style={{ padding: 16 }}>
          <div className="hstat-val">{state.books.filter((b) => b.status === 'done').length}</div>
          <div className="hstat-lbl">finished</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>Reading list</div>
        <button
          type="button"
          className="log-session-btn"
          style={{ borderColor: 'rgba(96,165,250,.35)', background: 'rgba(96,165,250,.1)' }}
          onClick={() => setModal('add')}
        >
          + Add book
        </button>
      </div>

      <div className="tab-filter">
        {(['all', 'reading', 'queued', 'done'] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`tf-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="books-list-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!filtered.length ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,.2)', fontSize: 14 }}>
            {state.books.length ? 'No books in this category.' : 'No books yet — add your first one!'}
          </div>
        ) : (
          filtered.map((b) => {
            const s = STATUS_MAP[b.status] ?? STATUS_MAP.queued
            const pct = b.pages ? Math.round((b.pagesRead / b.pages) * 100) : 0
            const staleDays = b.lastRead
              ? Math.floor((now - new Date(b.lastRead).getTime()) / (1000 * 60 * 60 * 24))
              : 999
            const stale = b.status === 'reading' && staleDays > 3

            return (
              <div key={b.id} className="book-card">
                <div className="book-spine" style={{ background: `${b.color}18` }}>
                  <span style={{ fontSize: 24 }}>{b.icon}</span>
                  <div className="book-pages" />
                </div>
                <div className="book-body">
                  <div className="book-title">{b.title}</div>
                  <div className="book-author">{b.author || 'Unknown author'}</div>
                  {b.status === 'reading' ? (
                    <div className="book-progress-track">
                      <div className="book-progress-fill" style={{ width: `${pct}%`, background: b.color }} />
                    </div>
                  ) : null}
                  <div className="book-meta">
                    {b.status === 'reading' ? (
                      <span className="book-pct">
                        {pct}% · {b.pagesRead || 0}/{b.pages || '?'} pages
                      </span>
                    ) : null}
                    <span
                      className="book-tag"
                      style={{ color: s.color, background: s.bg, borderColor: s.border }}
                    >
                      {s.label}
                    </span>
                    {stale ? (
                      <span className="stale-pill" style={{ fontSize: 10, color: '#fbbf24' }}>
                        <span className="stale-dot" /> {staleDays}d ago
                      </span>
                    ) : null}
                    {b.notes ? (
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.2)' }}>📝 note</span>
                    ) : null}
                  </div>
                </div>
                <div className="book-actions">
                  {b.status === 'reading' ? (
                    <button type="button" className="log-session-btn" onClick={() => openLog(b.id)}>
                      + Log pages
                    </button>
                  ) : null}
                  {b.status === 'queued' ? (
                    <button type="button" className="log-session-btn" onClick={() => onStart(b.id)}>
                      Start reading
                    </button>
                  ) : null}
                  {b.status === 'reading' ? (
                    <button
                      type="button"
                      className="log-session-btn"
                      style={{
                        borderColor: 'rgba(74,222,128,.3)',
                        background: 'rgba(74,222,128,.08)',
                        color: '#4ade80',
                      }}
                      onClick={() => onFinish(b.id)}
                    >
                      Mark done
                    </button>
                  ) : null}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      className="icon-btn"
                      title="Edit"
                      onClick={() => setModal({ edit: b.id })}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      title="Remove"
                      style={{ color: '#f87171' }}
                      onClick={() => onDelete(b.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {modal === 'add' ? (
        <DevNativeModal variant="book" editingId={null} onClose={() => setModal(null)} initialBook={{}} />
      ) : null}
      {editingBook ? (
        <DevNativeModal
          variant="book"
          editingId={editingBook.id}
          onClose={() => setModal(null)}
          initialBook={editingBook}
        />
      ) : null}

      {logId ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-box dev-modal-box">
            <div className="modal-title">Log pages</div>
            <div className="modal-sub">How many pages did you read?</div>
            <input
              className="glass-input"
              type="number"
              min={1}
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              placeholder="e.g. 12"
              autoFocus
            />
            <div className="modal-btns" style={{ marginTop: 20 }}>
              <button type="button" className="modal-cancel" onClick={() => setLogId(null)}>
                Cancel
              </button>
              <button type="button" className="modal-save" onClick={submitLog}>
                Log →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
