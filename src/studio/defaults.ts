import type { FirmProfile, LineItem, Party, StudioDocument } from './types'

export const FIRM_DEFAULT: FirmProfile = {
  name: 'KV Creations',
  address: '',
  phone: '',
  email: 'hello@kvcreations.com',
  gstin: '',
  state: '',
  stateCode: '',
  bankName: '',
  accountName: 'KV Creations',
  accountNumber: '',
  ifsc: '',
  upi: '',
}

export const EMPTY_CLIENT: Party = {
  name: '',
  address: '',
  phone: '',
  email: '',
  gstin: '',
  state: '',
  stateCode: '',
}

export function createId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function createLineItem(partial?: Partial<LineItem>): LineItem {
  return {
    id: createId('line'),
    description: '',
    hsnSac: '',
    quantity: 1,
    unit: 'Pkg',
    rate: 0,
    gstRate: 18,
    ...partial,
  }
}

export function nextDocumentNumber(type: StudioDocument['type']): string {
  const year = new Date().getFullYear()
  const seq = String(Date.now()).slice(-4)
  const prefix = type === 'invoice' ? 'INV' : 'QT'
  return `${prefix}-${year}-${seq}`
}

export function createDocument(
  type: StudioDocument['type'] = 'quotation',
  firm?: FirmProfile,
): StudioDocument {
  return {
    id: createId('doc'),
    type,
    number: nextDocumentNumber(type),
    date: todayISO(),
    dueDate: addDaysISO(15),
    validUntil: addDaysISO(30),
    placeOfSupply: firm?.state || '',
    taxMode: 'cgst_sgst',
    firm: { ...(firm ?? FIRM_DEFAULT) },
    client: { ...EMPTY_CLIENT },
    items: [
      createLineItem({
        description: 'Wedding planning & coordination',
        hsnSac: '998596',
        quantity: 1,
        unit: 'Pkg',
        rate: 0,
        gstRate: 18,
      }),
    ],
    inclusions: '',
    notes: 'Thank you for choosing KV Creations.',
    terms:
      type === 'quotation'
        ? 'This quotation is valid until the date shown. Fifty percent advance confirms the booking. Balance due as per the final invoice.'
        : 'Payment due by the date shown. Please mention the invoice number in the transfer reference.',
    updatedAt: new Date().toISOString(),
  }
}

export function inclusionLines(text: string | undefined): string[] {
  if (!text) return []
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(Boolean)
}

export function normalizeDocument(doc: StudioDocument): StudioDocument {
  return {
    ...createDocument(doc.type),
    ...doc,
    inclusions: doc.inclusions ?? '',
    firm: { ...FIRM_DEFAULT, ...doc.firm },
    client: { ...EMPTY_CLIENT, ...doc.client },
    items: doc.items?.length ? doc.items : createDocument(doc.type).items,
  }
}
