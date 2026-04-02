/**
 * StreakLab API — local JSON store first; swap persistence for PostgreSQL using db/schema.sql.
 */
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import getPort, { portNumbers } from 'get-port'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE_PORT = Number(process.env.PORT) || 3847
const DATA_DIR = path.join(__dirname, 'data')
const STORE_PATH = path.join(DATA_DIR, 'user-demo.json')

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(
      STORE_PATH,
      JSON.stringify(
        {
          version: 1,
          userId: 'demo',
          state: null,
          updatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    )
  }
}

function readStore() {
  ensureStore()
  const raw = fs.readFileSync(STORE_PATH, 'utf8')
  return JSON.parse(raw)
}

function writeStore(doc) {
  ensureStore()
  doc.updatedAt = new Date().toISOString()
  fs.writeFileSync(STORE_PATH, JSON.stringify(doc, null, 2))
}

const app = express()
app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'streaklab', time: new Date().toISOString() })
})

/** Same shape as client localStorage JSON (AppState) */
app.get('/api/user/:userId/state', (req, res) => {
  try {
    const doc = readStore()
    if (doc.userId !== req.params.userId && req.params.userId !== 'demo') {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ state: doc.state, updatedAt: doc.updatedAt })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

app.put('/api/user/:userId/state', (req, res) => {
  try {
    const body = req.body
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Expected JSON body' })
    }
    const doc = readStore()
    doc.userId = req.params.userId === 'demo' ? 'demo' : req.params.userId
    doc.state = body.state ?? body
    writeStore(doc)
    res.json({ ok: true, updatedAt: doc.updatedAt })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

const hi = Math.min(BASE_PORT + 20, 65535)
const port = await getPort({ port: portNumbers(BASE_PORT, hi) })

const server = app.listen(port, () => {
  console.log(`StreakLab API http://localhost:${port}`)
  if (port !== BASE_PORT) {
    console.warn('')
    console.warn(`[!] Port ${BASE_PORT} was already in use; bound to ${port} instead.`)
    console.warn('    Point the Vite dev proxy at this URL by creating client/.env.local with:')
    console.warn('')
    console.warn(`    VITE_API_URL=http://localhost:${port}`)
    console.warn('')
    console.warn('    Or stop the other process using the old port (often a leftover `node` from an earlier dev run).')
    console.warn('')
  }
})

server.on('error', (err) => {
  console.error(err)
  process.exit(1)
})
