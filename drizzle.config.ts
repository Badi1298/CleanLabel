import { existsSync } from 'node:fs'
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env', quiet: true })
if (existsSync('.env.local')) {
  config({ path: '.env.local', override: true })
}

export default defineConfig({
  out: './drizzle',
  schema: ['./src/db/app-schema.ts', './src/db/auth-schema.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!,
  },
})
