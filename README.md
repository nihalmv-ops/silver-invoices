# SILVER CATERING — Quotation & Invoice Management System

A catering event quotation and invoice management web application built for **SILVER CATERING (Catering & Events)** ([www.silvercatering.in](https://www.silvercatering.in/)).

---

## Features

- **Official Brand Identity**:
  - Official Silver Catering cloche logo from `www.silvercatering.in`.
  - Brand typography matching `Playfair Display` serif and `Outfit` sans.
  - Official contact ribbons and office address in Valanchery.

- **Full A4 Size Cover Model**:
  - Perimeter luxury border frame (Forest Emerald `#153120` and Gold `#9d8050`).
  - Subtle central cloche watermark for authentic custom bond-paper aesthetic.
  - Sized for standard A4 portrait printing and PDF export with zero clipping.

- **High-Capacity 2-Column Menu Inclusions Grid**:
  - Balanced 2-column item grid accommodating 30 to 45+ items on a single A4 page.
  - Optional 1-column table mode and compact density toggle.
  - Numbered items (`01.`, `02.`...), uppercase titles, and quantity/unit tags (`80 KG`, `1,200 PLATE`) or `INCLUDED`.

- **Lump-Sum Pricing & Estimation**:
  - Quotation package price labeled **"Estimated Cost"** without disclosing individual item rates or unit costs.
  - Single custom package total input.

- **Invoice Conversion & Financial Reconciliation**:
  - 1-click conversion from Quotation to Invoice (`INV-0001`).
  - 3-card financial breakdown: **Total Package Amount**, **Advance Received**, and **Net Balance Due**.
  - Dynamic payment status badges: `PAID`, `PARTIALLY PAID`, and `PENDING`.
  - Bank details are strictly excluded from printed documents.

- **Instant Sharing & Printing**:
  - 1-click WhatsApp message generator with customer details and itemized inclusions.
  - Print / Save to PDF formatted for standard A4 portrait printers.
  - Offline-first data persistence with browser `localStorage`.

---

## Tech Stack

- **React 18**
- **JavaScript (ES Modules)**
- **Vite**
- **CSS3** (Custom Design Tokens, Print `@media print`, Flexbox, CSS Grid)
- **Lucide React** (Vector Icons)
- **Oxlint** (Fast Linter)

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
# Clone repository
git clone https://github.com/nihalmv-ops/silver-invoices.git
cd silver-invoices

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

### Run Linter

```bash
npm run lint
```
