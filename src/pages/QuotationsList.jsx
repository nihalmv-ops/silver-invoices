import React, { useState } from 'react';
import { PlusCircle, Search, Eye, Edit3, Trash2, Receipt, MessageCircle, Calendar, Users, MapPin } from 'lucide-react';
import { formatCurrency, formatDateForDisplay } from '../utils/formatters';
import { getWhatsAppShareUrl, generateQuotationWhatsAppMessage } from '../utils/whatsapp';

export function QuotationsList({
  quotations = [],
  businessInfo,
  onNewQuotation,
  onViewQuotation,
  onEditQuotation,
  onConvertToInvoice,
  onDeleteQuotation
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotations = quotations.filter(q => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (q.customer?.name || '').toLowerCase().includes(term);
    const phoneMatch = (q.customer?.mobile || '').includes(term);
    const placeMatch = (q.customer?.place || '').toLowerCase().includes(term);
    const numMatch = (q.quotationNumber || '').toLowerCase().includes(term);
    const eventMatch = (q.event?.eventName || '').toLowerCase().includes(term);
    return nameMatch || phoneMatch || placeMatch || numMatch || eventMatch;
  });

  const handleShareWhatsApp = (q, e) => {
    e.stopPropagation();
    const msg = generateQuotationWhatsAppMessage(q, businessInfo);
    window.open(getWhatsAppShareUrl(q.customer?.mobile, msg), '_blank');
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
            Quotations
          </h2>
          <div style={{ fontSize: '13px', color: '#888' }}>
            Manage and export your catering event quotations ({quotations.length} total)
          </div>
        </div>

        <button onClick={onNewQuotation} className="btn btn-primary">
          <PlusCircle size={16} />
          <span>+ NEW QUOTATION</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div style={{
        backgroundColor: '#1b1b1b',
        border: '1px solid #2d2d2d',
        borderRadius: '6px',
        padding: '12px 16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Search size={18} color="#777" />
        <input
          type="text"
          className="input"
          placeholder="Search by customer name, mobile, place, or quote number (e.g. QT-0001)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', padding: '4px', fontSize: '14px', boxShadow: 'none' }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Quotations List / Cards */}
      {filteredQuotations.length === 0 ? (
        <div style={{
          backgroundColor: '#181818',
          border: '1px dashed #303030',
          borderRadius: '6px',
          padding: '48px 20px',
          textAlign: 'center',
          color: '#777'
        }}>
          {searchTerm ? 'No quotations match your search query.' : 'No quotations found.'}
          <div style={{ marginTop: '16px' }}>
            <button onClick={onNewQuotation} className="btn btn-primary btn-sm">
              <PlusCircle size={14} /> Create New Quotation
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
          {filteredQuotations.map(quote => (
            <div
              key={quote.id}
              onClick={() => onViewQuotation(quote)}
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
              {/* Left Column: Number, Customer, Meta */}
              <div style={{ minWidth: '260px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                    color: '#b59a62',
                    backgroundColor: '#242424',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    border: '1px solid #333'
                  }}>
                    {quote.quotationNumber}
                  </span>
                  <span style={{ fontSize: '12px', color: '#777' }}>
                    {formatDateForDisplay(quote.date)}
                  </span>
                  {quote.event?.eventName && (
                    <span style={{ fontSize: '11px', color: '#aaa', backgroundColor: '#222', padding: '1px 6px', borderRadius: '3px' }}>
                      {quote.event.eventName}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '18px', fontWeight: 600, color: '#f5f5f5', marginBottom: '6px' }}>
                  {quote.customer?.name || 'Unnamed Customer'}
                </div>

                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#888', flexWrap: 'wrap' }}>
                  {quote.customer?.mobile && (
                    <span>📞 {quote.customer.mobile}</span>
                  )}
                  {quote.customer?.place && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {quote.customer.place}
                    </span>
                  )}
                  {quote.event?.totalPax && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> {quote.event.totalPax} PAX
                    </span>
                  )}
                  {quote.event?.eventDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {formatDateForDisplay(quote.event.eventDate)}
                    </span>
                  )}
                  {quote.sections && (
                    <span style={{ color: '#aaa' }}>
                      {quote.sections.length} sections
                    </span>
                  )}
                </div>
              </div>

              {/* Middle: Estimated Cost */}
              <div style={{ textAlign: 'right', minWidth: '140px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#777' }}>
                  Estimated Cost
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontWeight: 700, color: '#f5f5f5' }}>
                  {formatCurrency(quote.customTotalAmount)}
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onConvertToInvoice(quote); }}
                  className="btn btn-secondary btn-sm"
                  title="Convert to Invoice"
                  style={{ color: '#b59a62', borderColor: '#3d3d3d' }}
                >
                  <Receipt size={14} />
                  <span>Invoice</span>
                </button>

                <button
                  onClick={(e) => handleShareWhatsApp(quote, e)}
                  className="btn btn-secondary btn-sm"
                  title="Share to WhatsApp"
                  style={{ color: '#25D366' }}
                >
                  <MessageCircle size={14} />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); onEditQuotation(quote); }}
                  className="btn btn-secondary btn-sm"
                  title="Edit Quotation"
                >
                  <Edit3 size={14} />
                </button>

                <button
                  onClick={() => onViewQuotation(quote)}
                  className="btn btn-outline btn-sm"
                  title="View A4 Preview"
                >
                  <Eye size={14} /> View
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteQuotation(quote); }}
                  className="btn btn-danger btn-sm"
                  title="Delete Quotation"
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

