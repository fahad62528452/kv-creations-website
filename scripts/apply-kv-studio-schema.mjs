import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import pg from 'pg'

function loadEnvFile(path) {
  const text = readFileSync(path, 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq)
    let value = trimmed.slice(eq + 1)
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const sourceEnvPath = process.env.KV_SUPABASE_ENV_FILE
const source = sourceEnvPath ? loadEnvFile(sourceEnvPath) : {}
const databaseUrl =
  process.env.DATABASE_URL ||
  source.POSTGRES_URL_NON_POOLING ||
  source.DATABASE_URL ||
  source.POSTGRES_URL

if (!databaseUrl) {
  console.error(
    'Set DATABASE_URL or KV_SUPABASE_ENV_FILE pointing at an env file with a Postgres URL.',
  )
  process.exit(1)
}

const sqlPath = resolve(
  process.cwd(),
  'supabase/migrations/20260809_kv_studio.sql',
)
const sql = readFileSync(sqlPath, 'utf8')

const client = new pg.Client({
  connectionString: databaseUrl.replace(/[?&]sslmode=[^&]+/g, ''),
  ssl: { rejectUnauthorized: false },
})

await client.connect()
try {
  await client.query(sql)
  console.log('Applied kv_studio migration successfully')
} finally {
  await client.end()
}
