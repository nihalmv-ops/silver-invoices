import React from 'react';
import { PlusCircle, FileText, Receipt, ArrowRight, Eye, Edit3, MessageCircle, Calendar, Users, MapPin } from 'lucide-react';
import { formatCurrency, formatDateForDisplay } from '../utils/formatters';
import { getWhatsAppShareUrl, generateQuotationWhatsAppMessage, generateInvoiceWhatsAppMessage } from '../utils/whatsapp';
import { BrandLogo } from '../components/BrandLogo';

export function Home({
  setActivePage,
  quotations = [],
  invoices = [],
  businessInfo,
  onViewQuotation,
  onEditQuotation,
  onViewInvoice,
  onEditInvoice,
  onLoadSample
}) {
  const recentQuotations = quotations.slice(0, 3);
  const recentInvoices = invoices.slice(0, 3);

  const handleShareQuote = (quote, e) => {
    e.stopPropagation();
    const msg = generateQuotationWhatsAppMessage(quote, businessInfo);
    window.open(getWhatsAppShareUrl(quote.customer?.mobile, msg), '_blank');
  };

  const handleShareInvoice = (inv, e) => {
    e.stopPropagation();
    const msg = generateInvoiceWhatsAppMessage(inv, businessInfo);
    window.open(getWhatsAppShareUrl(inv.customer?.mobile, msg), '_blank');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <BrandLogo logoSrc={businessInfo?.logo} size="md" />
        </div>
        <div style={{
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: 'var(--brand-gold, #9d8050)',
          marginBottom: '8px'
        }}>
          {businessInfo.subtitle || 'CATERING & EVENTS'}
        </div>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: '38px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: '#f5f5f5',
          marginBottom: '10px'
        }}>
          {businessInfo.name || 'SILVER CATERING'}
        </h1>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 500,
          color: '#e0e0e0',
          marginBottom: '8px'
        }}>
          Catering Documents
        </h2>
        <p style={{
          color: '#888888',
          fontSize: '14px',
          maxWidth: '480px',
          margin: '0 auto 28px auto'
        }}>
          Create professional quotations and invoices for your catering events.
        </p>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivePage('new-quotation')}
            className="btn btn-primary btn-lg"
            style={{ minWidth: '190px' }}
          >
            <PlusCircle size={18} />
            <span>+ NEW QUOTATION</span>
          </button>
          <button
            onClick={() => setActivePage('quotations')}
            className="btn btn-secondary btn-lg"
          >
            <FileText size={18} />
            <span>QUOTATIONS</span>
          </button>
          <button
            onClick={() => setActivePage('invoices')}
            className="btn btn-secondary btn-lg"
          >
            <Receipt size={18} />
            <span>INVOICES</span>
          </button>
        </div>
      </div>

      {/* Simple Document Counts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div
          onClick={() => setActivePage('quotations')}
          style={{
            backgroundColor: '#1b1b1b',
            border: '1px solid #2d2d2d',
            borderRadius: '6px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#b59a62'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#2d2d2d'}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Quotations
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 700, color: '#f5f5f5' }}>
              {quotations.length}
            </div>
            <div style={{ fontSize: '12px', color: '#b59a62', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all quotations <ArrowRight size={12} />
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '4px',
            backgroundColor: '#242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b59a62'
          }}>
            <FileText size={24} />
          </div>
        </div>

        <div
          onClick={() => setActivePage('invoices')}
          style={{
            backgroundColor: '#1b1b1b',
            border: '1px solid #2d2d2d',
            borderRadius: '6px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#b59a62'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#2d2d2d'}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Invoices
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 700, color: '#f5f5f5' }}>
              {invoices.length}
            </div>
            <div style={{ fontSize: '12px', color: '#b59a62', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all invoices <ArrowRight size={12} />
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '4px',
            backgroundColor: '#242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b59a62'
          }}>
            <Receipt size={24} />
          </div>
        </div>
      </div>

      {/* Recent Quotations Section */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#d1d1d1' }}>
            Recent Quotations
          </h3>
          {quotations.length > 0 && (
            <button onClick={() => setActivePage('quotations')} className="btn btn-outline btn-sm">
              View All ({quotations.length})
            </button>
          )}
        </div>

        {recentQuotations.length === 0 ? (
          <div style={{
            backgroundColor: '#191919',
            border: '1px dashed #303030',
            borderRadius: '6px',
            padding: '30px',
            textAlign: 'center',
            color: '#777'
          }}>
            No quotations created yet.
            <div style={{ marginTop: '12px' }}>
              <button onClick={() => setActivePage('new-quotation')} className="btn btn-primary btn-sm">
                <PlusCircle size={14} /> Create First Quotation
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {recentQuotations.map(quote => (
              <div
                key={quote.id}
                onClick={() => onViewQuotation(quote)}
                style={{
                  backgroundColor: '#1c1c1c',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3d3d3d'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#b59a62', fontSize: '13px', letterSpacing: '0.06em' }}>
                    {quote.quotationNumber}
                  </span>
                  <span style={{ fontSize: '12px', color: '#777' }}>
                    {formatDateForDisplay(quote.date)}
                  </span>
                </div>

                <div style={{ fontSize: '16px', fontWeight: 600, color: '#f5f5f5', marginBottom: '6px' }}>
                  {quote.customer?.name || 'Unnamed Customer'}
                </div>

                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#999', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {quote.customer?.place && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#777" /> {quote.customer.place}
                    </span>
                  )}
                  {quote.event?.totalPax && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} color="#777" /> {quote.event.totalPax} PAX
                    </span>
                  )}
                  {quote.event?.eventDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} color="#777" /> {formatDateForDisplay(quote.event.eventDate)}
                    </span>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '10px',
                  borderTop: '1px solid #262626'
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                      Estimated Cost
                    </span>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: 700, color: '#f5f5f5' }}>
                      {formatCurrency(quote.customTotalAmount)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditQuotation(quote); }}
                      className="btn btn-secondary btn-sm"
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleShareQuote(quote, e)}
                      className="btn btn-secondary btn-sm"
                      title="Share to WhatsApp"
                      style={{ color: '#25D366' }}
                    >
                      <MessageCircle size={13} />
                    </button>
                    <button
                      onClick={() => onViewQuotation(quote)}
                      className="btn btn-outline btn-sm"
                      title="Preview Document"
                    >
                      <Eye size={13} /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Invoices Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#d1d1d1' }}>
            Recent Invoices
          </h3>
          {invoices.length > 0 && (
            <button onClick={() => setActivePage('invoices')} className="btn btn-outline btn-sm">
              View All ({invoices.length})
            </button>
          )}
        </div>

        {recentInvoices.length === 0 ? (
          <div style={{
            backgroundColor: '#191919',
            border: '1px dashed #303030',
            borderRadius: '6px',
            padding: '24px',
            textAlign: 'center',
            color: '#777',
            fontSize: '13px'
          }}>
            No invoices converted yet. You can convert any quotation to an invoice with one click.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {recentInvoices.map(inv => (
              <div
                key={inv.id}
                onClick={() => onViewInvoice(inv)}
                style={{
                  backgroundColor: '#1c1c1c',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3d3d3d'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#d1d1d1', fontSize: '13px', letterSpacing: '0.06em' }}>
                    {inv.invoiceNumber}
                  </span>
                  <span className={`badge ${
                    inv.paymentStatus === 'PAID' ? 'badge-paid' :
                    inv.paymentStatus === 'PARTIALLY PAID' ? 'badge-partial' : 'badge-pending'
                  }`}>
                    {inv.paymentStatus}
                  </span>
                </div>

                <div style={{ fontSize: '16px', fontWeight: 600, color: '#f5f5f5', marginBottom: '6px' }}>
                  {inv.customer?.name || 'Unnamed Customer'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999', marginBottom: '14px' }}>
                  <span>Total: <strong style={{ color: '#eee' }}>{formatCurrency(inv.customTotalAmount)}</strong></span>
                  <span>Balance Due: <strong style={{ color: '#cf4c4c' }}>{formatCurrency(inv.balanceDue)}</strong></span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '6px',
                  paddingTop: '10px',
                  borderTop: '1px solid #262626'
                }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditInvoice(inv); }}
                    className="btn btn-secondary btn-sm"
                    title="Edit Invoice"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={(e) => handleShareInvoice(inv, e)}
                    className="btn btn-secondary btn-sm"
                    title="Share to WhatsApp"
                    style={{ color: '#25D366' }}
                  >
                    <MessageCircle size={13} />
                  </button>
                  <button
                    onClick={() => onViewInvoice(inv)}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye size={13} /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick sample quotation load helper */}
      <div style={{
        marginTop: '24px',
        padding: '14px 20px',
        backgroundColor: '#181818',
        border: '1px solid #282828',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '13px', color: '#aaa' }}>
          Looking for the reference quotation? You can reload the <strong>Sulaiman (1200 PAX Wedding)</strong> sample anytime.
        </div>
        <button
          onClick={onLoadSample}
          className="btn btn-outline btn-sm"
        >
          Load Reference Sample
        </button>
      </div>
    </div>
  );
}

