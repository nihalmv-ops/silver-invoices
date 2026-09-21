import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '440px' }}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #2e2e2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1c1c1c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cf4c4c' }}>
            <AlertTriangle size={18} />
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{title || 'Confirm Delete'}</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px', color: '#d1d1d1', fontSize: '13px', lineHeight: 1.6 }}>
          {message || 'Are you sure you want to delete this record? This action cannot be undone.'}
        </div>

        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #2e2e2e',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          backgroundColor: '#191919'
        }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => { onConfirm(); onClose(); }} 
            className="btn btn-danger"
            style={{ backgroundColor: '#cf4c4c', color: '#ffffff' }}
          >
            <Trash2 size={14} /> Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

