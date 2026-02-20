

# Simplify Bills Dashboard to Match Xero's Design

## What Changes

Remove the AI Anomaly Detection section and the three summary cards (Total Bills, Total Amount, AI Flagged) from the dashboard. Replace them with a Xero-style filter/search bar matching the screenshot:

- A search input ("Enter a contact, amount, or reference")
- Start date and End date picker fields
- A "Date type" dropdown (defaulting to "Any date")
- Filter and Columns buttons on the right
- A subtle summary line below: "X items | $Y,YYY.YY NZD"

The status tabs and bills table remain unchanged, including the "AI Flagged" badge on individual rows.

## Technical Details

### `src/pages/Index.tsx`
- Remove the entire summary cards grid (Total Bills, Total Amount, AI Flagged)
- Remove the entire "AI Flagged Bills" card section with the flagged bill cards
- Remove imports for `BrainCircuit`, `ShieldAlert` (keep `Sparkles` for the table badge)
- Add a search/filter bar above the tabs section matching the Xero screenshot:
  - Search input with a search icon
  - Start date and End date inputs (visual only, no real filtering needed)
  - Date type select dropdown
  - Filter and Columns buttons
  - Summary text showing item count and total amount
- Keep the tabs + table section exactly as-is

