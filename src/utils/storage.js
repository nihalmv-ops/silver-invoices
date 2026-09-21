import { DEFAULT_BUSINESS_INFO } from '../constants/defaultData';
import { SAMPLE_QUOTATION } from '../constants/sampleQuotation';
import { syncQuotationCounterWithExisting, syncInvoiceCounterWithExisting } from './documentNumber';

const QUOTATIONS_KEY = 'silver_quotations';
const INVOICES_KEY = 'silver_invoices';
const BUSINESS_KEY = 'silver_business_info';

export function getBusinessInfo() {
  try {
    const raw = localStorage.getItem(BUSINESS_KEY);
    if (!raw) return DEFAULT_BUSINESS_INFO;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_BUSINESS_INFO,
      ...parsed,
      logo: parsed.logo || DEFAULT_BUSINESS_INFO.logo
    };
  } catch (err) {
    console.error('Error reading business info:', err);
    return DEFAULT_BUSINESS_INFO;
  }
}

export function saveBusinessInfo(info) {
  try {
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(info));
  } catch (err) {
    console.error('Error saving business info:', err);
  }
}

export function getQuotations() {
  try {
    const raw = localStorage.getItem(QUOTATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading quotations:', err);
    return [];
  }
}

export function saveQuotation(quotation) {
  try {
    const list = getQuotations();
    const existingIndex = list.findIndex(q => q.id === quotation.id);
    let updated;
    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = { ...quotation, updatedAt: now };
    } else {
      updated = [{ ...quotation, createdAt: now, updatedAt: now }, ...list];
    }
    
    localStorage.setItem(QUOTATIONS_KEY, JSON.stringify(updated));
    syncQuotationCounterWithExisting(updated);
    return updated;
  } catch (err) {
    console.error('Error saving quotation:', err);
    return [];
  }
}

export function deleteQuotation(id) {
  try {
    const list = getQuotations();
    const updated = list.filter(q => q.id !== id);
    localStorage.setItem(QUOTATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting quotation:', err);
    return [];
  }
}

export function getInvoices() {
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading invoices:', err);
    return [];
  }
}

export function saveInvoice(invoice) {
  try {
    const list = getInvoices();
    const existingIndex = list.findIndex(inv => inv.id === invoice.id);
    let updated;
    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = { ...invoice, updatedAt: now };
    } else {
      updated = [{ ...invoice, createdAt: now, updatedAt: now }, ...list];
    }
    
    localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));
    syncInvoiceCounterWithExisting(updated);
    return updated;
  } catch (err) {
    console.error('Error saving invoice:', err);
    return [];
  }
}

export function deleteInvoice(id) {
  try {
    const list = getInvoices();
    const updated = list.filter(inv => inv.id !== id);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting invoice:', err);
    return [];
  }
}

/**
 * Initialize storage with default sample data on first visit
 */
export function initializeStorage() {
  try {
    const quotations = getQuotations();
    if (quotations.length === 0) {
      // Seed with Sulaiman sample quotation so user can immediately view/test it
      localStorage.setItem(QUOTATIONS_KEY, JSON.stringify([SAMPLE_QUOTATION]));
      syncQuotationCounterWithExisting([SAMPLE_QUOTATION]);
    }
    
    if (!localStorage.getItem(BUSINESS_KEY)) {
      localStorage.setItem(BUSINESS_KEY, JSON.stringify(DEFAULT_BUSINESS_INFO));
    }
  } catch (err) {
    console.error('Error initializing storage:', err);
  }
}

