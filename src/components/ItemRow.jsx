import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { STANDARD_UNITS } from '../constants/defaultData';

export function ItemRow({ item, onChange, onDelete }) {
  const [isCustomUnit, setIsCustomUnit] = useState(
    Boolean(item.unit && !STANDARD_UNITS.includes(item.unit))
  );

  const handleUnitSelect = (e) => {
    const val = e.target.value;
    if (val === 'CUSTOM') {
      setIsCustomUnit(true);
      onChange('unit', '');
    } else {
      setIsCustomUnit(false);
      onChange('unit', val);
    }
  };

  return (
    <div className="item-row-card">
      {/* Item Name */}
      <div className="item-col-name">
        <input
          type="text"
          className="input"
          placeholder="Item / service name (e.g. Ghee Rice)"
          value={item.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          style={{ height: '36px', fontSize: '13px' }}
        />
      </div>

      {/* Quantity */}
      <div className="item-col-qty">
        <input
          type="text"
          className="input"
          placeholder="Qty (e.g. 30)"
          value={item.quantity || ''}
          onChange={(e) => onChange('quantity', e.target.value)}
          style={{ height: '36px', fontSize: '13px' }}
        />
      </div>

      {/* Unit */}
      <div className="item-col-unit">
        {isCustomUnit ? (
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              className="input"
              placeholder="Unit"
              value={item.unit || ''}
              onChange={(e) => onChange('unit', e.target.value)}
              style={{ height: '36px', fontSize: '12px' }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => { setIsCustomUnit(false); onChange('unit', 'KG'); }}
              title="Back to standard units"
              style={{
                background: '#292929',
                border: '1px solid #3d3d3d',
                color: '#aaa',
                borderRadius: '3px',
                padding: '0 8px',
                cursor: 'pointer',
                fontSize: '11px',
                height: '36px'
              }}
            >
              Std
            </button>
          </div>
        ) : (
          <select
            className="select"
            value={item.unit || ''}
            onChange={handleUnitSelect}
            style={{ height: '36px', fontSize: '12px' }}
          >
            <option value="">No Unit</option>
            {STANDARD_UNITS.filter(u => u !== 'CUSTOM').map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
            <option value="CUSTOM">Custom...</option>
          </select>
        )}
      </div>

      {/* Delete Item button */}
      <div className="item-col-del">
        <button
          type="button"
          onClick={onDelete}
          title="Remove item"
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease',
            minWidth: '34px',
            minHeight: '34px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#cf4c4c')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
