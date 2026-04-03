import { useState } from 'react'
import { BOOK_ICONS, BOOK_COLORS, SKILL_CATEGORIES, randomBookColor } from '../devNativeData'
import { useStreak } from '../context/StreakContext'
import type { ReadingBook, SideProject, SkillRoadmapItem, SkillMilestone } from '../types'

type Variant = 'book' | 'project' | 'skill'

type Props = {
  variant: Variant
  editingId: string | null
  onClose: () => void
  initialBook?: Partial<ReadingBook> | null
  initialProject?: Partial<SideProject> | null
  initialSkill?: Partial<SkillRoadmapItem> | null
}

const PROJ_ICONS = ['🚀', '💡', '🔧', '🎮', '📱', '🤖', '🎨', '🔬', '🌐', '⚡'] as const
const SKILL_ICONS = ['⚡', '🦀', '🐍', '🟨', '🔷', '🌐', '🛠️', '🤖', '🎯', '📦', '🔐', '🌿'] as const

export function DevNativeModal(props: Props) {
  const { variant, editingId, onClose } = props
  const {
    saveBook,
    saveProject,
    saveSkill,
    state,
  } = useStreak()

  if (variant === 'book') {
    const data = props.initialBook ?? {}
    return (
      <BookForm
        key={editingId ?? 'new'}
        data={data}
        editingId={editingId}
        onClose={onClose}
        onSave={(b) => {
          saveBook(b, editingId)
          onClose()
        }}
      />
    )
  }

  if (variant === 'project') {
    const data = props.initialProject ?? {}
    return (
      <ProjectForm
        key={editingId ?? 'new'}
        data={data}
        editingId={editingId}
        onClose={onClose}
        onSave={(p) => {
          saveProject(p, editingId)
          onClose()
        }}
      />
    )
  }

  const data = props.initialSkill ?? {}
  const existing = editingId ? state.skills.find((s) => s.id === editingId) : undefined
  return (
    <SkillForm
      key={editingId ?? 'new'}
      data={data}
      existing={existing}
      editingId={editingId}
      onClose={onClose}
      onSave={(s) => {
        saveSkill(s, editingId)
        onClose()
      }}
    />
  )
}

function BookForm({
  data,
  editingId,
  onClose,
  onSave,
}: {
  data: Partial<ReadingBook>
  editingId: string | null
  onClose: () => void
  onSave: (b: ReadingBook) => void
}) {
  const [title, setTitle] = useState(data.title ?? '')
  const [author, setAuthor] = useState(data.author ?? '')
  const [pages, setPages] = useState(data.pages ? String(data.pages) : '')
  const [pagesRead, setPagesRead] = useState(data.pagesRead != null ? String(data.pagesRead) : '0')
  const [status, setStatus] = useState(data.status ?? 'reading')
  const [icon, setIcon] = useState(data.icon ?? '📗')
  const [notes, setNotes] = useState(data.notes ?? '')

  function submit() {
    const t = title.trim()
    if (!t) return
    const pg = parseInt(pages, 10) || 0
    const pr = parseInt(pagesRead, 10) || 0
    const book: ReadingBook = {
      id: editingId ?? `book_${Date.now()}`,
      title: t,
      author: author.trim() || 'Unknown author',
      pages: pg,
      pagesRead: Math.min(pr, pg || pr),
      status: status as ReadingBook['status'],
      icon,
      color: data.color ?? randomBookColor(),
      notes: notes.trim() || undefined,
      lastRead: data.lastRead ?? null,
      startedAt: data.startedAt,
      finishedAt: data.finishedAt,
    }
    onSave(book)
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box dev-modal-box">
        <div className="modal-title">{editingId ? 'Edit book' : 'Add book'}</div>
        <div className="modal-sub">Track what you&apos;re reading</div>
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Title
        </div>
        <input
          className="glass-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. The Pragmatic Programmer"
          style={{ marginBottom: 10 }}
        />
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Author
        </div>
        <input
          className="glass-input"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Andy Hunt"
          style={{ marginBottom: 10 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <div className="field-lbl" style={{ marginTop: 0 }}>
              Total pages
            </div>
            <input
              className="glass-input"
              type="number"
              min={0}
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="300"
            />
          </div>
          <div>
            <div className="field-lbl" style={{ marginTop: 0 }}>
              Pages read
            </div>
            <input
              className="glass-input"
              type="number"
              min={0}
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Status
        </div>
        <select className="glass-select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginBottom: 10 }}>
          <option value="queued">Up next (queue)</option>
          <option value="reading">Currently reading</option>
          <option value="paused">Paused</option>
          <option value="done">Done</option>
        </select>
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Icon
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          {BOOK_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              className={`emoji-opt${icon === ic ? ' sel' : ''}`}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Notes
        </div>
        <input
          className="glass-input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Key takeaways or why you're reading this..."
        />
        <div className="modal-btns" style={{ marginTop: 20 }}>
          <button type="button" className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="modal-save" onClick={submit}>
            Save →
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectForm({
  data,
  editingId,
  onClose,
  onSave,
}: {
  data: Partial<SideProject>
  editingId: string | null
  onClose: () => void
  onSave: (p: SideProject) => void
}) {
  const [name, setName] = useState(data.name ?? '')
  const [desc, setDesc] = useState(data.desc ?? '')
  const [status, setStatus] = useState(data.status ?? 'building')
  const [goalHours, setGoalHours] = useState(data.goalHours != null ? String(data.goalHours) : '')
  const [tech, setTech] = useState((data.tech ?? []).join(', '))
  const [repo, setRepo] = useState(data.repo ?? '')
  const [icon, setIcon] = useState(data.icon ?? '🚀')
  const [color, setColor] = useState(data.color ?? '#60a5fa')

  function submit() {
    const t = name.trim()
    if (!t) return
    const gh = parseFloat(goalHours) || 0
    const p: SideProject = {
      id: editingId ?? `proj_${Date.now()}`,
      name: t,
      desc: desc.trim() || 'No description',
      status: status as SideProject['status'],
      goalHours: gh,
      tech: tech
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
      repo: repo.trim() || undefined,
      icon,
      color,
      hours: data.hours ?? 0,
      progress: data.progress ?? 0,
      sessions: data.sessions ?? 0,
      lastWorked: data.lastWorked ?? null,
    }
    onSave(p)
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box dev-modal-box">
        <div className="modal-title">{editingId ? 'Edit project' : 'New project'}</div>
        <div className="modal-sub">Track your side projects</div>
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Project name
        </div>
        <input
          className="glass-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. StreakOS"
          style={{ marginBottom: 10 }}
        />
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Description
        </div>
        <input
          className="glass-input"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="What is this project?"
          style={{ marginBottom: 10 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <div className="field-lbl" style={{ marginTop: 0 }}>
              Status
            </div>
            <select className="glass-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ideation">Ideation</option>
              <option value="building">Building</option>
              <option value="paused">Paused</option>
              <option value="shipped">Shipped</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <div className="field-lbl" style={{ marginTop: 0 }}>
              Weekly goal (hrs)
            </div>
            <input
              className="glass-input"
              type="number"
              min={0}
              step={0.5}
              value={goalHours}
              onChange={(e) => setGoalHours(e.target.value)}
              placeholder="5"
            />
          </div>
        </div>
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Tech stack (comma separated)
        </div>
        <input
          className="glass-input"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          placeholder="React, Node.js, PostgreSQL"
          style={{ marginBottom: 10 }}
        />
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Repo URL (optional)
        </div>
        <input
          className="glass-input"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="https://github.com/..."
          style={{ marginBottom: 10 }}
        />
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Icon & color
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          {PROJ_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              className={`emoji-opt${icon === ic ? ' sel' : ''}`}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 0 }}>
          {BOOK_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`color-opt${color === c ? ' sel' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="modal-btns" style={{ marginTop: 20 }}>
          <button type="button" className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="modal-save" onClick={submit}>
            Save →
          </button>
        </div>
      </div>
    </div>
  )
}

function SkillForm({
  data,
  existing,
  editingId,
  onClose,
  onSave,
}: {
  data: Partial<SkillRoadmapItem>
  existing?: SkillRoadmapItem
  editingId: string | null
  onClose: () => void
  onSave: (s: SkillRoadmapItem) => void
}) {
  const [name, setName] = useState(data.name ?? '')
  const [category, setCategory] = useState(data.category ?? 'Frontend')
  const [goal, setGoal] = useState(data.goal ?? '')
  const [icon, setIcon] = useState(data.icon ?? '⚡')
  const [milestonesRaw, setMilestonesRaw] = useState(
    (data.milestones ?? existing?.milestones ?? [])
      .map((m) => `${m.text} | ${m.xp}`)
      .join('\n'),
  )

  function submit() {
    const t = name.trim()
    if (!t) return
    const lines = milestonesRaw.split('\n').map((l) => l.trim()).filter(Boolean)
    const prevMs = existing?.milestones ?? data.milestones ?? []
    const milestones: SkillMilestone[] = lines.map((line, i) => {
      const parts = line.split('|')
      const text = parts[0]?.trim() || line
      const xp = parseInt(parts[1]?.trim() ?? '', 10) || 10
      const old = prevMs[i]
      return {
        id: old?.id ?? `ms_${Date.now()}_${i}`,
        text,
        xp,
        done: old?.done ?? false,
      }
    })
    const sk: SkillRoadmapItem = {
      id: editingId ?? `skill_${Date.now()}`,
      name: t,
      category,
      level: 'queued',
      goal: goal.trim(),
      icon,
      milestones,
      progress: data.progress ?? 0,
      hours: data.hours ?? 0,
      sessions: data.sessions ?? 0,
      lastStudied: data.lastStudied ?? null,
    }
    onSave(sk)
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box dev-modal-box">
        <div className="modal-title">{editingId ? 'Edit skill' : 'Add skill'}</div>
        <div className="modal-sub">Define your learning roadmap</div>
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Skill name
        </div>
        <input
          className="glass-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. TypeScript"
          style={{ marginBottom: 10 }}
        />
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Category
        </div>
        <select className="glass-select" value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginBottom: 10 }}>
          {SKILL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Goal / target
        </div>
        <input
          className="glass-input"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Build 2 projects with TS"
          style={{ marginBottom: 10 }}
        />
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Milestones (one per line, format: text | XP)
        </div>
        <textarea
          className="glass-input"
          rows={5}
          value={milestonesRaw}
          onChange={(e) => setMilestonesRaw(e.target.value)}
          placeholder={'Complete TS handbook | 20\nBuild first typed project | 30'}
          style={{ marginBottom: 10, resize: 'none' }}
        />
        <div className="field-lbl" style={{ marginTop: 0 }}>
          Icon
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 0, flexWrap: 'wrap' }}>
          {SKILL_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              className={`emoji-opt${icon === ic ? ' sel' : ''}`}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>
        <div className="modal-btns" style={{ marginTop: 20 }}>
          <button type="button" className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="modal-save" onClick={submit}>
            Save →
          </button>
        </div>
      </div>
    </div>
  )
}
