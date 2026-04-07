import type { CookbookAIProvider } from '@slowcook/ai'
import type { Db } from '@slowcook/data-ops'
import type { Auth } from './auth'
import type { Env } from './env'

export interface AppBindings {
  Bindings: Env
  Variables: {
    db: Db
    ai: CookbookAIProvider
    auth: Auth
    userId: string
  }
}
