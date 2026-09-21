import React, { useState } from 'react';
import { Search, Eye, Edit3, Trash2, MessageCircle, Calendar, Users, MapPin, Receipt } from 'lucide-react';
import { formatCurrency, formatDateForDisplay } from '../utils/formatters';
import { getWhatsAppShareUrl, generateInvoiceWhatsAppMessage } from '../utils/whatsapp';

export function InvoicesList({
  invoices = [],
  businessInfo,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onNewQuotation
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredInvoices = invoices.filter(inv => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (inv.customer?.name || '').toLowerCase().includes(term);
    const phoneMatch = (inv.customer?.mobile || '').includes(term);
    const numMatch = (inv.invoiceNumber || '').toLowerCase().includes(term);
    const refMatch = (inv.quotationNumber || '').toLowerCase().includes(term);
    const matchesTerm = nameMatch || phoneMatch || numMatch || refMatch;

    if (statusFilter === 'ALL') return matchesTerm;
    return matchesTerm && inv.paymentStatus === statusFilter;
  });

  const handleShareWhatsApp = (inv, e) => {
    e.stopPropagation();
    const msg = generateInvoiceWhatsAppMessage(inv, businessInfo);
    window.open(getWhatsAppShareUrl(inv.customer?.mobile, msg), '_blank');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#f5f5f5'
          }}>
            Invoices
          </h2>
          <div style={{ fontSize: '13px', color: '#888' }}>
            Manage invoices, advance receipts, and balance dues ({invoices.length} total)
          </div>
        </div>

        <button onClick={onNewQuotation} className="btn btn-primary">
          <Receipt size={16} />
          <span>NEW QUOTATION / INVOICE</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div style={{
        backgroundColor: '#1b1b1b',
        border: '1px solid #2d2d2d',
        borderRadius: '6px',
        padding: '12px 16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '160px' }}>
          <Search size={18} color="#777" />
          <input
            type="text"
            className="input"
            placeholder="Search by customer, invoice number (e.g. INV-0001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '4px', fontSize: '14px', boxShadow: 'none' }}
          />
        </div>

        {/* Status Filter buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'PARTIALLY PAID', 'PAID'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div style={{
          backgroundColor: '#181818',
          border: '1px dashed #303030',
          borderRadius: '6px',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#777'
        }}>
          {searchTerm || statusFilter !== 'ALL'
            ? 'No invoices match your search filters.'
            : 'No invoices created yet. You can convert any quotation into an invoice.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
          {filteredInvoices.map(inv => (
            <div
              key={inv.id}
              onClick={() => onViewInvoice(inv)}
              style={{
                backgroundColor: '#1b1b1b',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            >
              {/* Left Details */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                    color: '#d1d1d1',
                    backgroundColor: '#242424',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    border: '1px solid #333'
                  }}>
                    {inv.invoiceNumber}
                  </span>

                  {inv.quotationNumber && (
                    <span style={{ fontSize: '11px', color: '#888' }}>
                      (Ref: {inv.quotationNumber})
                    </span>
                  )}

                  <span style={{ fontSize: '12px', color: '#777' }}>
                    {formatDateForDisplay(inv.date)}
                  </span>

                  <span className={`badge ${
                    inv.paymentStatus === 'PAID' ? 'badge-paid' :
                    inv.paymentStatus === 'PARTIALLY PAID' ? 'badge-partial' : 'badge-pending'
                  }`}>
                    {inv.paymentStatus}
                  </span>
                </div>

                <div style={{ fontSize: '18px', fontWeight: 600, color: '#f5f5f5', marginBottom: '6px' }}>
                  {inv.customer?.name || 'Unnamed Customer'}
                </div>

                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#888', flexWrap: 'wrap' }}>
                  {inv.customer?.mobile && <span>📞 {inv.customer.mobile}</span>}
                  {inv.customer?.place && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {inv.customer.place}
                    </span>
                  )}
                  {inv.event?.totalPax && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> {inv.event.totalPax} PAX
                    </span>
                  )}
                  {inv.event?.eventDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {formatDateForDisplay(inv.event.eventDate)}
                    </span>
                  )}
                </div>
              </div>

              {/* Middle: Payment Math */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>Total</div>
                  <div style={{ fontWeight: 600, color: '#e0e0e0', fontSize: '14px' }}>{formatCurrency(inv.customTotalAmount)}</div>
                </div>

                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3fae68' }}>Advance</div>
                  <div style={{ fontWeight: 600, color: '#3fae68', fontSize: '14px' }}>{formatCurrency(inv.advancePaid)}</div>
                </div>

                <div style={{ borderLeft: '1px solid #333', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#cf4c4c', fontWeight: 700 }}>Balance</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 700, color: '#cf4c4c' }}>
                    {formatCurrency(inv.balanceDue)}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={(e) => handleShareWhatsApp(inv, e)}
                  className="btn btn-secondary btn-sm"
                  title="Share Invoice on WhatsApp"
                  style={{ color: '#25D366' }}
                >
                  <MessageCircle size={14} />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); onEditInvoice(inv); }}
                  className="btn btn-secondary btn-sm"
                  title="Edit Payment / Services"
                >
                  <Edit3 size={14} />
                </button>

                <button
                  onClick={() => onViewInvoice(inv)}
                  className="btn btn-outline btn-sm"
                  title="View A4 Preview"
                >
                  <Eye size={14} /> View
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteInvoice(inv); }}
                  className="btn btn-danger btn-sm"
                  title="Delete Invoice"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

