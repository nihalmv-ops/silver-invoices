import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, Receipt } from 'lucide-react';
import { SectionEditor } from '../components/SectionEditor';
import { PRESET_SECTIONS } from '../constants/defaultData';
import { formatCurrency, getTodayFormatted } from '../utils/formatters';
import { generateId } from '../utils/id';

export function InvoiceEditor({
  invoice,
  _businessInfo,
  onSave,
  onCancel,
  onPreviewImmediate
}) {
  const [formData, setFormData] = useState(() => {
    const total = invoice.customTotalAmount || 0;
    const advance = invoice.advancePaid || 0;
    const balance = Math.max(0, total - advance);
    let status = 'PENDING';
    if (advance >= total && total > 0) {
      status = 'PAID';
    } else if (advance > 0) {
      status = 'PARTIALLY PAID';
    }

    return {
      ...invoice,
      advancePaid: advance,
      balanceDue: balance,
      paymentStatus: invoice.paymentStatus || status,
      date: invoice.date || getTodayFormatted()
    };
  });

  const [customSectionInput, setCustomSectionInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Math recalculation
  const updatePaymentMath = (total, advance) => {
    const validTotal = Math.max(0, total);
    const validAdvance = Math.min(validTotal, Math.max(0, advance));
    const balance = validTotal - validAdvance;

    let status = 'PENDING';
    if (validAdvance >= validTotal && validTotal > 0) {
      status = 'PAID';
    } else if (validAdvance > 0) {
      status = 'PARTIALLY PAID';
    }

    return {
      customTotalAmount: validTotal,
      advancePaid: validAdvance,
      balanceDue: balance,
      paymentStatus: status
    };
  };

  const handleAdvanceChange = (e) => {
    const rawVal = e.target.value.replace(/[^\d]/g, '');
    const advance = rawVal ? parseInt(rawVal, 10) : 0;
    const math = updatePaymentMath(formData.customTotalAmount, advance);
    setFormData(prev => ({ ...prev, ...math }));
  };

  const handleTotalChange = (e) => {
    const rawVal = e.target.value.replace(/[^\d]/g, '');
    const total = rawVal ? parseInt(rawVal, 10) : 0;
    const math = updatePaymentMath(total, formData.advancePaid);
    setFormData(prev => ({ ...prev, ...math }));
  };

  // Section handling
  const handleAddPresetSection = (sectionName) => {
    const newSection = {
      id: generateId('sec'),
      title: sectionName,
      subtitle: '',
      items: [
        { id: generateId('item'), name: '', quantity: '', unit: 'KG' }
      ]
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const handleAddCustomSection = () => {
    if (!customSectionInput.trim()) return;
    const newSection = {
      id: generateId('sec'),
      title: customSectionInput.trim().toUpperCase(),
      subtitle: '',
      items: [
        { id: generateId('item'), name: '', quantity: '', unit: 'NOS' }
      ]
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setCustomSectionInput('');
    setIsAddingCustom(false);
  };

  const handleUpdateSection = (index, updatedSection) => {
    const newSections = [...formData.sections];
    newSections[index] = updatedSection;
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleDeleteSection = (index) => {
    const newSections = formData.sections.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleMoveSection = (index, direction) => {
    const newSections = [...formData.sections];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 20px' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onCancel} className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f5f5f5' }}>
              Edit Invoice ({formData.invoiceNumber})
            </h2>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {formData.quotationNumber ? `Created from Quote: ${formData.quotationNumber}` : 'Direct catering invoice'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onPreviewImmediate(formData)}
            className="btn btn-secondary"
          >
            <Eye size={15} /> Preview
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ padding: '8px 20px' }}
          >
            <Save size={16} /> Save Invoice
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Invoice Payment Card (High Priority) */}
        <div style={{
          backgroundColor: '#1c1c1c',
          border: '2px solid #b59a62',
          borderRadius: '6px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#b59a62',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Receipt size={16} />
              <span>INVOICE PAYMENT & ADVANCE TRACKING</span>
            </div>

            {/* Payment Status Badge */}
            <span className={`badge ${
              formData.paymentStatus === 'PAID' ? 'badge-paid' :
              formData.paymentStatus === 'PARTIALLY PAID' ? 'badge-partial' : 'badge-pending'
            }`} style={{ fontSize: '12px', padding: '4px 10px' }}>
              {formData.paymentStatus}
            </span>
          </div>

          <div className="form-grid-4" style={{ marginBottom: '20px' }}>
            {/* Total Amount */}
            <div>
              <label className="label">Custom Total Amount (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888', fontWeight: 600 }}>₹</span>
                <input
                  type="text"
                  className="input"
                  value={formData.customTotalAmount || ''}
                  onChange={handleTotalChange}
                  placeholder="250000"
                  style={{ paddingLeft: '28px', fontSize: '16px', fontWeight: 700 }}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                Formatted: {formatCurrency(formData.customTotalAmount)}
              </div>
            </div>

            {/* Advance Paid */}
            <div>
              <label className="label" style={{ color: '#3fae68' }}>Advance Paid (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#3fae68', fontWeight: 600 }}>₹</span>
                <input
                  type="text"
                  className="input"
                  value={formData.advancePaid || ''}
                  onChange={handleAdvanceChange}
                  placeholder="e.g. 50000"
                  style={{ paddingLeft: '28px', fontSize: '16px', fontWeight: 700, borderColor: '#3fae68' }}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                Advance cannot exceed total
              </div>
            </div>

            {/* Balance Due (Calculated) */}
            <div style={{
              backgroundColor: '#242424',
              padding: '12px 18px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cf4c4c', fontWeight: 700 }}>
                Balance Due
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '26px', fontWeight: 700, color: '#cf4c4c' }}>
                {formatCurrency(formData.balanceDue)}
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                Formula: Total - Advance
              </div>
            </div>
          </div>

          {/* Quick settlement buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Set:
            </span>
            <button
              type="button"
              onClick={() => {
                const math = updatePaymentMath(formData.customTotalAmount, 0);
                setFormData(prev => ({ ...prev, ...math }));
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px' }}
            >
              No Advance (Pending)
            </button>
            <button
              type="button"
              onClick={() => {
                const half = Math.round(formData.customTotalAmount * 0.5);
                const math = updatePaymentMath(formData.customTotalAmount, half);
                setFormData(prev => ({ ...prev, ...math }));
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px' }}
            >
              50% Advance
            </button>
            <button
              type="button"
              onClick={() => {
                const math = updatePaymentMath(formData.customTotalAmount, formData.customTotalAmount);
                setFormData(prev => ({ ...prev, ...math }));
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', color: '#3fae68' }}
            >
              Mark Full Paid
            </button>
          </div>
        </div>

        {/* Invoice Details & Customer */}
        <div style={{
          backgroundColor: '#1c1c1c',
          border: '1px solid #2d2d2d',
          borderRadius: '6px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: '14px' }}>
            CUSTOMER & INVOICE METADATA
          </div>

          <div className="form-grid-4" style={{ marginBottom: '14px' }}>
            <div>
              <label className="label">Invoice Number</label>
              <input
                type="text"
                className="input"
                value={formData.invoiceNumber || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                style={{ fontWeight: 700, color: '#b59a62' }}
              />
            </div>
            <div>
              <label className="label">Invoice Date</label>
              <input
                type="text"
                className="input"
                value={formData.date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Customer Name</label>
              <input
                type="text"
                className="input"
                value={formData.customer?.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customer: { ...prev.customer, name: e.target.value } }))}
                required
              />
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <input
                type="text"
                className="input"
                value={formData.customer?.mobile || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customer: { ...prev.customer, mobile: e.target.value } }))}
              />
            </div>
          </div>

          <div className="form-grid-4">
            <div>
              <label className="label">Place</label>
              <input
                type="text"
                className="input"
                value={formData.customer?.place || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, customer: { ...prev.customer, place: e.target.value } }))}
              />
            </div>
            <div>
              <label className="label">Event Date</label>
              <input
                type="text"
                className="input"
                value={formData.event?.eventDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, event: { ...prev.event, eventDate: e.target.value } }))}
              />
            </div>
            <div>
              <label className="label">Total PAX</label>
              <input
                type="text"
                className="input"
                value={formData.event?.totalPax || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, event: { ...prev.event, totalPax: e.target.value } }))}
              />
            </div>
            <div>
              <label className="label">Time</label>
              <input
                type="text"
                className="input"
                value={formData.event?.time || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, event: { ...prev.event, time: e.target.value } }))}
              />
            </div>
          </div>
        </div>

        {/* Section List (Can be edited if needed) */}
        <div style={{
          backgroundColor: '#171717',
          border: '1px solid #2d2d2d',
          borderRadius: '6px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>
              INCLUDED SERVICES & MENU ({formData.sections.length} SECTIONS)
            </div>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {PRESET_SECTIONS.slice(0, 5).map(preset => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleAddPresetSection(preset.name)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                {preset.label}
              </button>
            ))}

            {!isAddingCustom ? (
              <button
                type="button"
                onClick={() => setIsAddingCustom(true)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                + CUSTOM SECTION
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Section name..."
                  value={customSectionInput}
                  onChange={(e) => setCustomSectionInput(e.target.value)}
                  style={{ height: '28px', width: '150px', fontSize: '11px' }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCustomSection}
                  className="btn btn-primary btn-sm"
                  style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {formData.sections.map((section, idx) => (
            <SectionEditor
              key={section.id || idx}
              section={section}
              index={idx}
              totalSections={formData.sections.length}
              onUpdateSection={(updated) => handleUpdateSection(idx, updated)}
              onDeleteSection={() => handleDeleteSection(idx)}
              onMoveUp={() => handleMoveSection(idx, -1)}
              onMoveDown={() => handleMoveSection(idx, 1)}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid #2d2d2d'
        }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            <Save size={16} /> Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
