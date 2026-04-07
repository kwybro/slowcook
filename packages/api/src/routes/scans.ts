import { Hono } from 'hono'
import type { AppBindings } from '../context'
import { requireSession } from '../middleware/require-session'

export const scans = new Hono<AppBindings>()

scans.use('/*', requireSession)

scans.post('/cover', async (c) => {
  const body = await c.req.parseBody()
  const file = body.image

  if (!(file instanceof File)) {
    return c.json({ error: 'Missing "image" file field' }, 400)
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const ai = c.get('ai')
  const result = await ai.extractBookMeta({ bytes, mimeType: file.type })

  return c.json(result)
})

scans.post('/index', async (c) => {
  const body = await c.req.parseBody({ all: true })
  const files = body.images

  if (!files) {
    return c.json({ error: 'Missing "images" file field(s)' }, 400)
  }

  const fileArray = Array.isArray(files) ? files : [files]
  const images = []

  for (const file of fileArray) {
    if (!(file instanceof File)) {
      return c.json({ error: 'All "images" entries must be files' }, 400)
    }
    const bytes = new Uint8Array(await file.arrayBuffer())
    images.push({ bytes, mimeType: file.type })
  }

  if (images.length === 0) {
    return c.json({ error: 'At least one image is required' }, 400)
  }

  const ai = c.get('ai')
  const result = await ai.extractRecipeIndex(images)

  return c.json(result)
})
