import React from 'react';
import { PlusCircle, FileText, Receipt, Settings } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Navbar({ activePage, setActivePage, quotationCount = 0, invoiceCount = 0, onOpenSettings, businessInfo }) {
  return (
    <header className="navbar no-print">
      <div className="navbar-inner">
        {/* Brand identity with Logo */}
        <div 
          onClick={() => setActivePage('home')}
          className="navbar-brand"
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <BrandLogo logoSrc={businessInfo?.logo} size="sm" />
          </div>
          <div>
            <div className="navbar-brand-title">
              SILVER CATERING
            </div>
            <div className="navbar-brand-subtitle">
              CATERING & EVENTS
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="navbar-tabs">
          <button
            onClick={() => setActivePage('home')}
            className="nav-tab-btn"
            style={{
              color: activePage === 'home' ? '#f5f5f5' : '#888888',
              fontWeight: activePage === 'home' ? 600 : 500,
              borderBottomColor: activePage === 'home' ? '#b59a62' : 'transparent'
            }}
          >
            Home
          </button>

          <button
            onClick={() => setActivePage('quotations')}
            className="nav-tab-btn"
            style={{
              color: activePage.startsWith('quotation') ? '#f5f5f5' : '#888888',
              fontWeight: activePage.startsWith('quotation') ? 600 : 500,
              borderBottomColor: activePage.startsWith('quotation') ? '#b59a62' : 'transparent'
            }}
          >
            <FileText size={15} />
            <span>Quotations</span>
            <span className="nav-tab-badge">
              {quotationCount}
            </span>
          </button>

          <button
            onClick={() => setActivePage('invoices')}
            className="nav-tab-btn"
            style={{
              color: activePage.startsWith('invoice') ? '#f5f5f5' : '#888888',
              fontWeight: activePage.startsWith('invoice') ? 600 : 500,
              borderBottomColor: activePage.startsWith('invoice') ? '#b59a62' : 'transparent'
            }}
          >
            <Receipt size={15} />
            <span>Invoices</span>
            <span className="nav-tab-badge">
              {invoiceCount}
            </span>
          </button>
        </nav>

        {/* Right actions */}
        <div className="navbar-actions">
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
            className="btn btn-primary btn-sm"
            style={{ padding: '7px 14px' }}
          >
            <PlusCircle size={15} />
            <span className="hide-on-mobile">NEW QUOTATION</span>
            <span className="show-on-mobile-inline">NEW</span>
          </button>
        </div>
      </div>
    </header>
  );
}

