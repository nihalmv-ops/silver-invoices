export function formatCurrency(value) {
  if (value === undefined || value === null || value === '' || isNaN(Number(value))) {
    return '₹ 0';
  }
  const num = Number(value);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(num);
  return `₹ ${formatted}`;
}

export function parseCurrency(input) {
  if (typeof input === 'number') return Math.max(0, input);
  if (!input) return 0;
  // Remove non-digits
  const cleaned = String(input).replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function getTodayFormatted() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatDateForDisplay(dateStr) {
  if (!dateStr) return '';
  // If already in DD.MM.YYYY or similar format, return it
  if (dateStr.includes('.')) return dateStr;
  // If in YYYY-MM-DD format from datepicker:
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
  }
  return dateStr;
}

