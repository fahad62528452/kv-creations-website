import { createDocument, FIRM_DEFAULT, normalizeDocument } from './defaults'
import type { FirmProfile, StudioDocument } from './types'

const FIRM_KEY = 'kv-studio-firm'
const DRAFTS_KEY = 'kv-studio-drafts'
const ACTIVE_KEY = 'kv-studio-active'
const AUTH_KEY = 'kv-studio-auth'

export function loadFirm(): FirmProfile {
  try {
    const raw = localStorage.getItem(FIRM_KEY)
    if (!raw) return { ...FIRM_DEFAULT }
    return { ...FIRM_DEFAULT, ...JSON.parse(raw) }
  } catch {
    return { ...FIRM_DEFAULT }
  }
}

export function saveFirm(firm: FirmProfile) {
  localStorage.setItem(FIRM_KEY, JSON.stringify(firm))
}

export function loadDrafts(): StudioDocument[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StudioDocument[]
    return Array.isArray(parsed) ? parsed.map(normalizeDocument) : []
  } catch {
    return []
  }
}

export function saveDrafts(drafts: StudioDocument[]) {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

export function upsertDraft(doc: StudioDocument): StudioDocument[] {
  const drafts = loadDrafts()
  const next = { ...doc, updatedAt: new Date().toISOString() }
  const index = drafts.findIndex((d) => d.id === next.id)
  if (index >= 0) drafts[index] = next
  else drafts.unshift(next)
  saveDrafts(drafts.slice(0, 40))
  return drafts.slice(0, 40)
}

export function deleteDraft(id: string): StudioDocument[] {
  const drafts = loadDrafts().filter((d) => d.id !== id)
  saveDrafts(drafts)
  return drafts
}

export function loadActiveDocument(): StudioDocument {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY)
    if (raw) return normalizeDocument(JSON.parse(raw) as StudioDocument)
  } catch {
    /* fall through */
  }
  return createDocument('quotation', loadFirm())
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
