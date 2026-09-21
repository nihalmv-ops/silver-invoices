import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BusinessModal } from './components/BusinessModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';

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

export function App() {
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
    const updated = deleteQuotationStorage(deleteModalState.item.id);
    setQuotations(updated);
    showToast(`Quotation ${deleteModalState.item.quotationNumber} deleted.`, 'info');
    if (activePage === 'view-quotation') {
      setActivePage('quotations');
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
    const updated = deleteInvoiceStorage(deleteModalState.item.id);
    setInvoices(updated);
    showToast(`Invoice ${deleteModalState.item.invoiceNumber} deleted.`, 'info');
    if (activePage === 'view-invoice') {
      setActivePage('invoices');
    }
  };

  // Business Info Save
  const handleSaveBusinessInfo = (newInfo) => {
    saveBusinessInfoStorage(newInfo);
    setBusinessInfo(newInfo);
    showToast('Business details updated successfully!', 'success');
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
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activePage={activePage}
        setActivePage={(p) => { setActivePage(p); window.scrollTo(0, 0); }}
        quotationCount={quotations.length}
        invoiceCount={invoices.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        businessInfo={businessInfo}
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

export default App;
