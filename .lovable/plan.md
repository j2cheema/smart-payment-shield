

# Xero AI Bills Prototype — Anomalous First Bill Detection

An interactive prototype that mimics Xero's bill management UI and showcases an AI-powered feature: flagging unusually high first-time supplier invoices for additional approval.

---

## Pages & Navigation

### 1. Bills Dashboard (Home)
- Mimics Xero's bills list view from your first screenshot
- Top navigation bar styled like Xero (dark navy, "Business > Bills" breadcrumb)
- Tab bar: **Draft | Awaiting Approval | Awaiting Payment | Overdue | Paid**
- Table of bills showing: Due Date, Bill #, From (supplier), Amount, Status
- Bills flagged by AI get a visual indicator — an orange/amber "⚠ AI Flagged" badge
- Summary stats at the top (total bills, total amount, flagged count)

### 2. Bill Detail View
- Clicking a bill opens a detailed view matching your second screenshot
- Shows full bill info: supplier, date, due date, line items, amounts, tax
- For **AI-flagged bills**, a prominent alert banner appears at the top explaining:
  - "This is the first bill from this supplier and the amount is significantly higher than your typical bills"
  - Shows comparison: "Your average bill: $X | This bill: $Y (Z% higher)"
  - Two action buttons: **Approve Anyway** and **Request Review**

### 3. AI Insights Panel
- A dedicated section/page showing the AI detection logic in action
- Lists all new suppliers with their first bill amounts vs. the account's average
- Visual risk indicator (low / medium / high) for each flagged bill
- Provides a clear explanation of why each bill was flagged

---

## Mock Data
- ~15 pre-built bills from various suppliers with realistic amounts
- 2-3 bills from brand-new suppliers with unusually high amounts (flagged by AI)
- Historical average bill amount calculated from the rest of the data
- Supplier profiles with bill history counts

## Interactions
- Click through bills list → bill detail
- Approve or request review on flagged bills (updates status in-app)
- Filter/tab between bill statuses
- Flagged bills visually stand out in the list

## Design
- Xero's color palette: dark navy header (#1B2A4A), white content area, blue accent (#0078C8)
- Clean, professional typography matching Xero's style
- Subtle AI indicators that feel native to the Xero experience, not bolted on

