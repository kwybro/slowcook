import { GoogleGenAI } from '@google/genai'
import type { CookbookAIProvider, ImageInput } from './provider'
import {
  type ExtractedBookMeta,
  type ExtractedRecipe,
  extractedBookMetaSchema,
  extractedRecipesSchema,
} from './schemas'

export interface GeminiProviderConfig {
  apiKey: string
  /** Defaults to `gemini-2.0-flash` */
  model?: string
}

const DEFAULT_MODEL = 'gemini-2.0-flash'

const BOOK_META_PROMPT = `You are analyzing the front cover of a cookbook.
Extract the book's title and primary author(s). If multiple authors are listed,
join them with ", " in the author field. Return JSON with this exact shape:
{ "title": "string", "author": "string" }
Return only the JSON object. Do not include markdown fences or commentary.`

const RECIPE_INDEX_PROMPT = `You are analyzing one or more pages from a cookbook's index (table of contents).
Extract every recipe entry visible. For each, capture the recipe name and the page range
where it begins and ends. If only a single page is listed, use the same number for pageStart
and pageEnd. Omit section headers and non-recipe entries. Return JSON with this exact shape:
[{ "name": "string", "pageStart": 0, "pageEnd": 0 }]
Return only the JSON array. Do not include markdown fences or commentary.`

export class GeminiProvider implements CookbookAIProvider {
  readonly name = 'gemini'
  private readonly client: GoogleGenAI
  private readonly model: string

  constructor(config: GeminiProviderConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey })
    this.model = config.model ?? DEFAULT_MODEL
  }

  async extractBookMeta(cover: ImageInput): Promise<ExtractedBookMeta> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [imagePart(cover), { text: BOOK_META_PROMPT }],
        },
      ],
      config: { responseMimeType: 'application/json' },
    })
    const raw = parseJson(response.text)
    return extractedBookMetaSchema.parse(raw)
  }

  async extractRecipeIndex(pages: ImageInput[]): Promise<ExtractedRecipe[]> {
    if (pages.length === 0) {
      throw new Error('extractRecipeIndex requires at least one page image')
    }
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [...pages.map(imagePart), { text: RECIPE_INDEX_PROMPT }],
        },
      ],
      config: { responseMimeType: 'application/json' },
    })
    const raw = parseJson(response.text)
    return extractedRecipesSchema.parse(raw)
  }
}

function imagePart(input: ImageInput) {
  return {
    inlineData: {
      data: uint8ArrayToBase64(input.bytes),
      mimeType: input.mimeType,
    },
  }
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function parseJson(text: string | undefined): unknown {
  if (!text) {
    throw new Error('Gemini returned an empty response')
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Gemini response was not valid JSON: ${text.slice(0, 200)}`)
  }
}
