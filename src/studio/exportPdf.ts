import { amountInWords, computeTotals, formatINRPlain, lineTaxable } from './gst'
import type { StudioDocument } from './types'

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 14
const CONTENT_W = PAGE_W - MARGIN * 2

function fileNameFor(doc: StudioDocument): string {
  const kind = doc.type === 'invoice' ? 'Invoice' : 'Quotation'
  const number = (doc.number || 'draft').replace(/[^\w.-]+/g, '-')
  return `KV-Creations-${kind}-${number}.pdf`
}

function formatDisplayDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/logo/logo-hero.png')
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export async function downloadDocumentPdf(doc: StudioDocument): Promise<string> {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const totals = computeTotals(doc.items, doc.taxMode)
  const title = doc.type === 'invoice' ? 'TAX INVOICE' : 'QUOTATION'
  const ink: [number, number, number] = [28, 28, 28]
  const muted: [number, number, number] = [90, 90, 90]
  const bronze: [number, number, number] = [166, 124, 82]
  const rule: [number, number, number] = [210, 195, 175]

  let y = MARGIN

  const ensureSpace = (need: number) => {
    if (y + need <= PAGE_H - MARGIN) return
    pdf.addPage()
    y = MARGIN
  }

  const drawRule = () => {
    pdf.setDrawColor(...rule)
    pdf.setLineWidth(0.3)
    pdf.line(MARGIN, y, PAGE_W - MARGIN, y)
  }

  const logo = await loadLogoDataUrl()
  if (logo) {
    try {
      pdf.addImage(logo, 'PNG', MARGIN, y, 16, 16)
    } catch {
      /* logo optional */
    }
  }

  pdf.setTextColor(...ink)
  pdf.setFont('times', 'bold')
  pdf.setFontSize(13)
  pdf.text(doc.firm.name || 'KV Creations', MARGIN + (logo ? 20 : 0), y + 6)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...muted)
  const firmLines = [
    doc.firm.address,
    [doc.firm.phone, doc.firm.email].filter(Boolean).join('  ·  '),
    doc.firm.gstin ? `GSTIN: ${doc.firm.gstin}` : '',
    [doc.firm.state, doc.firm.stateCode].filter(Boolean).length
      ? `State: ${[doc.firm.state, doc.firm.stateCode].filter(Boolean).join(' / ')}`
      : '',
  ].filter(Boolean)

  let firmY = y + 11
  for (const line of firmLines) {
    const wrapped = pdf.splitTextToSize(line, 95)
    pdf.text(wrapped, MARGIN + (logo ? 20 : 0), firmY)
    firmY += wrapped.length * 3.6
  }

  pdf.setTextColor(...bronze)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.text('KV CREATIONS', PAGE_W - MARGIN, y + 4, { align: 'right' })

  pdf.setTextColor(...ink)
  pdf.setFont('times', 'bold')
  pdf.setFontSize(16)
  pdf.text(title, PAGE_W - MARGIN, y + 12, { align: 'right' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...muted)
  const meta = [
    `No.  ${doc.number || '—'}`,
    `Date  ${formatDisplayDate(doc.date)}`,
    doc.type === 'quotation'
      ? `Valid until  ${formatDisplayDate(doc.validUntil)}`
      : `Due date  ${formatDisplayDate(doc.dueDate)}`,
    doc.placeOfSupply ? `Place of supply  ${doc.placeOfSupply}` : '',
  ].filter(Boolean)

  let metaY = y + 18
  for (const line of meta) {
    pdf.text(line, PAGE_W - MARGIN, metaY, { align: 'right' })
    metaY += 4
  }

  y = Math.max(firmY, metaY) + 4
  drawRule()
  y += 8

  // Parties
  pdf.setTextColor(...bronze)
  pdf.setFontSize(7.5)
  pdf.text('BILL TO', MARGIN, y)
  pdf.text('FROM', MARGIN + CONTENT_W / 2 + 4, y)
  y += 5

  pdf.setTextColor(...ink)
  pdf.setFont('times', 'bold')
  pdf.setFontSize(11)
  pdf.text(doc.client.name || 'Client name', MARGIN, y)
  pdf.text(doc.firm.name || 'KV Creations', MARGIN + CONTENT_W / 2 + 4, y)
  y += 5

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...muted)

  const leftParty = [
    doc.client.address,
    [doc.client.phone, doc.client.email].filter(Boolean).join('  ·  '),
    doc.client.gstin ? `GSTIN: ${doc.client.gstin}` : '',
    [doc.client.state, doc.client.stateCode].filter(Boolean).length
      ? `State: ${[doc.client.state, doc.client.stateCode].filter(Boolean).join(' / ')}`
      : '',
  ].filter(Boolean)

  const rightParty = [
    [doc.firm.state, doc.firm.stateCode].filter(Boolean).length
      ? `State: ${[doc.firm.state, doc.firm.stateCode].filter(Boolean).join(' / ')}`
      : '',
    `Tax: ${doc.taxMode === 'igst' ? 'IGST' : 'CGST + SGST'}`,
  ].filter(Boolean)

  const leftWrapped = leftParty.flatMap((line) =>
    pdf.splitTextToSize(line, CONTENT_W / 2 - 6),
  )
  const rightWrapped = rightParty.flatMap((line) =>
    pdf.splitTextToSize(line, CONTENT_W / 2 - 6),
  )
  const partyRows = Math.max(leftWrapped.length, rightWrapped.length, 1)
  for (let i = 0; i < partyRows; i++) {
    if (leftWrapped[i]) pdf.text(leftWrapped[i], MARGIN, y + i * 3.8)
    if (rightWrapped[i])
      pdf.text(rightWrapped[i], MARGIN + CONTENT_W / 2 + 4, y + i * 3.8)
  }
  y += partyRows * 3.8 + 6
  drawRule()
  y += 7

  // Table header
  const cols = {
    no: MARGIN,
    desc: MARGIN + 8,
    hsn: MARGIN + 88,
    qty: MARGIN + 112,
    rate: MARGIN + 130,
    gst: MARGIN + 152,
    amt: PAGE_W - MARGIN,
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7.5)
  pdf.setTextColor(...muted)
  pdf.text('#', cols.no, y)
  pdf.text('DESCRIPTION', cols.desc, y)
  pdf.text('HSN/SAC', cols.hsn, y)
  pdf.text('QTY', cols.qty, y, { align: 'right' })
  pdf.text('RATE', cols.rate, y, { align: 'right' })
  pdf.text('GST%', cols.gst, y, { align: 'right' })
  pdf.text('AMOUNT', cols.amt, y, { align: 'right' })
  y += 2
  drawRule()
  y += 5

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(...ink)

  doc.items.forEach((item, index) => {
    const desc = pdf.splitTextToSize(item.description || '—', 76)
    const rowH = Math.max(desc.length * 3.6, 5)
    ensureSpace(rowH + 4)

    pdf.text(String(index + 1), cols.no, y)
    pdf.text(desc, cols.desc, y)
    pdf.text(item.hsnSac || '—', cols.hsn, y)
    pdf.text(`${item.quantity || 0} ${item.unit || ''}`.trim(), cols.qty, y, {
      align: 'right',
    })
    pdf.text(formatINRPlain(item.rate), cols.rate, y, { align: 'right' })
    pdf.text(`${item.gstRate}%`, cols.gst, y, { align: 'right' })
    pdf.text(formatINRPlain(lineTaxable(item)), cols.amt, y, { align: 'right' })
    y += rowH + 2
  })

  y += 2
  drawRule()
  y += 8

  // Amount in words + totals
  ensureSpace(42)
  pdf.setTextColor(...bronze)
  pdf.setFontSize(7.5)
  pdf.text('AMOUNT IN WORDS', MARGIN, y)
  y += 4
  pdf.setTextColor(...ink)
  pdf.setFont('times', 'bold')
  pdf.setFontSize(9)
  const words = pdf.splitTextToSize(amountInWords(totals.grand), 100)
  pdf.text(words, MARGIN, y)

  const sumXLabel = PAGE_W - MARGIN - 55
  const sumXValue = PAGE_W - MARGIN
  let sumY = y - 4

  const sumRow = (label: string, value: string, bold = false) => {
    pdf.setFont('helvetica', bold ? 'bold' : 'normal')
    pdf.setFontSize(bold ? 10 : 8)
    pdf.setTextColor(...(bold ? ink : muted))
    pdf.text(label, sumXLabel, sumY)
    pdf.setTextColor(...ink)
    pdf.text(value, sumXValue, sumY, { align: 'right' })
    sumY += bold ? 6 : 5
  }

  sumRow('Taxable value', `Rs ${formatINRPlain(totals.taxable)}`)
  if (doc.taxMode === 'igst') {
    sumRow('IGST', `Rs ${formatINRPlain(totals.igst)}`)
  } else {
    sumRow('CGST', `Rs ${formatINRPlain(totals.cgst)}`)
    sumRow('SGST', `Rs ${formatINRPlain(totals.sgst)}`)
  }
  pdf.setDrawColor(...bronze)
  pdf.setLineWidth(0.4)
  pdf.line(sumXLabel, sumY - 2, sumXValue, sumY - 2)
  sumRow('Grand total', `Rs ${formatINRPlain(totals.grand)}`, true)

  y = Math.max(y + words.length * 4 + 4, sumY) + 4

  // Tax breakup
  if (totals.byRate.length) {
    ensureSpace(10 + totals.byRate.length * 5)
    drawRule()
    y += 6
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    pdf.setTextColor(...muted)
    pdf.text('GST RATE', MARGIN, y)
    pdf.text('TAXABLE', MARGIN + 40, y, { align: 'right' })
    if (doc.taxMode === 'igst') {
      pdf.text('IGST', MARGIN + 70, y, { align: 'right' })
    } else {
      pdf.text('CGST', MARGIN + 70, y, { align: 'right' })
      pdf.text('SGST', MARGIN + 100, y, { align: 'right' })
    }
    y += 4
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(...ink)
    for (const g of totals.byRate) {
      pdf.text(`${g.rate}%`, MARGIN, y)
      pdf.text(formatINRPlain(g.taxable), MARGIN + 40, y, { align: 'right' })
      if (doc.taxMode === 'igst') {
        pdf.text(formatINRPlain(g.igst), MARGIN + 70, y, { align: 'right' })
      } else {
        pdf.text(formatINRPlain(g.cgst), MARGIN + 70, y, { align: 'right' })
        pdf.text(formatINRPlain(g.sgst), MARGIN + 100, y, { align: 'right' })
      }
      y += 4.2
    }
  }

  // Bank
  const showBank =
    doc.type === 'invoice' &&
    (doc.firm.bankName || doc.firm.accountNumber || doc.firm.upi)
  if (showBank) {
    ensureSpace(16)
    y += 4
    drawRule()
    y += 6
    pdf.setTextColor(...bronze)
    pdf.setFontSize(7.5)
    pdf.text('PAYMENT DETAILS', MARGIN, y)
    y += 4
    pdf.setTextColor(...muted)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    const bankLine = [
      doc.firm.bankName && `Bank: ${doc.firm.bankName}`,
      doc.firm.accountName && `A/c name: ${doc.firm.accountName}`,
      doc.firm.accountNumber && `A/c no: ${doc.firm.accountNumber}`,
      doc.firm.ifsc && `IFSC: ${doc.firm.ifsc}`,
      doc.firm.upi && `UPI: ${doc.firm.upi}`,
    ]
      .filter(Boolean)
      .join('  ·  ')
    const bankWrapped = pdf.splitTextToSize(bankLine, CONTENT_W)
    pdf.text(bankWrapped, MARGIN, y)
    y += bankWrapped.length * 3.8 + 2
  }

  // Notes / terms
  if (doc.notes || doc.terms) {
    ensureSpace(24)
    y += 3
    drawRule()
    y += 6
    const colW = CONTENT_W / 2 - 4
    let notesBottom = y
    let termsBottom = y

    if (doc.notes) {
      pdf.setTextColor(...bronze)
      pdf.setFontSize(7.5)
      pdf.text('NOTES', MARGIN, y)
      pdf.setTextColor(...muted)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      const notes = pdf.splitTextToSize(doc.notes, colW)
      pdf.text(notes, MARGIN, y + 4)
      notesBottom = y + 4 + notes.length * 3.6
    }
    if (doc.terms) {
      pdf.setTextColor(...bronze)
      pdf.setFontSize(7.5)
      pdf.text('TERMS', MARGIN + colW + 8, y)
      pdf.setTextColor(...muted)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      const terms = pdf.splitTextToSize(doc.terms, colW)
      pdf.text(terms, MARGIN + colW + 8, y + 4)
      termsBottom = y + 4 + terms.length * 3.6
    }
    y = Math.max(notesBottom, termsBottom) + 4
  }

  // Footer
  ensureSpace(18)
  y = Math.max(y + 6, PAGE_H - MARGIN - 14)
  drawRule()
  y += 5
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7.5)
  pdf.setTextColor(...muted)
  pdf.text('This is a computer-generated document from KV Creations.', MARGIN, y)
  pdf.setTextColor(...ink)
  pdf.text('Authorised signatory', PAGE_W - MARGIN, y, { align: 'right' })

  const filename = fileNameFor(doc)
  const blob = pdf.output('blob')
  triggerDownload(blob, filename)
  return filename
}
