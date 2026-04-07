import { and, book, eq, like, or, recipe } from '@slowcook/data-ops'
import { createBookRequestSchema } from '@slowcook/shared'
import { Hono } from 'hono'
import type { AppBindings } from '../context'
import { requireSession } from '../middleware/require-session'

export const books = new Hono<AppBindings>()

books.use('/*', requireSession)

books.get('/', async (c) => {
  const db = c.get('db')
  const userId = c.get('userId')
  const query = c.req.query('q')

  const baseFilter = eq(book.userId, userId)
  const rows = await db
    .select()
    .from(book)
    .where(
      query
        ? and(baseFilter, or(like(book.title, `%${query}%`), like(book.author, `%${query}%`)))
        : baseFilter,
    )
    .orderBy(book.createdAt)

  return c.json(
    rows.map((b) => ({
      ...b,
      createdAt: b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt,
    })),
  )
})

books.get('/:id', async (c) => {
  const db = c.get('db')
  const userId = c.get('userId')
  const bookId = c.req.param('id')

  const [foundBook] = await db
    .select()
    .from(book)
    .where(and(eq(book.id, bookId), eq(book.userId, userId)))
    .limit(1)

  if (!foundBook) {
    return c.json({ error: 'Book not found' }, 404)
  }

  const recipes = await db.select().from(recipe).where(eq(recipe.bookId, bookId))

  return c.json({
    ...foundBook,
    createdAt:
      foundBook.createdAt instanceof Date ? foundBook.createdAt.getTime() : foundBook.createdAt,
    recipes: recipes.map((r) => ({
      ...r,
      createdAt: r.createdAt instanceof Date ? r.createdAt.getTime() : r.createdAt,
    })),
  })
})

books.post('/', async (c) => {
  const db = c.get('db')
  const userId = c.get('userId')
  const body = await c.req.json()
  const parsed = createBookRequestSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid request', details: parsed.error.issues }, 400)
  }

  const { title, author, recipes: recipeInputs } = parsed.data
  const bookId = crypto.randomUUID()
  const now = Date.now()

  await db.batch([
    db.insert(book).values({ id: bookId, userId, title, author }),
    ...recipeInputs.map((r) =>
      db.insert(recipe).values({
        id: crypto.randomUUID(),
        bookId,
        name: r.name,
        pageStart: r.pageStart,
        pageEnd: r.pageEnd,
      }),
    ),
  ])

  return c.json({ id: bookId, userId, title, author, createdAt: now }, 201)
})

books.delete('/:id', async (c) => {
  const db = c.get('db')
  const userId = c.get('userId')
  const bookId = c.req.param('id')

  const result = await db.delete(book).where(and(eq(book.id, bookId), eq(book.userId, userId)))

  if (result.rowsAffected === 0) {
    return c.json({ error: 'Book not found' }, 404)
  }

  return c.json({ deleted: true })
})
