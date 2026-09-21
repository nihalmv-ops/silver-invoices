import React from 'react';
import { formatCurrency, formatDateForDisplay } from '../utils/formatters';
import { BrandLogo } from './BrandLogo';

export function InvoicePreview({
  invoice,
  businessInfo,
  isFullWidth = false,
  itemColumns = '2',
  density = 'compact'
}) {
  if (!invoice) return null;

  const {
    invoiceNumber = 'INV-0001',
    quotationNumber = '',
    date = '',
    customer = {},
    event = {},
    sections = [],
    customTotalAmount = 0,
    advancePaid = 0,
    balanceDue = 0,
    paymentStatus = 'PENDING',
    notes = ''
  } = invoice;

  return (
    <div className={`a4-document-container ${isFullWidth ? 'full-page-mode' : ''}`}>
      <div className={`a4-document full-a4-cover-model density-${density}`} id="invoice-print-area">
        {/* ============================================================
            1. EXECUTIVE LETTERHEAD WITH LOGO ON LEFT SIDE
           ============================================================ */}
        <header className="doc-header">
          <div className="doc-letterhead-split">
            {/* Left Side: Logo & Business Details */}
            <div className="doc-brand-left-group">
              <div className="doc-logo-left">
                <BrandLogo logoSrc={businessInfo?.logo || '/logo.webp'} size="md" align="left" />
              </div>
              <div className="doc-brand-text-left">
                <div className="doc-brand-title">
                  {businessInfo?.name || 'SILVER CATERING'}
                </div>
                <div className="doc-brand-subtitle">
                  {businessInfo?.subtitle || 'CATERING & EVENTS'}
                </div>
                <div className="doc-brand-contact-inline">
                  <span>
                    <strong>Tel:</strong>{' '}
                    {businessInfo?.phones && businessInfo.phones.length > 0
                      ? businessInfo.phones.join('  |  ')
                      : '+91 98464 15767  |  +91 75939 82800'}
                  </span>
                </div>
                <div className="doc-brand-contact-inline">
                  <span><strong>Web:</strong> {businessInfo?.website || 'www.silvercatering.in'}</span>
                  <span className="ribbon-sep">•</span>
                  <span><strong>Email:</strong> {businessInfo?.email || 'Silvereventsandcaters@gmail.com'}</span>
                </div>
                <div className="doc-brand-address-inline">
                  {businessInfo?.address || 'Thalakuttiparambil house, Mecheriparambu, Irimbiliyam PO - 679572, Valanchery'}
                </div>
              </div>
            </div>

            {/* Right Side: Document Identification Cover Card */}
            <div className="doc-cover-meta-card invoice-meta-card">
              <div className="doc-cover-badge">TAX INVOICE</div>
              <div className="doc-cover-subtitle">Bill of Supply</div>
              <div className="doc-cover-divider"></div>
              <div className="doc-cover-row">
                <span className="cover-lbl">Invoice No:</span>
                <span className="cover-val quote-no">{invoiceNumber}</span>
              </div>
              {quotationNumber && (
                <div className="doc-cover-row">
                  <span className="cover-lbl">Ref Quote:</span>
                  <span className="cover-val">{quotationNumber}</span>
                </div>
              )}
              <div className="doc-cover-row">
                <span className="cover-lbl">Date:</span>
                <span className="cover-val">{formatDateForDisplay(date)}</span>
              </div>
              <div className="doc-cover-row" style={{ marginTop: '4px' }}>
                <span className={`invoice-status-pill status-${paymentStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Full-width Luxury Double Divider */}
          <div className="doc-letterhead-divider"></div>
        </header>

        {/* ============================================================
            2. STRUCTURED BILLED-TO & EVENT SPECIFICATION CARD (COMPACT)
           ============================================================ */}
        <div className="doc-particulars-grid">
          {/* Billed To Box */}
          <div className="doc-particulars-col">
            <div className="particulars-header">BILLED TO (CUSTOMER)</div>
            <div className="particulars-body">
              <div className="part-row">
                <span className="part-lbl">Customer Name:</span>
                <span className="part-val bold client-name">{customer.name || '—'}</span>
              </div>
              <div className="part-row">
                <span className="part-lbl">Contact No:</span>
                <span className="part-val">{customer.mobile || '—'}</span>
              </div>
              <div className="part-row">
                <span className="part-lbl">Venue / Place:</span>
                <span className="part-val">{customer.place || '—'}</span>
              </div>
              {customer.email && (
                <div className="part-row">
                  <span className="part-lbl">Email:</span>
                  <span className="part-val">{customer.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Event Details Box */}
          <div className="doc-particulars-col">
            <div className="particulars-header">EVENT SPECIFICATIONS</div>
            <div className="particulars-body">
              <div className="part-row">
                <span className="part-lbl">Occasion:</span>
                <span className="part-val bold">{event.eventName || 'Catering Function'}</span>
              </div>
              <div className="part-row">
                <span className="part-lbl">Event Date:</span>
                <span className="part-val bold" style={{ color: '#153120' }}>
                  {formatDateForDisplay(event.eventDate) || '—'}
                </span>
              </div>
              <div className="part-row">
                <span className="part-lbl">Timing / Slot:</span>
                <span className="part-val">{event.time || '—'}</span>
              </div>
              <div className="part-row pax-highlight-row">
                <span className="part-lbl">Guest Count:</span>
                <span className="part-val pax-badge">
                  {event.totalPax ? `${event.totalPax} GUESTS (PAX)` : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            3. HIGH-CAPACITY MENU & SERVICE INCLUSIONS SCHEDULE
               Supports 2-Column Grid (default) and 1-Column Table
           ============================================================ */}
        <div className="doc-schedule-wrapper">
          {sections.map((section, secIdx) => {
            const validItems = (section.items || []).filter(item => item && item.name && item.name.trim() !== '');
            if (validItems.length === 0 && !section.title) return null;

            const sectionNum = String(secIdx + 1).padStart(2, '0');

            return (
              <div key={section.id || secIdx} className="doc-schedule-section">
                {/* Section Header Bar */}
                <div className="schedule-section-bar">
                  <div className="schedule-section-left">
                    <span className="section-index-pill">{sectionNum}</span>
                    <span className="schedule-section-title">{section.title}</span>
                  </div>
                  {section.subtitle && (
                    <span className="schedule-section-subtitle">{section.subtitle}</span>
                  )}
                </div>

                {/* Multi-item 2-Column Grid or Classic 1-Column Table */}
                {itemColumns === '2' ? (
                  <div className="schedule-items-grid">
                    {validItems.map((item, itemIdx) => {
                      const itemNum = String(itemIdx + 1).padStart(2, '0');
                      const hasQty = item.quantity && String(item.quantity).trim() !== '';

                      return (
                        <div key={item.id || itemIdx} className="schedule-grid-item">
                          <div className="grid-item-main">
                            <span className="grid-item-idx">{itemNum}.</span>
                            <span className="grid-item-name" title={item.name}>
                              {item.name.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid-item-meta">
                            {hasQty ? (
                              <span className="qty-tag">
                                <strong>{item.quantity}</strong> {item.unit || ''}
                              </span>
                            ) : (
                              <span className="qty-included">INCLUDED</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <table className="schedule-items-table">
                    <thead>
                      <tr>
                        <th className="th-idx">#</th>
                        <th className="th-item">MENU / SERVICE INCLUSION</th>
                        <th className="th-qty">QUANTITY & UNIT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validItems.map((item, itemIdx) => {
                        const itemNum = String(itemIdx + 1).padStart(2, '0');
                        const hasQty = item.quantity && String(item.quantity).trim() !== '';

                        return (
                          <tr key={item.id || itemIdx} className="schedule-item-row">
                            <td className="td-idx">{itemNum}</td>
                            <td className="td-item">
                              <span className="item-name-text">{item.name.toUpperCase()}</span>
                            </td>
                            <td className="td-qty">
                              {hasQty ? (
                                <span className="qty-tag">
                                  <strong>{item.quantity}</strong> {item.unit || ''}
                                </span>
                              ) : (
                                <span className="qty-included">INCLUDED</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>

        {/* ============================================================
            4. PAYMENT FINANCIAL RECONCILIATION CARD (INVOICE)
           ============================================================ */}
        <div className="doc-financial-reconciliation">
          <div className="fin-card">
            <div className="fin-card-label">TOTAL PACKAGE AMOUNT</div>
            <div className="fin-card-amount">{formatCurrency(customTotalAmount)}</div>
            <div className="fin-card-sub">Agreed Catering Package</div>
          </div>

          <div className="fin-card advance-card">
            <div className="fin-card-label">ADVANCE RECEIVED</div>
            <div className="fin-card-amount advance-val">{formatCurrency(advancePaid)}</div>
            <div className="fin-card-sub">Booking / Part Payment</div>
          </div>

          <div className="fin-card balance-card">
            <div className="fin-card-label">NET BALANCE DUE</div>
            <div className="fin-card-amount balance-val">{formatCurrency(balanceDue)}</div>
            <div className="fin-card-sub highlight">Payable On/Before Event</div>
          </div>
        </div>

        {/* Special Notes Callout */}
        {notes && (
          <div className="doc-notes-callout">
            <div className="notes-header">SPECIAL INVOICE NOTES / INSTRUCTIONS:</div>
            <div className="notes-content">{notes}</div>
          </div>
        )}

        {/* ============================================================
            5. STANDARD TERMS & CONDITIONS + DUAL SIGN-OFF
           ============================================================ */}
        <footer className="doc-footer-container">
          <div className="doc-terms-signatures-row">
            {/* Terms of Service */}
            <div className="doc-terms-card">
              <div className="terms-card-title">TERMS & SETTLEMENT CONDITIONS</div>
              <ol className="terms-card-list">
                {(businessInfo?.terms || []).slice(0, 4).map((term, tIdx) => (
                  <li key={tIdx}>{term}</li>
                ))}
              </ol>
            </div>

            {/* Dual Signature Block */}
            <div className="doc-signatures-card">
              <div className="sig-column">
                <div className="sig-space"></div>
                <div className="sig-line"></div>
                <div className="sig-caption">Customer Confirmation</div>
                <div className="sig-subcaption">Sign & Date</div>
              </div>

              <div className="sig-column">
                <div className="sig-space"></div>
                <div className="sig-line"></div>
                <div className="sig-caption">For SILVER CATERING</div>
                <div className="sig-subcaption">Authorized Signatory</div>
              </div>
            </div>
          </div>

          {/* Official Bottom Imprint */}
          <div className="doc-bottom-imprint">
            <div>
              Thank you for partnering with <strong>{businessInfo?.name || 'SILVER CATERING'}</strong> — We cherish being a part of your celebrations.
            </div>
            <div className="imprint-small">
              {businessInfo?.website || 'www.silvercatering.in'} • Contact: {businessInfo?.phones?.[0] || '+91 98464 15767'} • Computer Generated Tax Invoice
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
