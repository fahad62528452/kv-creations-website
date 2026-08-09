import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { createDocument, createId } from './defaults'
import DocumentEditor from './DocumentEditor'
import DocumentPreview from './DocumentPreview'
import { downloadDocumentPdf } from './exportPdf'
import PasswordGate from './PasswordGate'
import {
  cloudEnabled,
  deleteDraft,
  isStudioAuthed,
  loadActiveDocument,
  loadDrafts,
  loadFirm,
  saveActiveDocument,
  saveFirm,
  setStudioAuthed,
  upsertDraft,
} from './storage'
import type { StudioDocument } from './types'
import './studio.css'

function formatDraftLabel(doc: StudioDocument): string {
  const kind = doc.type === 'invoice' ? 'INV' : 'QT'
  const client = doc.client.name || 'Untitled'
  return `${kind} ${doc.number} · ${client}`
}

function StudioWorkspace() {
  const [doc, setDoc] = useState<StudioDocument>(() => loadActiveDocument())
  const [drafts, setDrafts] = useState<StudioDocument[]>([])
  const [showDrafts, setShowDrafts] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [pdfFlash, setPdfFlash] = useState('')
  const [mobileView, setMobileView] = useState<'compose' | 'preview'>('compose')
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [syncLabel, setSyncLabel] = useState('')
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [nextDrafts, firm] = await Promise.all([loadDrafts(), loadFirm()])
      if (cancelled) return
      setDrafts(nextDrafts)
      setDoc((current) => ({
        ...current,
        firm: current.firm.name ? current.firm : firm,
      }))
      setSyncLabel(cloudEnabled() ? 'Cloud sync on' : 'Local only')
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    saveActiveDocument(doc)
  }, [doc])

  const handleChange = (next: StudioDocument) => {
    setDoc(next)
  }

  const saveDraft = async () => {
    const nextDrafts = await upsertDraft(doc)
    setDrafts(nextDrafts)
    await saveFirm(doc.firm)
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1800)
  }

  const newDocument = async (type: StudioDocument['type']) => {
    const firm = doc.firm.name ? doc.firm : await loadFirm()
    const next = createDocument(type, firm)
    setDoc(next)
    setMobileView('compose')
    setShowDrafts(false)
  }

  const duplicateDocument = () => {
    const copy: StudioDocument = {
      ...structuredClone(doc),
      id: createId('doc'),
      number: createDocument(doc.type, doc.firm).number,
      updatedAt: new Date().toISOString(),
    }
    setDoc(copy)
  }

  const loadDraft = (draft: StudioDocument) => {
    setDoc(draft)
    setShowDrafts(false)
    setMobileView('compose')
  }

  const removeDraft = async (id: string) => {
    setDrafts(await deleteDraft(id))
  }

  const downloadPdf = async () => {
    if (exporting) return
    setExportError('')
    setPdfFlash('')
    setExporting(true)

    try {
      const filename = await downloadDocumentPdf(doc)
      setPdfFlash(`Downloaded ${filename}`)
      window.setTimeout(() => setPdfFlash(''), 4000)
    } catch (error) {
      console.error(error)
      setExportError(
        error instanceof Error ? error.message : 'Could not save PDF. Try again.',
      )
    } finally {
      setExporting(false)
    }
  }

  const lockStudio = () => {
    setStudioAuthed(false)
    window.location.reload()
  }

  return (
    <div className="studio-app min-h-dvh bg-paper text-ink">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 10% 0%, color-mix(in srgb, var(--color-bronze) 10%, transparent), transparent 55%), linear-gradient(180deg, var(--color-paper-deep), var(--color-paper) 40%)',
        }}
      />
      <div className="grain studio-no-print" />

      <header className="studio-no-print sticky top-0 z-40 border-b border-bronze/15 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="shrink-0">
              <img
                src="/logo/logo-hero.png"
                alt="KV Creations"
                className="h-9 w-auto sm:h-10"
              />
            </Link>
            <div className="hidden sm:block">
              <p className="font-[family-name:var(--font-body)] text-[9px] font-light uppercase tracking-[0.32em] text-bronze">
                Team studio{syncLabel ? ` · ${syncLabel}` : ''}
              </p>
              <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.12em] text-ink">
                Quote & Invoice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {savedFlash && (
              <span className="hidden font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-bronze sm:inline">
                Saved
              </span>
            )}
            {pdfFlash && (
              <span className="max-w-[14rem] truncate font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.14em] text-bronze sm:max-w-[20rem]">
                {pdfFlash}
              </span>
            )}
            {exportError && (
              <span className="max-w-[12rem] truncate font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.14em] text-bronze sm:max-w-[18rem]">
                {exportError}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowDrafts((v) => !v)}
              className="hidden border border-ink/15 px-3 py-2 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.22em] text-ink/70 transition-colors hover:border-bronze hover:text-bronze md:inline-flex"
            >
              Drafts
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="border border-ink/15 px-3 py-2 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.22em] text-ink/70 transition-colors hover:border-bronze hover:text-bronze"
            >
              Save
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={exporting}
              className="border border-ink bg-ink px-3 py-2 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink-muted disabled:cursor-wait disabled:opacity-60"
            >
              {exporting ? 'Saving…' : 'PDF'}
            </button>
          </div>
        </div>

        <div className="studio-no-print border-t border-bronze/10 md:hidden">
          <div className="mx-auto flex max-w-[1600px] gap-1 px-4 py-2">
            <button
              type="button"
              onClick={() => setMobileView('compose')}
              className={`flex-1 py-2 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.24em] ${
                mobileView === 'compose' ? 'text-ink' : 'text-ink/40'
              }`}
            >
              Compose
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-2 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.24em] ${
                mobileView === 'preview' ? 'text-ink' : 'text-ink/40'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setShowDrafts((v) => !v)}
              className="flex-1 py-2 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.24em] text-ink/40"
            >
              Drafts
            </button>
          </div>
        </div>
      </header>

      {showDrafts && (
        <div className="studio-no-print border-b border-bronze/15 bg-paper-deep/80">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.28em] text-bronze">
                Saved drafts
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => newDocument('quotation')}
                  className="border border-ink/15 px-3 py-1.5 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-ink/70 hover:border-bronze"
                >
                  New quote
                </button>
                <button
                  type="button"
                  onClick={() => newDocument('invoice')}
                  className="border border-ink/15 px-3 py-1.5 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-ink/70 hover:border-bronze"
                >
                  New invoice
                </button>
                <button
                  type="button"
                  onClick={duplicateDocument}
                  className="border border-ink/15 px-3 py-1.5 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-ink/70 hover:border-bronze"
                >
                  Duplicate
                </button>
              </div>
            </div>
            {drafts.length === 0 ? (
              <p className="font-[family-name:var(--font-body)] text-sm font-light text-ink/50">
                No drafts yet. Save the current document to keep it here.
              </p>
            ) : (
              <ul className="divide-y divide-bronze/10 border border-bronze/15 bg-paper">
                {drafts.map((draft) => (
                  <li
                    key={draft.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <button
                      type="button"
                      onClick={() => loadDraft(draft)}
                      className="text-left font-[family-name:var(--font-body)] text-sm font-light text-ink hover:text-bronze"
                    >
                      {formatDraftLabel(draft)}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDraft(draft.id)}
                      className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-ink/40 hover:text-bronze"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <main className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-8">
        <aside
          className={`studio-no-print border-bronze/10 px-4 py-8 sm:px-6 lg:col-span-5 lg:border-r lg:px-0 lg:pr-8 lg:pt-2 ${
            mobileView === 'compose' ? 'block' : 'hidden lg:block'
          }`}
        >
          <DocumentEditor doc={doc} onChange={handleChange} />

          <div className="mt-12 flex flex-wrap gap-3 border-t border-bronze/15 pt-8">
            <button
              type="button"
              onClick={() => newDocument('quotation')}
              className="border border-ink/15 px-4 py-2.5 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink/70 hover:border-bronze"
            >
              New quote
            </button>
            <button
              type="button"
              onClick={() => newDocument('invoice')}
              className="border border-ink/15 px-4 py-2.5 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink/70 hover:border-bronze"
            >
              New invoice
            </button>
            <button
              type="button"
              onClick={lockStudio}
              className="ml-auto border border-transparent px-4 py-2.5 font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-ink/40 hover:text-bronze"
            >
              Lock
            </button>
          </div>
        </aside>

        <section
          className={`px-4 py-8 sm:px-6 lg:col-span-7 lg:px-0 lg:py-2 ${
            mobileView === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="studio-no-print mb-4 flex items-end justify-between gap-4 lg:mb-6">
            <div>
              <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.32em] text-bronze">
                Live document
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl tracking-[0.06em] text-ink">
                {doc.type === 'invoice' ? 'Tax Invoice' : 'Quotation'}
              </h2>
            </div>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={exporting}
              className="border border-ink bg-ink px-4 py-2.5 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink-muted disabled:cursor-wait disabled:opacity-60"
            >
              {exporting ? 'Saving PDF…' : 'Download PDF'}
            </button>
          </div>

          <div className="studio-preview-frame">
            <DocumentPreview doc={doc} printRef={printRef} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default function StudioPage() {
  const [authed, setAuthed] = useState(() => isStudioAuthed())

  useEffect(() => {
    // Warm firm defaults after unlock
    if (authed) void loadFirm()
  }, [authed])

  if (!authed) {
    return <PasswordGate onUnlock={() => setAuthed(true)} />
  }

  return <StudioWorkspace />
}
