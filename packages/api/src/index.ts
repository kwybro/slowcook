import { GeminiProvider } from '@slowcook/ai'
import { createDb } from '@slowcook/data-ops'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from './auth'
import type { AppBindings } from './context'
import { books } from './routes/books'
import { scans } from './routes/scans'

const app = new Hono<AppBindings>()

app.use('*', cors())

// Inject dependencies per-request
app.use('*', async (c, next) => {
  const env = c.env
  const db = createDb({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN })
  const ai = new GeminiProvider({ apiKey: env.GEMINI_API_KEY })
  const auth = createAuth(db, env)

  c.set('db', db)
  c.set('ai', ai)
  c.set('auth', auth)

  await next()
})

// Health check
app.get('/health', (c) => c.json({ ok: true }))

// Auth routes (better-auth handles /api/auth/*)
app.all('/api/auth/*', (c) => {
  const auth = c.get('auth')
  return auth.handler(c.req.raw)
})

// API routes
app.route('/api/scans', scans)
app.route('/api/books', books)

export default app
