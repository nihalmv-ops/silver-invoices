import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="#3fae68" />;
      case 'error':
        return <AlertCircle size={18} color="#cf4c4c" />;
      default:
        return <Info size={18} color="#b59a62" />;
    }
  };

  return (
    <div className="toast-container no-print">
      <div className="toast">
        {getIcon()}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginLeft: 'auto', display: 'flex' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

