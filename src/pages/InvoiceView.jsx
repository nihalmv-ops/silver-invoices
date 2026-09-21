import React, { useState } from 'react';
import { ArrowLeft, Printer, MessageCircle, Edit3, Share2, Maximize2, LayoutGrid } from 'lucide-react';
import { InvoicePreview } from '../components/InvoicePreview';
import { generateInvoiceWhatsAppMessage, getWhatsAppShareUrl } from '../utils/whatsapp';

export function InvoiceView({
  invoice,
  businessInfo,
  onBack,
  onEdit,
  onNotify
}) {
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [itemColumns, setItemColumns] = useState(() => {
    return localStorage.getItem('silver_item_columns') || '2';
  });
  const [density, setDensity] = useState(() => {
    return localStorage.getItem('silver_doc_density') || 'compact';
  });

  const handleToggleColumns = () => {
    const next = itemColumns === '2' ? '1' : '2';
    setItemColumns(next);
    localStorage.setItem('silver_item_columns', next);
    if (onNotify) onNotify(`Switched to ${next === '2' ? '2 Columns (Fits More Items)' : '1 Column Table'}`, 'info');
  };

  const handleToggleDensity = () => {
    const next = density === 'compact' ? 'standard' : 'compact';
    setDensity(next);
    localStorage.setItem('silver_doc_density', next);
    if (onNotify) onNotify(`Switched to ${next === 'compact' ? 'Compact Density (Max Items)' : 'Standard Spacing'}`, 'info');
  };

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = generateInvoiceWhatsAppMessage(invoice, businessInfo);
    const url = getWhatsAppShareUrl(invoice.customer?.mobile, msg);
    window.open(url, '_blank');
    if (onNotify) onNotify('WhatsApp invoice opened in new tab', 'success');
  };

  const handleCopyText = () => {
    const msg = generateInvoiceWhatsAppMessage(invoice, businessInfo);
    navigator.clipboard.writeText(msg).then(() => {
      if (onNotify) onNotify('Invoice details copied to clipboard!', 'success');
    });
  };

  return (
    <div>
      {/* Top Action Bar (Hidden on print) */}
      <div className="doc-action-bar no-print" style={{
        backgroundColor: '#1b1b1b',
        borderBottom: '1px solid #2d2d2d',
        padding: '12px 24px',
        position: 'sticky',
        top: '68px',
        zIndex: 90
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button onClick={onBack} className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> Back to Invoices
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleCopyText} className="btn btn-secondary btn-sm" title="Copy text summary">
              <Share2 size={15} />
              <span>Copy Text</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="btn btn-secondary btn-sm"
              style={{ color: '#25D366', borderColor: '#3a3a3a' }}
              title="Share invoice on WhatsApp"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </button>

            <button onClick={() => onEdit(invoice)} className="btn btn-secondary btn-sm">
              <Edit3 size={15} />
              <span>Edit Payment / Items</span>
            </button>

            <button
              onClick={handleToggleColumns}
              className="btn btn-secondary btn-sm"
              title="Toggle between 2 columns (fits more items) and 1 column table"
              style={{ color: itemColumns === '2' ? '#9d8050' : '#ddd', borderColor: itemColumns === '2' ? '#9d8050' : '#3d3d3d' }}
            >
              <LayoutGrid size={15} />
              <span>{itemColumns === '2' ? '2 Columns (Fit More)' : '1 Column (Table)'}</span>
            </button>

            <button
              onClick={handleToggleDensity}
              className="btn btn-secondary btn-sm"
              title="Toggle between Compact density (maximum items) and Standard spacing"
            >
              <span>{density === 'compact' ? 'Compact Density' : 'Standard Spacing'}</span>
            </button>

            <button
              onClick={() => setIsFullWidth(!isFullWidth)}
              className="btn btn-secondary btn-sm"
              title="Toggle Full Page / Standard A4 view"
            >
              <Maximize2 size={15} />
              <span>{isFullWidth ? 'Standard A4' : 'Full Page'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ padding: '6px 16px' }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pure A4 Document */}
      <InvoicePreview
        invoice={invoice}
        businessInfo={businessInfo}
        isFullWidth={isFullWidth}
        itemColumns={itemColumns}
        density={density}
      />
    </div>
  );
}

