import { createMiddleware } from 'hono/factory'
import type { AppBindings } from '../context'

export const requireSession = createMiddleware<AppBindings>(async (c, next) => {
  const auth = c.get('auth')
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session?.user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('userId', session.user.id)
  await next()
})
