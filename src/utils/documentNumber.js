const QUOTATION_COUNTER_KEY = 'silver_quotation_counter';
const INVOICE_COUNTER_KEY = 'silver_invoice_counter';

export function getNextQuotationNumber() {
  const current = parseInt(localStorage.getItem(QUOTATION_COUNTER_KEY) || '0', 10);
  const next = current + 1;
  localStorage.setItem(QUOTATION_COUNTER_KEY, String(next));
  return formatDocNumber('QT', next);
}

export function peekNextQuotationNumber() {
  const current = parseInt(localStorage.getItem(QUOTATION_COUNTER_KEY) || '0', 10);
  return formatDocNumber('QT', current + 1);
}

export function getNextInvoiceNumber() {
  const current = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '0', 10);
  const next = current + 1;
  localStorage.setItem(INVOICE_COUNTER_KEY, String(next));
  return formatDocNumber('INV', next);
}

export function peekNextInvoiceNumber() {
  const current = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '0', 10);
  return formatDocNumber('INV', current + 1);
}

export function syncQuotationCounterWithExisting(quotations = []) {
  let maxNumber = 0;
  quotations.forEach(q => {
    if (q.quotationNumber && q.quotationNumber.startsWith('QT-')) {
      const num = parseInt(q.quotationNumber.replace('QT-', ''), 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  const currentCounter = parseInt(localStorage.getItem(QUOTATION_COUNTER_KEY) || '0', 10);
  if (maxNumber > currentCounter) {
    localStorage.setItem(QUOTATION_COUNTER_KEY, String(maxNumber));
  }
}

export function syncInvoiceCounterWithExisting(invoices = []) {
  let maxNumber = 0;
  invoices.forEach(inv => {
    if (inv.invoiceNumber && inv.invoiceNumber.startsWith('INV-')) {
      const num = parseInt(inv.invoiceNumber.replace('INV-', ''), 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  const currentCounter = parseInt(localStorage.getItem(INVOICE_COUNTER_KEY) || '0', 10);
  if (maxNumber > currentCounter) {
    localStorage.setItem(INVOICE_COUNTER_KEY, String(maxNumber));
  }
}

function formatDocNumber(prefix, num) {
  return `${prefix}-${String(num).padStart(4, '0')}`;
}

