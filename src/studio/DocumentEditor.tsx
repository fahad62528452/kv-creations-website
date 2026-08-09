import { useState, type ReactNode } from 'react'
import type { FirmProfile, LineItem, Party, StudioDocument, TaxMode } from './types'
import { createLineItem } from './defaults'
import { computeTotals, formatINR } from './gst'

type FieldProps = {
  label: string
  children: ReactNode
  className?: string
}

function Field({ label, children, className = '' }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.24em] text-ink/50">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputClass =
  'w-full border-0 border-b border-ink/15 bg-transparent py-2 font-[family-name:var(--font-body)] text-sm font-light text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-bronze'

const textareaClass = `${inputClass} min-h-[72px] resize-y`

function PartyFields({
  value,
  onChange,
  includeBank = false,
}: {
  value: Party | FirmProfile
  onChange: (next: Party | FirmProfile) => void
  includeBank?: boolean
}) {
  const set = <K extends keyof FirmProfile>(key: K, val: FirmProfile[K]) => {
    onChange({ ...value, [key]: val } as FirmProfile)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Name" className="sm:col-span-2">
        <input
          className={inputClass}
          value={value.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </Field>
      <Field label="Address" className="sm:col-span-2">
        <textarea
          className={textareaClass}
          value={value.address}
          onChange={(e) => set('address', e.target.value)}
          rows={3}
        />
      </Field>
      <Field label="Phone">
        <input
          className={inputClass}
          value={value.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
      </Field>
      <Field label="Email">
        <input
          className={inputClass}
          type="email"
          value={value.email}
          onChange={(e) => set('email', e.target.value)}
        />
      </Field>
      <Field label="GSTIN">
        <input
          className={inputClass}
          value={value.gstin}
          onChange={(e) => set('gstin', e.target.value.toUpperCase())}
        />
      </Field>
      <Field label="State">
        <input
          className={inputClass}
          value={value.state}
          onChange={(e) => set('state', e.target.value)}
        />
      </Field>
      <Field label="State code">
        <input
          className={inputClass}
          value={value.stateCode}
          onChange={(e) => set('stateCode', e.target.value)}
          placeholder="e.g. 29"
        />
      </Field>
      {includeBank && (
        <>
          <Field label="Bank name">
            <input
              className={inputClass}
              value={(value as FirmProfile).bankName}
              onChange={(e) => set('bankName', e.target.value)}
            />
          </Field>
          <Field label="Account name">
            <input
              className={inputClass}
              value={(value as FirmProfile).accountName}
              onChange={(e) => set('accountName', e.target.value)}
            />
          </Field>
          <Field label="Account number">
            <input
              className={inputClass}
              value={(value as FirmProfile).accountNumber}
              onChange={(e) => set('accountNumber', e.target.value)}
            />
          </Field>
          <Field label="IFSC">
            <input
              className={inputClass}
              value={(value as FirmProfile).ifsc}
              onChange={(e) => set('ifsc', e.target.value.toUpperCase())}
            />
          </Field>
          <Field label="UPI" className="sm:col-span-2">
            <input
              className={inputClass}
              value={(value as FirmProfile).upi}
              onChange={(e) => set('upi', e.target.value)}
            />
          </Field>
        </>
      )}
    </div>
  )
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-t border-bronze/15 pt-8 first:border-t-0 first:pt-0">
      <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.32em] text-bronze">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-medium tracking-[0.06em] text-ink">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default function DocumentEditor({
  doc,
  onChange,
}: {
  doc: StudioDocument
  onChange: (next: StudioDocument) => void
}) {
  const [panel, setPanel] = useState<'document' | 'inclusions'>('document')
  const totals = computeTotals(doc.items, doc.taxMode)
  const inclusionCount = (doc.inclusions || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length

  const patch = (partial: Partial<StudioDocument>) => {
    onChange({ ...doc, ...partial })
  }

  const updateItem = (id: string, partial: Partial<LineItem>) => {
    patch({
      items: doc.items.map((item) =>
        item.id === id ? { ...item, ...partial } : item,
      ),
    })
  }

  const removeItem = (id: string) => {
    if (doc.items.length <= 1) return
    patch({ items: doc.items.filter((item) => item.id !== id) })
  }

  const moveItem = (id: string, dir: -1 | 1) => {
    const index = doc.items.findIndex((item) => item.id === id)
    const next = index + dir
    if (index < 0 || next < 0 || next >= doc.items.length) return
    const items = [...doc.items]
    const [row] = items.splice(index, 1)
    items.splice(next, 0, row)
    patch({ items })
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-[4.5rem] z-10 -mx-4 border-b border-bronze/15 bg-paper/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.28em] text-bronze">
          Compose
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPanel('document')}
            className={`border px-3 py-3 text-left transition-colors ${
              panel === 'document'
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/15 text-ink/70 hover:border-bronze hover:text-bronze'
            }`}
          >
            <span className="block font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em]">
              Page 1
            </span>
            <span className="mt-1 block font-[family-name:var(--font-display)] text-sm tracking-[0.04em]">
              Invoice details
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPanel('inclusions')}
            className={`border px-3 py-3 text-left transition-colors ${
              panel === 'inclusions'
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/15 text-ink/70 hover:border-bronze hover:text-bronze'
            }`}
          >
            <span className="block font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em]">
              Page 2
            </span>
            <span className="mt-1 block font-[family-name:var(--font-display)] text-sm tracking-[0.04em]">
              Event inclusions
              {inclusionCount > 0 ? ` (${inclusionCount})` : ''}
            </span>
          </button>
        </div>
      </div>

      {panel === 'inclusions' ? (
        <Section eyebrow="Event" title="What we provide">
          <p className="mb-4 max-w-[48ch] font-[family-name:var(--font-body)] text-sm font-light leading-relaxed text-ink/55">
            This is page 2 of the PDF. Enter one inclusion per line — decor,
            coordination, guest flow, and anything else covered for the event.
          </p>
          <Field label="Inclusions (one per line)">
            <textarea
              className={`${textareaClass} min-h-[280px]`}
              value={doc.inclusions || ''}
              onChange={(e) => patch({ inclusions: e.target.value })}
              rows={14}
              autoFocus
              placeholder={
                'Full wedding planning & day-of coordination\nMandap & floral art direction\nGuest hospitality & seating flow\nVendor management\nReception atmosphere design'
              }
            />
          </Field>
          <p className="mt-4 font-[family-name:var(--font-body)] text-[11px] font-light text-ink/45">
            Tip: switch to Preview to see page 2 update live.
          </p>
        </Section>
      ) : (
        <div className="space-y-10">
      <Section eyebrow="Document" title="Composition">
        <div className="flex flex-wrap gap-2">
          {(['quotation', 'invoice'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => patch({ type })}
              className={`border px-4 py-2 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.24em] transition-colors ${
                doc.type === type
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink/20 text-ink/70 hover:border-bronze hover:text-bronze'
              }`}
            >
              {type === 'quotation' ? 'Quotation' : 'Tax invoice'}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Document no.">
            <input
              className={inputClass}
              value={doc.number}
              onChange={(e) => patch({ number: e.target.value })}
            />
          </Field>
          <Field label="Date">
            <input
              className={inputClass}
              type="date"
              value={doc.date}
              onChange={(e) => patch({ date: e.target.value })}
            />
          </Field>
          {doc.type === 'quotation' ? (
            <Field label="Valid until">
              <input
                className={inputClass}
                type="date"
                value={doc.validUntil}
                onChange={(e) => patch({ validUntil: e.target.value })}
              />
            </Field>
          ) : (
            <Field label="Due date">
              <input
                className={inputClass}
                type="date"
                value={doc.dueDate}
                onChange={(e) => patch({ dueDate: e.target.value })}
              />
            </Field>
          )}
          <Field label="Place of supply">
            <input
              className={inputClass}
              value={doc.placeOfSupply}
              onChange={(e) => patch({ placeOfSupply: e.target.value })}
            />
          </Field>
          <Field label="Tax mode" className="sm:col-span-2">
            <div className="flex flex-wrap gap-2 pt-1">
              {(
                [
                  ['cgst_sgst', 'CGST + SGST'],
                  ['igst', 'IGST'],
                ] as [TaxMode, string][]
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => patch({ taxMode: mode })}
                  className={`border px-4 py-2 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.24em] transition-colors ${
                    doc.taxMode === mode
                      ? 'border-bronze bg-bronze/10 text-ink'
                      : 'border-ink/20 text-ink/70 hover:border-bronze'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      <Section eyebrow="Atelier" title="Your firm">
        <PartyFields
          value={doc.firm}
          includeBank
          onChange={(firm) => patch({ firm: firm as FirmProfile })}
        />
      </Section>

      <Section eyebrow="Client" title="Bill to">
        <PartyFields
          value={doc.client}
          onChange={(client) => patch({ client: client as Party })}
        />
      </Section>

      <Section eyebrow="Services" title="Line items">
        <div className="space-y-6">
          {doc.items.map((item, index) => (
            <div
              key={item.id}
              className="border border-bronze/15 bg-paper-deep/50 px-4 py-5 sm:px-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.28em] text-ink/45">
                  Item {String(index + 1).padStart(2, '0')}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, -1)}
                    className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-ink/45 hover:text-bronze"
                    aria-label="Move up"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, 1)}
                    className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-ink/45 hover:text-bronze"
                    aria-label="Move down"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-ink/45 hover:text-bronze"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-6">
                <Field label="Description" className="sm:col-span-6">
                  <input
                    className={inputClass}
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                  />
                </Field>
                <Field label="HSN/SAC" className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={item.hsnSac}
                    onChange={(e) =>
                      updateItem(item.id, { hsnSac: e.target.value })
                    }
                  />
                </Field>
                <Field label="Qty">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step="any"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, {
                        quantity: Number(e.target.value) || 0,
                      })
                    }
                  />
                </Field>
                <Field label="Unit">
                  <input
                    className={inputClass}
                    value={item.unit}
                    onChange={(e) =>
                      updateItem(item.id, { unit: e.target.value })
                    }
                  />
                </Field>
                <Field label="Rate (₹)">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step="any"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(item.id, {
                        rate: Number(e.target.value) || 0,
                      })
                    }
                  />
                </Field>
                <Field label="GST %">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step="any"
                    value={item.gstRate}
                    onChange={(e) =>
                      updateItem(item.id, {
                        gstRate: Number(e.target.value) || 0,
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => patch({ items: [...doc.items, createLineItem()] })}
          className="mt-5 border border-dashed border-bronze/40 px-4 py-3 font-[family-name:var(--font-body)] text-[10px] font-light uppercase tracking-[0.28em] text-bronze transition-colors hover:border-bronze hover:bg-bronze/5"
        >
          Add line item
        </button>

        <div className="mt-8 border-t border-bronze/15 pt-6">
          <dl className="ml-auto max-w-xs space-y-2">
            <div className="flex justify-between gap-6 font-[family-name:var(--font-body)] text-sm font-light text-ink/70">
              <dt>Taxable</dt>
              <dd>{formatINR(totals.taxable)}</dd>
            </div>
            {doc.taxMode === 'igst' ? (
              <div className="flex justify-between gap-6 font-[family-name:var(--font-body)] text-sm font-light text-ink/70">
                <dt>IGST</dt>
                <dd>{formatINR(totals.igst)}</dd>
              </div>
            ) : (
              <>
                <div className="flex justify-between gap-6 font-[family-name:var(--font-body)] text-sm font-light text-ink/70">
                  <dt>CGST</dt>
                  <dd>{formatINR(totals.cgst)}</dd>
                </div>
                <div className="flex justify-between gap-6 font-[family-name:var(--font-body)] text-sm font-light text-ink/70">
                  <dt>SGST</dt>
                  <dd>{formatINR(totals.sgst)}</dd>
                </div>
              </>
            )}
            <div className="flex justify-between gap-6 border-t border-ink/10 pt-3 font-[family-name:var(--font-display)] text-lg tracking-[0.04em] text-ink">
              <dt>Total</dt>
              <dd>{formatINR(totals.grand)}</dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section eyebrow="Close" title="Notes & terms">
        <div className="grid gap-6">
          <Field label="Notes">
            <textarea
              className={textareaClass}
              value={doc.notes}
              onChange={(e) => patch({ notes: e.target.value })}
              rows={3}
            />
          </Field>
          <Field label="Terms">
            <textarea
              className={textareaClass}
              value={doc.terms}
              onChange={(e) => patch({ terms: e.target.value })}
              rows={4}
            />
          </Field>
        </div>
      </Section>

          <button
            type="button"
            onClick={() => setPanel('inclusions')}
            className="w-full border border-bronze/40 bg-bronze/5 px-4 py-4 text-left transition-colors hover:border-bronze hover:bg-bronze/10"
          >
            <span className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.28em] text-bronze">
              Next · Page 2
            </span>
            <span className="mt-1 block font-[family-name:var(--font-display)] text-lg tracking-[0.04em] text-ink">
              Add event inclusions
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
