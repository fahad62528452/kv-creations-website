import type { DocumentTotals, LineItem, TaxMode } from './types'

export function lineTaxable(item: LineItem): number {
  const qty = Number.isFinite(item.quantity) ? item.quantity : 0
  const rate = Number.isFinite(item.rate) ? item.rate : 0
  return round2(qty * rate)
}

export function computeTotals(items: LineItem[], taxMode: TaxMode): DocumentTotals {
  const groups = new Map<
    number,
    { taxable: number; cgst: number; sgst: number; igst: number }
  >()

  for (const item of items) {
    const taxable = lineTaxable(item)
    if (taxable <= 0 && !item.description.trim()) continue

    const gstRate = Number.isFinite(item.gstRate) ? item.gstRate : 0
    const tax = round2((taxable * gstRate) / 100)
    const existing = groups.get(gstRate) ?? {
      taxable: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    }

    existing.taxable = round2(existing.taxable + taxable)

    if (taxMode === 'igst') {
      existing.igst = round2(existing.igst + tax)
    } else {
      const half = round2(tax / 2)
      existing.cgst = round2(existing.cgst + half)
      existing.sgst = round2(existing.sgst + (tax - half))
    }

    groups.set(gstRate, existing)
  }

  const byRate = [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([rate, g]) => ({ rate, ...g }))

  const taxable = round2(byRate.reduce((sum, g) => sum + g.taxable, 0))
  const cgst = round2(byRate.reduce((sum, g) => sum + g.cgst, 0))
  const sgst = round2(byRate.reduce((sum, g) => sum + g.sgst, 0))
  const igst = round2(byRate.reduce((sum, g) => sum + g.igst, 0))

  return {
    taxable,
    cgst,
    sgst,
    igst,
    grand: round2(taxable + cgst + sgst + igst),
    byRate,
  }
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

export function formatINRPlain(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

export function amountInWords(amount: number): string {
  const rupees = Math.floor(Math.abs(amount))
  const paise = Math.round((Math.abs(amount) - rupees) * 100)
  const words = `${numberToWords(rupees)} Rupees`
  if (paise > 0) {
    return `${words} and ${numberToWords(paise)} Paise Only`
  }
  return `${words} Only`
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

function numberToWords(n: number): string {
  if (n === 0) return 'Zero'

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ]
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ]

  const twoDigits = (num: number) => {
    if (num < 20) return ones[num]
    const t = Math.floor(num / 10)
    const o = num % 10
    return o ? `${tens[t]} ${ones[o]}` : tens[t]
  }

  const threeDigits = (num: number) => {
    const h = Math.floor(num / 100)
    const rest = num % 100
    if (h && rest) return `${ones[h]} Hundred ${twoDigits(rest)}`
    if (h) return `${ones[h]} Hundred`
    return twoDigits(rest)
  }

  const crore = Math.floor(n / 10000000)
  const lakh = Math.floor((n % 10000000) / 100000)
  const thousand = Math.floor((n % 100000) / 1000)
  const hundred = n % 1000

  const parts: string[] = []
  if (crore) parts.push(`${twoDigits(crore)} Crore`)
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`)
  if (hundred) parts.push(threeDigits(hundred))

  return parts.join(' ')
}
