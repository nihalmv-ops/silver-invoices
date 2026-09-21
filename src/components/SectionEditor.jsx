import React from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { ItemRow } from './ItemRow';
import { generateId } from '../utils/id';

export function SectionEditor({
  section,
  index,
  totalSections,
  onUpdateSection,
  onDeleteSection,
  onMoveUp,
  onMoveDown
}) {
  const handleTitleChange = (val) => {
    onUpdateSection({ ...section, title: val });
  };

  const handleSubtitleChange = (val) => {
    onUpdateSection({ ...section, subtitle: val });
  };

  const handleAddItem = () => {
    const newItem = {
      id: generateId('item'),
      name: '',
      quantity: '',
      unit: 'KG'
    };
    onUpdateSection({
      ...section,
      items: [...(section.items || []), newItem]
    });
  };

  const handleItemChange = (itemIndex, field, value) => {
    const newItems = [...(section.items || [])];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    onUpdateSection({ ...section, items: newItems });
  };

  const handleDeleteItem = (itemIndex) => {
    const newItems = (section.items || []).filter((_, idx) => idx !== itemIndex);
    onUpdateSection({ ...section, items: newItems });
  };

  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      border: '1px solid #303030',
      borderRadius: '6px',
      marginBottom: '18px',
      overflow: 'hidden'
    }}>
      {/* Section Header Controls */}
      <div style={{
        backgroundColor: '#242424',
        padding: '10px 14px',
        borderBottom: '1px solid #333333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Title & Subtitle inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px', flexWrap: 'wrap' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#b59a62',
            letterSpacing: '0.06em',
            backgroundColor: '#1b1b1b',
            border: '1px solid #3a3a3a',
            borderRadius: '3px',
            padding: '4px 8px',
            flexShrink: 0
          }}>
            #{String(index + 1).padStart(2, '0')}
          </div>
          <input
            type="text"
            className="input"
            value={section.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Section Title (e.g. WEDDING EVE, MAIN COURSE)"
            style={{
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontSize: '13px',
              height: '34px',
              flex: 1,
              minWidth: '130px'
            }}
          />
          <input
            type="text"
            className="input"
            value={section.subtitle || ''}
            onChange={(e) => handleSubtitleChange(e.target.value)}
            placeholder="Sub/Date (e.g. 17.10.2026)"
            style={{ width: '130px', height: '34px', fontSize: '12px' }}
          />
        </div>

        {/* Section Actions (Reorder & Delete) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="btn btn-secondary btn-sm"
            title="Move Section Up"
            style={{ opacity: index === 0 ? 0.3 : 1, padding: '5px 8px', minHeight: '32px' }}
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            className="btn btn-secondary btn-sm"
            title="Move Section Down"
            style={{ opacity: index === totalSections - 1 ? 0.3 : 1, padding: '5px 8px', minHeight: '32px' }}
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            onClick={onDeleteSection}
            className="btn btn-danger btn-sm"
            title="Delete Section"
            style={{ padding: '5px 8px', minHeight: '32px' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Items Container */}
      <div style={{ padding: '12px' }}>
        {/* Table header */}
        <div className="item-row-grid-header">
          <div>Food / Service Item</div>
          <div>Quantity</div>
          <div>Unit</div>
          <div></div>
        </div>

        {/* Items List */}
        {(!section.items || section.items.length === 0) ? (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            color: '#777777',
            fontSize: '12px',
            border: '1px dashed #333333',
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            No items in this section yet. Click below to add food items or services.
          </div>
        ) : (
          section.items.map((item, itemIdx) => (
            <ItemRow
              key={item.id || itemIdx}
              item={item}
              index={itemIdx}
              onChange={(field, val) => handleItemChange(itemIdx, field, val)}
              onDelete={() => handleDeleteItem(itemIdx)}
            />
          ))
        )}

        {/* Add Item button */}
        <button
          type="button"
          onClick={handleAddItem}
          className="btn btn-outline btn-sm"
          style={{ marginTop: '6px', fontSize: '12px' }}
        >
          <Plus size={14} /> Add Item
        </button>
      </div>
    </div>
  );
}
