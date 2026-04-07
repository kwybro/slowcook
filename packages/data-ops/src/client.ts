import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export interface DbConfig {
  /** libSQL URL — e.g. `file:./local.db` locally or `libsql://...` on Turso */
  url: string
  /** Required for Turso remote, omitted for local file URLs */
  authToken?: string
}

export function createDb(config: DbConfig) {
  const client = createClient({
    url: config.url,
    authToken: config.authToken,
  })
  return drizzle(client, { schema })
}

export type Db = ReturnType<typeof createDb>
