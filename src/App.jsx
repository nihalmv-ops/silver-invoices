import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Navbar } from './components/Navbar';
import { BusinessModal } from './components/BusinessModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { BrandLogo } from './components/BrandLogo';

import { Home } from './pages/Home';
import { QuotationEditor } from './pages/QuotationEditor';
import { QuotationsList } from './pages/QuotationsList';
import { QuotationView } from './pages/QuotationView';
import { InvoiceEditor } from './pages/InvoiceEditor';
import { InvoicesList } from './pages/InvoicesList';
import { InvoiceView } from './pages/InvoiceView';

import {
  getQuotations,
  saveQuotation as saveQuotationStorage,
  deleteQuotation as deleteQuotationStorage,
  getInvoices,
  saveInvoice as saveInvoiceStorage,
  deleteInvoice as deleteInvoiceStorage,
  getBusinessInfo,
  saveBusinessInfo as saveBusinessInfoStorage,
  initializeStorage
} from './utils/storage';
import { getNextInvoiceNumber } from './utils/documentNumber';
import { SAMPLE_QUOTATION } from './constants/sampleQuotation';
import { getTodayFormatted } from './utils/formatters';
import { api } from './services/api';

function AppContent() {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  const [activePage, setActivePage] = useState('home');
  // Initialize storage state synchronously
  const [quotations, setQuotations] = useState(() => {
    initializeStorage();
    return getQuotations();
  });
  const [invoices, setInvoices] = useState(() => getInvoices());
  const [businessInfo, setBusinessInfo] = useState(() => getBusinessInfo());
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    type: null, // 'quotation' | 'invoice'
    item: null
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Sync with backend on login
  useEffect(() => {
    if (!token || token === 'demo_token_silver_catering') return;

    let isMounted = true;

    // Fetch quotations from backend
    api.quotations.getAll(token)
      .then((res) => {
        if (isMounted && res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setQuotations(res.data);
          localStorage.setItem('silver_quotations', JSON.stringify(res.data));
        }
      })
      .catch((err) => {
        console.warn('Backend quotations sync notice:', err.message);
      });

    // Fetch invoices from backend
    api.invoices.getAll(token)
      .then((res) => {
        if (isMounted && res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setInvoices(res.data);
          localStorage.setItem('silver_invoices', JSON.stringify(res.data));
        }
      })
      .catch((err) => {
        console.warn('Backend invoices sync notice:', err.message);
      });

    // Fetch business profile from backend
    api.business.get(token)
      .then((res) => {
        if (isMounted && res && res.data) {
          setBusinessInfo(res.data);
          saveBusinessInfoStorage(res.data);
        }
      })
      .catch((err) => {
        console.warn('Backend business profile sync notice:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handlers for Quotation
  const handleNewQuotation = () => {
    setSelectedQuotation(null);
    setActivePage('new-quotation');
    window.scrollTo(0, 0);
  };

  const handleEditQuotation = (quote) => {
    setSelectedQuotation(quote);
    setActivePage('edit-quotation');
    window.scrollTo(0, 0);
  };

  const handleViewQuotation = (quote) => {
    setSelectedQuotation(quote);
    setActivePage('view-quotation');
    window.scrollTo(0, 0);
  };

  const handleSaveQuotation = (quoteData) => {
    const updated = saveQuotationStorage(quoteData);
    setQuotations(updated);
    setSelectedQuotation(quoteData);
    showToast(`Quotation ${quoteData.quotationNumber} saved successfully!`, 'success');
    setActivePage('view-quotation');
    window.scrollTo(0, 0);

    // Sync to backend if logged in
    if (token && token !== 'demo_token_silver_catering') {
      api.quotations.save(quoteData, token).catch((err) => {
        console.warn('Backend quotation save notice:', err.message);
      });
    }
  };

  const handleDeleteQuotationClick = (quote) => {
    setDeleteModalState({
      isOpen: true,
      type: 'quotation',
      item: quote
    });
  };

  const handleConfirmDeleteQuotation = () => {
    if (!deleteModalState.item) return;
    const itemToDelete = deleteModalState.item;
    const updated = deleteQuotationStorage(itemToDelete.id);
    setQuotations(updated);
    showToast(`Quotation ${itemToDelete.quotationNumber} deleted.`, 'info');
    if (activePage === 'view-quotation') {
      setActivePage('quotations');
    }

    // Sync deletion to backend
    if (token && token !== 'demo_token_silver_catering') {
      api.quotations.delete(itemToDelete.id, token).catch((err) => {
        console.warn('Backend quotation delete notice:', err.message);
      });
    }
  };

  // Convert Quotation to Invoice
  const handleConvertToInvoice = (quote) => {
    const nextInvNumber = getNextInvoiceNumber();
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: nextInvNumber,
      quotationId: quote.id,
      quotationNumber: quote.quotationNumber,
      date: getTodayFormatted(),
      customer: { ...quote.customer },
      event: { ...quote.event },
      sections: JSON.parse(JSON.stringify(quote.sections || [])),
      customTotalAmount: quote.customTotalAmount || 0,
      advancePaid: 0,
      balanceDue: quote.customTotalAmount || 0,
      paymentStatus: 'PENDING',
      notes: quote.notes || ''
    };

    const updated = saveInvoiceStorage(newInvoice);
    setInvoices(updated);
    setSelectedInvoice(newInvoice);
    showToast(`Converted to Invoice ${nextInvNumber}!`, 'success');
    setActivePage('edit-invoice');
    window.scrollTo(0, 0);

    // Sync to backend
    if (token && token !== 'demo_token_silver_catering') {
      api.invoices.save(newInvoice, token).catch((err) => {
        console.warn('Backend invoice save notice:', err.message);
      });
    }
  };

  // Handlers for Invoice
  const handleViewInvoice = (inv) => {
    setSelectedInvoice(inv);
    setActivePage('view-invoice');
    window.scrollTo(0, 0);
  };

  const handleEditInvoice = (inv) => {
    setSelectedInvoice(inv);
    setActivePage('edit-invoice');
    window.scrollTo(0, 0);
  };

  const handleSaveInvoice = (invData) => {
    const updated = saveInvoiceStorage(invData);
    setInvoices(updated);
    setSelectedInvoice(invData);
    showToast(`Invoice ${invData.invoiceNumber} updated successfully!`, 'success');
    setActivePage('view-invoice');
    window.scrollTo(0, 0);

    // Sync to backend
    if (token && token !== 'demo_token_silver_catering') {
      api.invoices.save(invData, token).catch((err) => {
        console.warn('Backend invoice save notice:', err.message);
      });
    }
  };

  const handleDeleteInvoiceClick = (inv) => {
    setDeleteModalState({
      isOpen: true,
      type: 'invoice',
      item: inv
    });
  };

  const handleConfirmDeleteInvoice = () => {
    if (!deleteModalState.item) return;
    const itemToDelete = deleteModalState.item;
    const updated = deleteInvoiceStorage(itemToDelete.id);
    setInvoices(updated);
    showToast(`Invoice ${itemToDelete.invoiceNumber} deleted.`, 'info');
    if (activePage === 'view-invoice') {
      setActivePage('invoices');
    }

    // Sync deletion to backend
    if (token && token !== 'demo_token_silver_catering') {
      api.invoices.delete(itemToDelete.id, token).catch((err) => {
        console.warn('Backend invoice delete notice:', err.message);
      });
    }
  };

  // Business Info Save
  const handleSaveBusinessInfo = (newInfo) => {
    saveBusinessInfoStorage(newInfo);
    setBusinessInfo(newInfo);
    showToast('Business details updated successfully!', 'success');

    // Sync to backend
    if (token && token !== 'demo_token_silver_catering') {
      api.business.update(newInfo, token).catch((err) => {
        console.warn('Backend business update notice:', err.message);
      });
    }
  };

  // Reset or Load Sample Reference Quotation
  const handleLoadSample = () => {
    const sampleCopy = {
      ...SAMPLE_QUOTATION,
      id: `qt-${Date.now()}`
    };
    const updated = saveQuotationStorage(sampleCopy);
    setQuotations(updated);
    setSelectedQuotation(sampleCopy);
    showToast('Loaded Sulaiman (1200 PAX) reference quotation!', 'success');
    setActivePage('view-quotation');
    window.scrollTo(0, 0);

    if (token && token !== 'demo_token_silver_catering') {
      api.quotations.save(sampleCopy, token).catch((err) => {
        console.warn('Backend sample quotation save notice:', err.message);
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        color: '#f5f5f5'
      }}>
        <BrandLogo size="md" />
        <div style={{
          marginTop: '20px',
          fontFamily: 'var(--font-serif)',
          letterSpacing: '0.15em',
          fontSize: '18px',
          color: 'var(--gold-accent)'
        }}>
          SILVER CATERING
        </div>
        <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
          Loading system...
        </div>
      </div>
    );
  }

  // Unauthenticated view: Login or Register
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterPage onToggleLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onToggleRegister={() => setAuthView('register')} />;
  }

  // Authenticated Main Dashboard
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activePage={activePage}
        setActivePage={(p) => { setActivePage(p); window.scrollTo(0, 0); }}
        quotationCount={quotations.length}
        invoiceCount={invoices.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        businessInfo={businessInfo}
        user={user}
        onLogout={logout}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <Home
            setActivePage={(p) => { setActivePage(p); window.scrollTo(0, 0); }}
            quotations={quotations}
            invoices={invoices}
            businessInfo={businessInfo}
            onViewQuotation={handleViewQuotation}
            onEditQuotation={handleEditQuotation}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onLoadSample={handleLoadSample}
          />
        )}

        {(activePage === 'new-quotation' || activePage === 'edit-quotation') && (
          <QuotationEditor
            editingQuotation={selectedQuotation}
            businessInfo={businessInfo}
            onSave={handleSaveQuotation}
            onCancel={() => setActivePage('quotations')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onPreviewImmediate={(previewData) => {
              setSelectedQuotation(previewData);
              setActivePage('view-quotation');
            }}
          />
        )}

        {activePage === 'quotations' && (
          <QuotationsList
            quotations={quotations}
            businessInfo={businessInfo}
            onNewQuotation={handleNewQuotation}
            onViewQuotation={handleViewQuotation}
            onEditQuotation={handleEditQuotation}
            onConvertToInvoice={handleConvertToInvoice}
            onDeleteQuotation={handleDeleteQuotationClick}
          />
        )}

        {activePage === 'view-quotation' && (
          <QuotationView
            quotation={selectedQuotation}
            businessInfo={businessInfo}
            onBack={() => setActivePage('quotations')}
            onEdit={handleEditQuotation}
            onConvertToInvoice={handleConvertToInvoice}
            onNotify={showToast}
          />
        )}

        {activePage === 'invoices' && (
          <InvoicesList
            invoices={invoices}
            businessInfo={businessInfo}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoiceClick}
            onNewQuotation={handleNewQuotation}
          />
        )}

        {activePage === 'edit-invoice' && selectedInvoice && (
          <InvoiceEditor
            invoice={selectedInvoice}
            businessInfo={businessInfo}
            onSave={handleSaveInvoice}
            onCancel={() => setActivePage('invoices')}
            onPreviewImmediate={(previewData) => {
              setSelectedInvoice(previewData);
              setActivePage('view-invoice');
            }}
          />
        )}

        {activePage === 'view-invoice' && (
          <InvoiceView
            invoice={selectedInvoice}
            businessInfo={businessInfo}
            onBack={() => setActivePage('invoices')}
            onEdit={handleEditInvoice}
            onNotify={showToast}
          />
        )}
      </main>

      {/* Business Settings Modal */}
      <BusinessModal
        key={isSettingsOpen ? 'open' : 'closed'}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        businessInfo={businessInfo}
        onSave={handleSaveBusinessInfo}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, type: null, item: null })}
        onConfirm={() => {
          if (deleteModalState.type === 'quotation') {
            handleConfirmDeleteQuotation();
          } else if (deleteModalState.type === 'invoice') {
            handleConfirmDeleteInvoice();
          }
        }}
        title={deleteModalState.type === 'quotation' ? 'Delete Quotation' : 'Delete Invoice'}
        message={
          deleteModalState.item
            ? `Are you sure you want to permanently delete ${
                deleteModalState.type === 'quotation'
                  ? deleteModalState.item.quotationNumber
                  : deleteModalState.item.invoiceNumber
              } for "${deleteModalState.item.customer?.name || 'Customer'}"?`
            : undefined
        }
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
