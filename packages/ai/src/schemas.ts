import { z } from 'zod'

export const extractedBookMetaSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
})

export const extractedRecipeSchema = z.object({
  name: z.string().min(1),
  pageStart: z.coerce.number().int().positive(),
  pageEnd: z.coerce.number().int().positive(),
})

export const extractedRecipesSchema = z.array(extractedRecipeSchema)

export type ExtractedBookMeta = z.infer<typeof extractedBookMetaSchema>
export type ExtractedRecipe = z.infer<typeof extractedRecipeSchema>
