import type { Db } from '@slowcook/data-ops'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { Env } from './env'

export function createAuth(db: Db, env: Env) {
  const socialProviders: Record<string, unknown> = {}

  if (env.APPLE_CLIENT_ID) {
    socialProviders.apple = {
      clientId: env.APPLE_CLIENT_ID,
      teamId: env.APPLE_TEAM_ID,
      keyId: env.APPLE_KEY_ID,
      privateKey: env.APPLE_PRIVATE_KEY,
    }
  }

  return betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true },
    socialProviders,
    trustedOrigins: [env.BETTER_AUTH_URL],
  })
}

export type Auth = ReturnType<typeof createAuth>
