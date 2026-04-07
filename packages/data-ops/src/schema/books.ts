import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from './auth'

export const book = sqliteTable(
  'book',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    author: text('author').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [index('book_user_id_idx').on(t.userId)],
)

export const recipe = sqliteTable(
  'recipe',
  {
    id: text('id').primaryKey(),
    bookId: text('book_id')
      .notNull()
      .references(() => book.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    pageStart: integer('page_start').notNull(),
    pageEnd: integer('page_end').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [index('recipe_book_id_idx').on(t.bookId)],
)

export type Book = typeof book.$inferSelect
export type NewBook = typeof book.$inferInsert
export type Recipe = typeof recipe.$inferSelect
export type NewRecipe = typeof recipe.$inferInsert
