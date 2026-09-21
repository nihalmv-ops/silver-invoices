import { formatCurrency } from './formatters.js';

export function generateQuotationWhatsAppMessage(quotation, businessInfo) {
  const lines = [];

  lines.push(`*${businessInfo.name || 'SILVER CATERING'}*`);
  lines.push(`_${businessInfo.subtitle || 'CATERING & EVENTS'}_`);
  lines.push('');
  lines.push(`*QUOTATION: ${quotation.quotationNumber || 'QT'}*`);
  lines.push('');
  lines.push(`*Customer:* ${quotation.customer?.name || ''}`);
  if (quotation.event?.eventDate) lines.push(`*Date:* ${quotation.event.eventDate}`);
  if (quotation.event?.totalPax) lines.push(`*PAX:* ${quotation.event.totalPax}`);
  if (quotation.event?.time) lines.push(`*Time:* ${quotation.event.time}`);
  if (quotation.customer?.place) lines.push(`*Place:* ${quotation.customer.place}`);
  lines.push('');
  lines.push('*SERVICES & MENU:*');
  lines.push('─────────────────');

  (quotation.sections || []).forEach(sec => {
    lines.push('');
    lines.push(`*${sec.title.toUpperCase()}*` + (sec.subtitle ? ` (${sec.subtitle})` : ''));
    (sec.items || []).forEach(item => {
      if (!item.name) return;
      const qtyStr = item.quantity ? ` — ${item.quantity} ${item.unit || ''}`.trimEnd() : '';
      lines.push(`• ${item.name}${qtyStr}`);
    });
  });

  lines.push('');
  lines.push('─────────────────');
  lines.push(`*ESTIMATED COST: ${formatCurrency(quotation.customTotalAmount)}*`);
  lines.push('─────────────────');
  lines.push('');
  lines.push('Thank you for choosing Silver Catering.');
  if (businessInfo.phones && businessInfo.phones.length > 0) {
    lines.push(`📞 ${businessInfo.phones.join(' / ')}`);
  }

  return lines.join('\n');
}

export function generateInvoiceWhatsAppMessage(invoice, businessInfo) {
  const lines = [];

  lines.push(`*${businessInfo.name || 'SILVER CATERING'}*`);
  lines.push(`_${businessInfo.subtitle || 'CATERING & EVENTS'}_`);
  lines.push('');
  lines.push(`*INVOICE: ${invoice.invoiceNumber || 'INV'}*`);
  if (invoice.quotationNumber) lines.push(`*Ref Quotation:* ${invoice.quotationNumber}`);
  lines.push('');
  lines.push(`*Customer:* ${invoice.customer?.name || ''}`);
  if (invoice.event?.eventDate) lines.push(`*Date:* ${invoice.event.eventDate}`);
  if (invoice.event?.totalPax) lines.push(`*PAX:* ${invoice.event.totalPax}`);
  if (invoice.event?.time) lines.push(`*Time:* ${invoice.event.time}`);
  if (invoice.customer?.place) lines.push(`*Place:* ${invoice.customer.place}`);
  lines.push('');
  lines.push('─────────────────');
  lines.push(`*TOTAL AMOUNT:* ${formatCurrency(invoice.customTotalAmount)}`);
  lines.push(`*ADVANCE PAID:* ${formatCurrency(invoice.advancePaid)}`);
  lines.push(`*BALANCE DUE:* ${formatCurrency(invoice.balanceDue)}`);
  lines.push(`*PAYMENT STATUS:* ${invoice.paymentStatus || 'PENDING'}`);
  lines.push('─────────────────');
  lines.push('');


  lines.push('Thank you for choosing Silver Catering.');
  if (businessInfo.phones && businessInfo.phones.length > 0) {
    lines.push(`📞 ${businessInfo.phones.join(' / ')}`);
  }

  return lines.join('\n');
}

export function getWhatsAppShareUrl(phoneNumber, message) {
  const cleanPhone = (phoneNumber || '').replace(/[^\d]/g, '');
  const encoded = encodeURIComponent(message);
  if (cleanPhone) {
    // If doesn't have 91 country code and is 10 digits, prepend 91 for Indian numbers
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}
