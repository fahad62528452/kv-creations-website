import { createDocument, FIRM_DEFAULT, normalizeDocument } from './defaults'
import { getSupabase, isSupabaseConfigured } from './supabase'
import type { FirmProfile, StudioDocument } from './types'

const FIRM_KEY = 'kv-studio-firm'
const DRAFTS_KEY = 'kv-studio-drafts'
const ACTIVE_KEY = 'kv-studio-active'
const AUTH_KEY = 'kv-studio-auth'

export function cloudEnabled(): boolean {
  return isSupabaseConfigured()
}

export function loadFirmLocal(): FirmProfile {
  try {
    const raw = localStorage.getItem(FIRM_KEY)
    if (!raw) return { ...FIRM_DEFAULT }
    return { ...FIRM_DEFAULT, ...JSON.parse(raw) }
  } catch {
    return { ...FIRM_DEFAULT }
  }
}

export function saveFirmLocal(firm: FirmProfile) {
  localStorage.setItem(FIRM_KEY, JSON.stringify(firm))
}

export async function loadFirm(): Promise<FirmProfile> {
  const local = loadFirmLocal()
  const supabase = getSupabase()
  if (!supabase) return local

  const { data, error } = await supabase
    .from('kv_studio_firm')
    .select('payload')
    .eq('id', 'default')
    .maybeSingle()

  if (error || !data?.payload) return local
  const firm = { ...FIRM_DEFAULT, ...(data.payload as FirmProfile) }
  saveFirmLocal(firm)
  return firm
}

export async function saveFirm(firm: FirmProfile): Promise<void> {
  saveFirmLocal(firm)
  const supabase = getSupabase()
  if (!supabase) return

  const { error } = await supabase.from('kv_studio_firm').upsert({
    id: 'default',
    payload: firm,
    updated_at: new Date().toISOString(),
  })
  if (error) console.error('Failed to save firm to Supabase', error)
}

export function loadDraftsLocal(): StudioDocument[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StudioDocument[]
    return Array.isArray(parsed) ? parsed.map(normalizeDocument) : []
  } catch {
    return []
  }
}

export function saveDraftsLocal(drafts: StudioDocument[]) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

export async function loadDrafts(): Promise<StudioDocument[]> {
  const local = loadDraftsLocal()
  const supabase = getSupabase()
  if (!supabase) return local

  const { data, error } = await supabase
    .from('kv_studio_documents')
    .select('payload')
    .order('updated_at', { ascending: false })
    .limit(40)

  if (error || !data) {
    console.error('Failed to load drafts from Supabase', error)
    return local
  }

  const drafts = data.map((row) =>
    normalizeDocument(row.payload as StudioDocument),
  )
  saveDraftsLocal(drafts)
  return drafts
}

export async function upsertDraft(doc: StudioDocument): Promise<StudioDocument[]> {
  const next = { ...doc, updatedAt: new Date().toISOString() }
  const local = loadDraftsLocal()
  const index = local.findIndex((d) => d.id === next.id)
  if (index >= 0) local[index] = next
  else local.unshift(next)
  const drafts = local.slice(0, 40)
  saveDraftsLocal(drafts)

  const supabase = getSupabase()
  if (supabase) {
    const { error } = await supabase.from('kv_studio_documents').upsert({
      id: next.id,
      doc_type: next.type,
      number: next.number,
      client_name: next.client.name || '',
      payload: next,
      updated_at: next.updatedAt,
    })
    if (error) console.error('Failed to upsert draft to Supabase', error)
  }

  return drafts
}

export async function deleteDraft(id: string): Promise<StudioDocument[]> {
  const drafts = loadDraftsLocal().filter((d) => d.id !== id)
  saveDraftsLocal(drafts)

  const supabase = getSupabase()
  if (supabase) {
    const { error } = await supabase.from('kv_studio_documents').delete().eq('id', id)
    if (error) console.error('Failed to delete draft from Supabase', error)
  }

  return drafts
}

export function loadActiveDocument(): StudioDocument {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY)
    if (raw) return normalizeDocument(JSON.parse(raw) as StudioDocument)
  } catch {
    /* fall through */
  }
  return createDocument('quotation', loadFirmLocal())
}

export function saveActiveDocument(doc: StudioDocument) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(doc))
}

export function isStudioAuthed(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function setStudioAuthed(value: boolean) {
  if (value) sessionStorage.setItem(AUTH_KEY, '1')
  else sessionStorage.removeItem(AUTH_KEY)
}

export function getStudioPassword(): string {
  return import.meta.env.VITE_STUDIO_PASSWORD || 'kvstudio'
}
