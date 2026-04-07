import type { ExtractedBookMeta, ExtractedRecipe } from './schemas'

export interface ImageInput {
  bytes: Uint8Array
  mimeType: string
}

export interface CookbookAIProvider {
  readonly name: string
  extractBookMeta(cover: ImageInput): Promise<ExtractedBookMeta>
  extractRecipeIndex(pages: ImageInput[]): Promise<ExtractedRecipe[]>
}
