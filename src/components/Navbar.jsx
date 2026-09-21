import React from 'react';
import { PlusCircle, FileText, Receipt, Settings } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Navbar({ activePage, setActivePage, quotationCount = 0, invoiceCount = 0, onOpenSettings, businessInfo }) {
  return (
    <header className="navbar no-print" style={{
      backgroundColor: '#161616',
      borderBottom: '1px solid #282828',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand identity with Logo */}
        <div 
          onClick={() => setActivePage('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BrandLogo logoSrc={businessInfo?.logo} size="sm" />
          </div>
          <div>
            <div style={{
              fontFamily: "var(--font-serif)",
              fontSize: '19px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#f5f5f5',
              lineHeight: 1.1
            }}>
              SILVER CATERING
            </div>
            <div style={{
              fontSize: '9.5px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--brand-gold, #9d8050)'
            }}>
              CATERING & EVENTS
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActivePage('home')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage === 'home' ? '#f5f5f5' : '#888888',
              fontWeight: activePage === 'home' ? 600 : 500,
              fontSize: '13px',
              letterSpacing: '0.04em',
              padding: '8px 12px',
              cursor: 'pointer',
              borderBottom: activePage === 'home' ? '2px solid #b59a62' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            Home
          </button>

          <button
            onClick={() => setActivePage('quotations')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage.startsWith('quotation') ? '#f5f5f5' : '#888888',
              fontWeight: activePage.startsWith('quotation') ? 600 : 500,
              fontSize: '13px',
              letterSpacing: '0.04em',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: activePage.startsWith('quotation') ? '2px solid #b59a62' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={15} />
            <span>Quotations</span>
            <span style={{
              backgroundColor: '#262626',
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '11px',
              color: '#d1d1d1'
            }}>
              {quotationCount}
            </span>
          </button>

          <button
            onClick={() => setActivePage('invoices')}
            style={{
              background: 'none',
              border: 'none',
              color: activePage.startsWith('invoice') ? '#f5f5f5' : '#888888',
              fontWeight: activePage.startsWith('invoice') ? 600 : 500,
              fontSize: '13px',
              letterSpacing: '0.04em',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: activePage.startsWith('invoice') ? '2px solid #b59a62' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <Receipt size={15} />
            <span>Invoices</span>
            <span style={{
              backgroundColor: '#262626',
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '11px',
              color: '#d1d1d1'
            }}>
              {invoiceCount}
            </span>
          </button>
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenSettings}
            className="btn btn-secondary btn-sm"
            title="Edit Business Details"
          >
            <Settings size={15} />
            <span className="hide-on-mobile">Business Info</span>
          </button>

          <button
            onClick={() => setActivePage('new-quotation')}
            className="btn btn-primary"
            style={{ padding: '8px 16px' }}
          >
            <PlusCircle size={16} />
            <span>NEW QUOTATION</span>
          </button>
        </div>
      </div>
    </header>
  );
}

