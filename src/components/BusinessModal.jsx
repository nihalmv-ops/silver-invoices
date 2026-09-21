import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Building2, Upload, RotateCcw } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function BusinessModal({ isOpen, onClose, businessInfo, onSave }) {
  const [formData, setFormData] = useState(businessInfo);
  const [newPhone, setNewPhone] = useState('');
  const [newTerm, setNewTerm] = useState('');

  if (!isOpen) return null;

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhone = () => {
    if (!newPhone.trim()) return;
    setFormData(prev => ({
      ...prev,
      phones: [...(prev.phones || []), newPhone.trim()]
    }));
    setNewPhone('');
  };

  const handleRemovePhone = (index) => {
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index)
    }));
  };

  const handleAddTerm = () => {
    if (!newTerm.trim()) return;
    setFormData(prev => ({
      ...prev,
      terms: [...(prev.terms || []), newTerm.trim()]
    }));
    setNewTerm('');
  };

  const handleRemoveTerm = (index) => {
    setFormData(prev => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index)
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setFormData(prev => ({ ...prev, logo: '/logo.webp' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #2e2e2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1b1b1b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={18} color="#b59a62" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em' }}>
              Business Profile & Settings
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Logo Section */}
          <div style={{
            backgroundColor: '#171717',
            border: '1px solid #292929',
            borderRadius: '6px',
            padding: '14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '6px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #333'
              }}>
                <BrandLogo logoSrc={formData.logo} size="sm" />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#f5f5f5' }}>
                  {formData.logo ? 'Custom Uploaded Logo' : 'Official Silver Catering Emblem'}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  Displayed on A4 Quotations, Invoices & Printouts
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                <Upload size={13} /> Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {formData.logo && (
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="btn btn-secondary btn-sm"
                  title="Reset to official vector emblem"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}
            </div>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '14px' }}>
            <div>
              <label className="label">Business Name</label>
              <input 
                type="text" 
                className="input" 
                value={formData.name || ''} 
                onChange={e => handleTextChange('name', e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="label">Subtitle / Tagline</label>
              <input 
                type="text" 
                className="input" 
                value={formData.subtitle || ''} 
                onChange={e => handleTextChange('subtitle', e.target.value)} 
              />
            </div>
          </div>

          {/* Contact Numbers */}
          <div style={{ marginBottom: '16px' }}>
            <label className="label">Official Phone Numbers (shown on documents)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              {(formData.phones || []).map((ph, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#262626',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  border: '1px solid #363636',
                  fontSize: '12px'
                }}>
                  <span>{ph}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemovePhone(idx)}
                    style={{ background: 'none', border: 'none', color: '#cf4c4c', cursor: 'pointer', display: 'flex' }}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. 9846 415 767" 
                value={newPhone} 
                onChange={e => setNewPhone(e.target.value)} 
              />
              <button type="button" onClick={handleAddPhone} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Address, Email & Website */}
          <div className="form-grid-2" style={{ marginBottom: '14px' }}>
            <div>
              <label className="label">Address / Location</label>
              <input 
                type="text" 
                className="input" 
                value={formData.address || ''} 
                onChange={e => handleTextChange('address', e.target.value)} 
              />
            </div>
            <div>
              <label className="label">Official Website</label>
              <input 
                type="text" 
                className="input" 
                placeholder="www.silvercatering.in"
                value={formData.website || ''} 
                onChange={e => handleTextChange('website', e.target.value)} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="label">Email Address (Optional)</label>
            <input 
              type="email" 
              className="input" 
              placeholder="silvereventsandcaters@gmail.com"
              value={formData.email || ''} 
              onChange={e => handleTextChange('email', e.target.value)} 
            />
          </div>

          {/* Optional UPI Handle */}
          <div style={{ marginBottom: '16px' }}>
            <label className="label">UPI ID / GPay Number (Optional)</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. silvercatering@okaxis" 
              value={formData.upiId || ''} 
              onChange={e => handleTextChange('upiId', e.target.value)} 
            />
          </div>

          {/* Terms & Conditions */}
          <div style={{ marginBottom: '14px' }}>
            <label className="label">Default Terms & Conditions</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
              {(formData.terms || []).map((term, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#1f1f1f',
                  padding: '6px 10px',
                  borderRadius: '3px',
                  border: '1px solid #303030',
                  fontSize: '12px'
                }}>
                  <span>{idx + 1}. {term}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTerm(idx)}
                    style={{ background: 'none', border: 'none', color: '#cf4c4c', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="Add standard term..." 
                value={newTerm} 
                onChange={e => setNewTerm(e.target.value)} 
              />
              <button type="button" onClick={handleAddTerm} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #2e2e2e'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={15} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
