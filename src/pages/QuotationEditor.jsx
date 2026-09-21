import React, { useState } from 'react';
import { Eye, Save, ArrowLeft, Info, Phone } from 'lucide-react';
import { SectionEditor } from '../components/SectionEditor';
import { QuotationPreview } from '../components/QuotationPreview';
import { PRESET_SECTIONS } from '../constants/defaultData';
import { getNextQuotationNumber, peekNextQuotationNumber } from '../utils/documentNumber';
import { getTodayFormatted, formatCurrency } from '../utils/formatters';
import { generateId } from '../utils/id';

export function QuotationEditor({
  editingQuotation,
  businessInfo,
  onSave,
  onCancel,
  onOpenSettings,
  onPreviewImmediate
}) {
  const isEditMode = Boolean(editingQuotation && editingQuotation.id);

  // Initialize state
  const [formData, setFormData] = useState(() => {
    if (editingQuotation) {
      return { ...editingQuotation };
    }
    return {
      id: `qt-${Date.now()}`,
      quotationNumber: peekNextQuotationNumber(),
      date: getTodayFormatted(),
      customer: {
        name: '',
        mobile: '',
        email: '',
        place: ''
      },
      event: {
        eventName: 'Wedding',
        eventDate: getTodayFormatted(),
        totalPax: '',
        time: 'LUNCH'
      },
      sections: [],
      customTotalAmount: 0,
      notes: ''
    };
  });

  const [showLivePreview, setShowLivePreview] = useState(false);
  const [customSectionInput, setCustomSectionInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Field change helpers
  const handleCustomerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }));
  };

  const handleEventChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      event: { ...prev.event, [field]: value }
    }));
  };

  // Section handling
  const handleAddPresetSection = (sectionName) => {
    const newSection = {
      id: generateId('sec'),
      title: sectionName,
      subtitle: '',
      items: [
        {
          id: generateId('item'),
          name: '',
          quantity: '',
          unit: 'KG'
        }
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
        {
          id: generateId('item'),
          name: '',
          quantity: '',
          unit: 'NOS'
        }
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

  // Total Amount handler
  const handleTotalAmountChange = (e) => {
    const rawVal = e.target.value.replace(/[^\d]/g, '');
    const num = rawVal ? parseInt(rawVal, 10) : 0;
    setFormData(prev => ({ ...prev, customTotalAmount: num }));
  };

  // Save submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.customer.name.trim()) {
      alert('Please enter customer name');
      return;
    }

    let finalData = { ...formData };
    // If creating a brand new quotation, confirm/increment quotation counter
    if (!isEditMode) {
      const generatedNumber = getNextQuotationNumber();
      finalData.quotationNumber = generatedNumber;
    }

    onSave(finalData);
  };

  return (
    <div style={{ maxWidth: showLivePreview ? '1400px' : '980px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Top Action Header */}
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
              {isEditMode ? `Edit Quotation (${formData.quotationNumber})` : 'Create New Quotation'}
            </h2>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Fill in customer & event details, choose sections, and enter your custom total amount.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`btn ${showLivePreview ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Eye size={16} />
            <span>{showLivePreview ? 'Hide Preview' : 'Side Preview'}</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ padding: '8px 20px' }}
          >
            <Save size={16} />
            <span>Save Quotation</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form on left, live preview optionally on right */}
      <div className={showLivePreview ? 'editor-preview-split' : ''}>
        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          {/* SECTION 01 — BUSINESS INFO HEADER */}
          <div style={{
            backgroundColor: '#1c1c1c',
            border: '1px solid #2d2d2d',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>
                SECTION 01 — ISSUED BY
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 700, color: '#f5f5f5', letterSpacing: '0.1em' }}>
                {businessInfo.name || 'SILVER CATERING'}
              </div>
              <div style={{ fontSize: '11px', color: '#b59a62', letterSpacing: '0.16em', fontWeight: 600, textTransform: 'uppercase' }}>
                {businessInfo.subtitle || 'CATERING & EVENTS'}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={12} color="#888" />
                {(businessInfo.phones || ['9846 415 767', '7593 982 800']).join('  •  ')}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSettings}
              className="btn btn-outline btn-sm"
            >
              Edit Business Info
            </button>
          </div>

          {/* SECTION 02 — QUOTATION DETAILS */}
          <div style={{
            backgroundColor: '#1c1c1c',
            border: '1px solid #2d2d2d',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: '12px' }}>
              SECTION 02 — QUOTATION DETAILS
            </div>
            <div className="form-grid-2">
              <div>
                <label className="label">Quotation Number (Auto)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.quotationNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, quotationNumber: e.target.value }))}
                  style={{ fontWeight: 700, color: '#b59a62' }}
                />
              </div>
              <div>
                <label className="label">Quotation Date</label>
                <input
                  type="text"
                  className="input"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g. 18.10.2026"
                />
              </div>
            </div>
          </div>

          {/* SECTION 03 — CUSTOMER DETAILS */}
          <div style={{
            backgroundColor: '#1c1c1c',
            border: '1px solid #2d2d2d',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: '12px' }}>
              SECTION 03 — CUSTOMER DETAILS
            </div>
            <div className="form-grid-2" style={{ marginBottom: '14px' }}>
              <div>
                <label className="label">Customer Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. SULAIMAN"
                  value={formData.customer.name}
                  onChange={(e) => handleCustomerChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 9544140650"
                  value={formData.customer.mobile}
                  onChange={(e) => handleCustomerChange('mobile', e.target.value)}
                />
              </div>
            </div>
            <div className="form-grid-2">
              <div>
                <label className="label">Place / Location</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. MOODAL"
                  value={formData.customer.place}
                  onChange={(e) => handleCustomerChange('place', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Email Address (Optional)</label>
                <input
                  type="email"
                  className="input"
                  placeholder="e.g. customer@gmail.com"
                  value={formData.customer.email}
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 04 — EVENT DETAILS */}
          <div style={{
            backgroundColor: '#1c1c1c',
            border: '1px solid #2d2d2d',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: '12px' }}>
              SECTION 04 — EVENT DETAILS
            </div>
            <div className="form-grid-4">
              <div>
                <label className="label">Event Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Wedding, Reception"
                  value={formData.event.eventName}
                  onChange={(e) => handleEventChange('eventName', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Event Date</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 18.10.2026"
                  value={formData.event.eventDate}
                  onChange={(e) => handleEventChange('eventDate', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Total PAX</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 1200"
                  value={formData.event.totalPax}
                  onChange={(e) => handleEventChange('totalPax', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Main Time</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. LUNCH, DINNER, 12:30 PM"
                  value={formData.event.time}
                  onChange={(e) => handleEventChange('time', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 05 — EVENT/SERVICE SECTIONS (Visual Builder) */}
          <div style={{
            backgroundColor: '#171717',
            border: '1px solid #2d2d2d',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b59a62', fontWeight: 700 }}>
                SECTION 05 — EVENT & SERVICE SECTIONS
              </div>
              <div style={{ fontSize: '11px', color: '#888' }}>
                {formData.sections.length} sections added
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>
              Click any quick button to add a pre-configured section, or create a custom section name.
            </p>

            {/* Quick Section Preset Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              padding: '12px',
              backgroundColor: '#1e1e1e',
              borderRadius: '4px',
              border: '1px solid #2d2d2d',
              marginBottom: '20px'
            }}>
              {PRESET_SECTIONS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleAddPresetSection(preset.name)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11.5px', padding: '5px 10px', backgroundColor: '#262626' }}
                >
                  {preset.label}
                </button>
              ))}

              {!isAddingCustom ? (
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(true)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11.5px', padding: '5px 10px' }}
                >
                  + CUSTOM SECTION
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter section name..."
                    value={customSectionInput}
                    onChange={(e) => setCustomSectionInput(e.target.value)}
                    style={{ height: '30px', width: '170px', fontSize: '11px' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSection}
                    className="btn btn-primary btn-sm"
                    style={{ height: '30px', padding: '0 8px' }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ height: '30px', padding: '0 8px' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Render Sections */}
            {formData.sections.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '36px 20px',
                border: '2px dashed #2f2f2f',
                borderRadius: '6px',
                color: '#777',
                fontSize: '13px'
              }}>
                No sections added yet. Click one of the quick buttons above (e.g. <strong>+ WEDDING EVE</strong>, <strong>+ MAIN COURSE</strong>, <strong>+ ARRANGEMENTS</strong>) to start building your quotation.
              </div>
            ) : (
              formData.sections.map((section, idx) => (
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
              ))
            )}
          </div>

          {/* SECTION 06 — CUSTOM FINAL TOTAL AMOUNT */}
          <div style={{
            backgroundColor: '#1c1c1c',
            border: '2px solid #b59a62',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#b59a62',
                fontWeight: 700
              }}>
                SECTION 06 — ESTIMATED COST
              </div>
            </div>

            <div style={{
              fontSize: '12px',
              color: '#888',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Info size={14} color="#b59a62" />
              <span>
                No individual item prices. Enter the agreed lump-sum estimated cost shown on the quotation/estimate.
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <label className="label">Estimated Cost (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '18px',
                    color: '#b59a62',
                    fontWeight: 700
                  }}>
                    ₹
                  </span>
                  <input
                    type="text"
                    className="input"
                    value={formData.customTotalAmount || ''}
                    onChange={handleTotalAmountChange}
                    placeholder="e.g. 250000"
                    style={{
                      paddingLeft: '32px',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#f5f5f5',
                      height: '46px'
                    }}
                  />
                </div>
              </div>

              <div style={{
                backgroundColor: '#242424',
                padding: '12px 20px',
                borderRadius: '4px',
                border: '1px solid #333',
                textAlign: 'right',
                minWidth: '180px'
              }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>
                  Formatted Estimated Cost
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', fontWeight: 700, color: '#b59a62' }}>
                  {formatCurrency(formData.customTotalAmount)}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="label">Optional Note / Special Instructions</label>
              <input
                type="text"
                className="input"
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g. All items will be freshly prepared and served by our professional team."
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #2d2d2d'
          }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onPreviewImmediate(formData)}
              className="btn btn-outline"
            >
              <Eye size={15} /> Full Preview
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              <Save size={16} /> Save Quotation
            </button>
          </div>
        </form>

        {/* Side Live Preview (Sticky) */}
        {showLivePreview && (
          <div style={{
            position: 'sticky',
            top: '84px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            border: '1px solid #333',
            borderRadius: '6px'
          }}>
            <div style={{
              backgroundColor: '#222',
              padding: '8px 14px',
              borderBottom: '1px solid #333',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#d1d1d1',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>LIVE DOCUMENT PREVIEW</span>
              <span style={{ color: '#b59a62' }}>A4 Aspect</span>
            </div>
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
              <QuotationPreview quotation={formData} businessInfo={businessInfo} itemColumns="2" density="compact" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
