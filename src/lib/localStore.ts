import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'

// ── JSON file fallback (local dev without MONGODB_URI) ──────────────────────
const DATA_DIR = path.join(process.cwd(), 'data')

function readFile<T>(name: string): T[] {
  try {
    const file = path.join(DATA_DIR, `${name}.json`)
    if (!fs.existsSync(file)) return []
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T[]
  } catch { return [] }
}

// ── MongoDB helpers ──────────────────────────────────────────────────────────
const schema = new mongoose.Schema({}, { strict: false, versionKey: false })

function model(name: string) {
  return mongoose.models[name] || mongoose.model(name, schema, name)
}

async function connect() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set')
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false })
}

// ── Unified async API ────────────────────────────────────────────────────────
export async function readStore<T>(name: string): Promise<T[]> {
  if (!process.env.MONGODB_URI) return readFile<T>(name)
  try {
    await connect()
    const docs = await model(name).find({}).lean<any[]>()
    const data = docs.map(({ _id, ...rest }) => rest as T)
    // If MongoDB collection is empty, seed it from JSON file on first load
    if (data.length === 0) {
      const seed = readFile<T>(name)
      if (seed.length > 0) {
        await model(name).insertMany(seed)
        return seed
      }
    }
    return data
  } catch {
    return readFile<T>(name)
  }
}

export async function writeStore<T>(name: string, data: T[]): Promise<void> {
  if (!process.env.MONGODB_URI) {
    // Local dev: write to JSON file
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2))
    return
  }
  await connect()
  const col = model(name)
  await col.deleteMany({})
  if (data.length > 0) await col.insertMany(data as any[])
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
