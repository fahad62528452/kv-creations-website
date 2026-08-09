export type DocumentType = 'quotation' | 'invoice'

export type TaxMode = 'cgst_sgst' | 'igst'

export type LineItem = {
  id: string
  description: string
  hsnSac: string
  quantity: number
  unit: string
  rate: number
  gstRate: number
}

export type Party = {
  name: string
  address: string
  phone: string
  email: string
  gstin: string
  state: string
  stateCode: string
}

export type FirmProfile = Party & {
  bankName: string
  accountName: string
  accountNumber: string
  ifsc: string
  upi: string
}

export type StudioDocument = {
  id: string
  type: DocumentType
  number: string
  date: string
  dueDate: string
  validUntil: string
  placeOfSupply: string
  taxMode: TaxMode
  firm: FirmProfile
  client: Party
  items: LineItem[]
  notes: string
  terms: string
  updatedAt: string
}

export type DocumentTotals = {
  taxable: number
  cgst: number
  sgst: number
  igst: number
  grand: number
  byRate: Array<{
    rate: number
    taxable: number
    cgst: number
    sgst: number
    igst: number
  }>
}
