import type { RefObject } from 'react'
import { amountInWords, computeTotals, formatINRPlain, lineTaxable } from './gst'
import type { StudioDocument } from './types'

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

export default function DocumentPreview({
  doc,
  printRef,
}: {
  doc: StudioDocument
  printRef: RefObject<HTMLDivElement | null>
}) {
  const totals = computeTotals(doc.items, doc.taxMode)
  const title = doc.type === 'invoice' ? 'Tax Invoice' : 'Quotation'
  const showBank =
    doc.type === 'invoice' &&
    (doc.firm.bankName || doc.firm.accountNumber || doc.firm.upi)

  return (
    <div className="studio-preview-scale">
      <div ref={printRef} className="studio-sheet" id="studio-print-sheet">
        <header className="studio-sheet-header">
          <div className="studio-sheet-brand">
            <img src="/logo/logo-hero.png" alt="" className="studio-sheet-logo" />
            <div>
              <p className="studio-sheet-firm">{doc.firm.name || 'KV Creations'}</p>
              {doc.firm.address && (
                <p className="studio-sheet-meta whitespace-pre-line">{doc.firm.address}</p>
              )}
              <p className="studio-sheet-meta">
                {[doc.firm.phone, doc.firm.email].filter(Boolean).join(' · ')}
              </p>
              {doc.firm.gstin && (
                <p className="studio-sheet-meta">GSTIN: {doc.firm.gstin}</p>
              )}
            </div>
          </div>
          <div className="studio-sheet-docmeta">
            <p className="studio-sheet-kicker">KV Creations</p>
            <h1 className="studio-sheet-title">{title}</h1>
            <dl className="studio-sheet-dl">
              <div>
                <dt>No.</dt>
                <dd>{doc.number || '—'}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{formatDisplayDate(doc.date)}</dd>
              </div>
              {doc.type === 'quotation' ? (
                <div>
                  <dt>Valid until</dt>
                  <dd>{formatDisplayDate(doc.validUntil)}</dd>
                </div>
              ) : (
                <div>
                  <dt>Due date</dt>
                  <dd>{formatDisplayDate(doc.dueDate)}</dd>
                </div>
              )}
              {doc.placeOfSupply && (
                <div>
                  <dt>Place of supply</dt>
                  <dd>{doc.placeOfSupply}</dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        <section className="studio-sheet-parties">
          <div>
            <p className="studio-sheet-label">Bill to</p>
            <p className="studio-sheet-party-name">{doc.client.name || 'Client name'}</p>
            {doc.client.address && (
              <p className="studio-sheet-meta whitespace-pre-line">{doc.client.address}</p>
            )}
            <p className="studio-sheet-meta">
              {[doc.client.phone, doc.client.email].filter(Boolean).join(' · ')}
            </p>
            {doc.client.gstin && (
              <p className="studio-sheet-meta">GSTIN: {doc.client.gstin}</p>
            )}
            {(doc.client.state || doc.client.stateCode) && (
              <p className="studio-sheet-meta">
                State: {[doc.client.state, doc.client.stateCode].filter(Boolean).join(' / ')}
              </p>
            )}
          </div>
          <div>
            <p className="studio-sheet-label">From</p>
            <p className="studio-sheet-party-name">{doc.firm.name}</p>
            {(doc.firm.state || doc.firm.stateCode) && (
              <p className="studio-sheet-meta">
                State: {[doc.firm.state, doc.firm.stateCode].filter(Boolean).join(' / ')}
              </p>
            )}
            <p className="studio-sheet-meta">
              Tax: {doc.taxMode === 'igst' ? 'IGST' : 'CGST + SGST'}
            </p>
          </div>
        </section>

        <table className="studio-sheet-table">
          <thead>
            <tr>
              <th className="w-8">#</th>
              <th>Description</th>
              <th>HSN/SAC</th>
              <th className="num">Qty</th>
              <th>Unit</th>
              <th className="num">Rate</th>
              <th className="num">GST%</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.description || '—'}</td>
                <td>{item.hsnSac || '—'}</td>
                <td className="num">{item.quantity || 0}</td>
                <td>{item.unit || '—'}</td>
                <td className="num">{formatINRPlain(item.rate)}</td>
                <td className="num">{item.gstRate}%</td>
                <td className="num">{formatINRPlain(lineTaxable(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="studio-sheet-totals">
          <div className="studio-sheet-words">
            <p className="studio-sheet-label">Amount in words</p>
            <p>{amountInWords(totals.grand)}</p>
          </div>
          <dl className="studio-sheet-sum">
            <div>
              <dt>Taxable value</dt>
              <dd>₹ {formatINRPlain(totals.taxable)}</dd>
            </div>
            {doc.taxMode === 'igst' ? (
              <div>
                <dt>IGST</dt>
                <dd>₹ {formatINRPlain(totals.igst)}</dd>
              </div>
            ) : (
              <>
                <div>
                  <dt>CGST</dt>
                  <dd>₹ {formatINRPlain(totals.cgst)}</dd>
                </div>
                <div>
                  <dt>SGST</dt>
                  <dd>₹ {formatINRPlain(totals.sgst)}</dd>
                </div>
              </>
            )}
            <div className="grand">
              <dt>Grand total</dt>
              <dd>₹ {formatINRPlain(totals.grand)}</dd>
            </div>
          </dl>
        </section>

        {totals.byRate.length > 0 && (
          <table className="studio-sheet-taxbreak">
            <thead>
              <tr>
                <th>GST rate</th>
                <th className="num">Taxable</th>
                {doc.taxMode === 'igst' ? (
                  <th className="num">IGST</th>
                ) : (
                  <>
                    <th className="num">CGST</th>
                    <th className="num">SGST</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {totals.byRate.map((g) => (
                <tr key={g.rate}>
                  <td>{g.rate}%</td>
                  <td className="num">{formatINRPlain(g.taxable)}</td>
                  {doc.taxMode === 'igst' ? (
                    <td className="num">{formatINRPlain(g.igst)}</td>
                  ) : (
                    <>
                      <td className="num">{formatINRPlain(g.cgst)}</td>
                      <td className="num">{formatINRPlain(g.sgst)}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showBank && (
          <section className="studio-sheet-bank">
            <p className="studio-sheet-label">Payment details</p>
            <p className="studio-sheet-meta">
              {[
                doc.firm.bankName && `Bank: ${doc.firm.bankName}`,
                doc.firm.accountName && `A/c name: ${doc.firm.accountName}`,
                doc.firm.accountNumber && `A/c no: ${doc.firm.accountNumber}`,
                doc.firm.ifsc && `IFSC: ${doc.firm.ifsc}`,
                doc.firm.upi && `UPI: ${doc.firm.upi}`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </section>
        )}

        {(doc.notes || doc.terms) && (
          <section className="studio-sheet-notes">
            {doc.notes && (
              <div>
                <p className="studio-sheet-label">Notes</p>
                <p className="studio-sheet-meta whitespace-pre-line">{doc.notes}</p>
              </div>
            )}
            {doc.terms && (
              <div>
                <p className="studio-sheet-label">Terms</p>
                <p className="studio-sheet-meta whitespace-pre-line">{doc.terms}</p>
              </div>
            )}
          </section>
        )}

        <footer className="studio-sheet-footer">
          <p>This is a computer-generated document from KV Creations.</p>
          <p className="studio-sheet-sign">Authorised signatory</p>
        </footer>
      </div>
    </div>
  )
}
