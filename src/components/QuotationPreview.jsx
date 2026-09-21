import React from 'react';
import { formatCurrency, formatDateForDisplay } from '../utils/formatters';
import { BrandLogo } from './BrandLogo';

export function QuotationPreview({
  quotation,
  businessInfo,
  isFullWidth = false,
  itemColumns = '2',
  density = 'compact'
}) {
  if (!quotation) return null;

  const {
    quotationNumber = 'QT-0001',
    date = '',
    customer = {},
    event = {},
    sections = [],
    customTotalAmount = 0,
    notes = ''
  } = quotation;

  return (
    <div className={`a4-document-container ${isFullWidth ? 'full-page-mode' : ''}`}>
      <div className={`a4-document full-a4-cover-model density-${density}`} id="quotation-print-area">
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
            <div className="doc-cover-meta-card">
              <div className="doc-cover-badge">QUOTATION</div>
              <div className="doc-cover-subtitle">Event Package Proposal</div>
              <div className="doc-cover-divider"></div>
              <div className="doc-cover-row">
                <span className="cover-lbl">Quote Ref:</span>
                <span className="cover-val quote-no">{quotationNumber}</span>
              </div>
              <div className="doc-cover-row">
                <span className="cover-lbl">Date:</span>
                <span className="cover-val">{formatDateForDisplay(date)}</span>
              </div>
              <div className="doc-cover-row">
                <span className="cover-lbl">Validity:</span>
                <span className="cover-val validity-pill">15 Days</span>
              </div>
            </div>
          </div>

          {/* Full-width Luxury Double Divider */}
          <div className="doc-letterhead-divider"></div>
        </header>

        {/* ============================================================
            2. STRUCTURED CLIENT & EVENT SPECIFICATION CARD (COMPACT)
           ============================================================ */}
        <div className="doc-particulars-grid">
          {/* Client Details Box */}
          <div className="doc-particulars-col">
            <div className="particulars-header">CLIENT INFORMATION</div>
            <div className="particulars-body">
              <div className="part-row">
                <span className="part-lbl">Client Name:</span>
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
            4. ESTIMATED COST SUMMARY CARD (LUMP-SUM QUOTATION)
           ============================================================ */}
        <div className="doc-estimate-box">
          <div className="estimate-desc-side">
            <div className="estimate-title-label">ESTIMATED COST</div>
            <div className="estimate-subtext">
              All-inclusive lump-sum estimate covering food preparations, ingredients, culinary presentation, and service arrangements for{' '}
              <strong>{event.totalPax ? `${event.totalPax} PAX` : 'the event'}</strong>.
            </div>
            <div className="estimate-validity-note">
              * Valid for 15 days from issue date. Final confirmation subject to booking advance.
            </div>
          </div>

          <div className="estimate-amount-side">
            <div className="estimate-currency-badge">TOTAL ESTIMATE</div>
            <div className="estimate-amount-value">
              {formatCurrency(customTotalAmount)}
            </div>
            <div className="estimate-tax-note">(Zero Hidden Charges)</div>
          </div>
        </div>

        {/* Special Notes Callout */}
        {notes && (
          <div className="doc-notes-callout">
            <div className="notes-header">SPECIAL ARRANGEMENTS & NOTES:</div>
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
              <div className="terms-card-title">STANDARD CATERING TERMS</div>
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
                <div className="sig-caption">Client Acceptance</div>
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
              Thank you for trusting <strong>{businessInfo?.name || 'SILVER CATERING'}</strong> — Making your celebrations memorable & flavorful.
            </div>
            <div className="imprint-small">
              {businessInfo?.website || 'www.silvercatering.in'} • Contact: {businessInfo?.phones?.[0] || '+91 98464 15767'} • Computer Generated Quotation
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
