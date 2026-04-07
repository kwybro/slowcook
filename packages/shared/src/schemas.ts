import { z } from 'zod'

// --- Request schemas ---

export const recipeInputSchema = z.object({
  name: z.string().min(1).max(200),
  pageStart: z.number().int().positive(),
  pageEnd: z.number().int().positive(),
})

export const createBookRequestSchema = z.object({
  title: z.string().min(1).max(300),
  author: z.string().min(1).max(200),
  recipes: z.array(recipeInputSchema),
})

// --- Response schemas ---

export const recipeSchema = z.object({
  id: z.string(),
  bookId: z.string(),
  name: z.string(),
  pageStart: z.number().int(),
  pageEnd: z.number().int(),
  createdAt: z.number(),
})

export const bookSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  author: z.string(),
  createdAt: z.number(),
})

export const bookWithRecipesSchema = bookSchema.extend({
  recipes: z.array(recipeSchema),
})

// --- AI extraction types (matches API /scans/* response shapes) ---

export interface ExtractedBookMeta {
  title: string
  author: string
}

export interface ExtractedRecipe {
  name: string
  pageStart: number
  pageEnd: number
}

// --- Inferred types ---

export type RecipeInput = z.infer<typeof recipeInputSchema>
export type CreateBookRequest = z.infer<typeof createBookRequestSchema>
export type BookResponse = z.infer<typeof bookSchema>
export type RecipeResponse = z.infer<typeof recipeSchema>
export type BookWithRecipesResponse = z.infer<typeof bookWithRecipesSchema>
