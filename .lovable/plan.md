
# Add Clickable "AI Flagged" Count & Smarter Flagging Logic

## What Changes

### 1. Clickable AI Flagged count in summary line
The summary text currently reads `15 items | $X NZD`. This will become:

`15 items | $X NZD | 2 AI flagged`

The "2 AI flagged" text will be styled as a clickable link with the Sparkles icon. Clicking it filters the table to show only AI-flagged bills. Clicking it again (or switching tabs) clears the filter.

### 2. Smarter flagging threshold
Currently, BILL-015 (GreenLeaf Office Plants, $890) is flagged even though it's only 24% above average -- that's not anomalous. The flagging will be updated so only bills significantly higher than the average (200%+ above) get flagged. This means:
- **BILL-013** (Quantum Consulting, $18,500 -- 2,478% higher): Still flagged, high risk
- **BILL-014** (Apex Security, $7,200 -- 903% higher): Still flagged, high risk
- **BILL-015** (GreenLeaf, $890 -- 24% higher): **No longer flagged** -- too close to average

---

## Technical Details

### `src/data/bills.ts`
- Remove the `aiFlagged`, `aiReason`, and `riskLevel` from BILL-015 (GreenLeaf Office Plants) by setting `aiFlagged` to `false` and removing the reason/risk fields
- This leaves only 2 genuinely anomalous bills flagged

### `src/pages/Index.tsx`
- Add a `showFlaggedOnly` boolean state
- Import `getFlaggedBills` from data
- Compute `flaggedCount` from `getFlaggedBills().length`
- When `showFlaggedOnly` is true, filter the displayed bills to only those with `aiFlagged === true`
- Update the summary line to append `| {flaggedCount} AI flagged` as a clickable span with the Sparkles icon
- Clicking the span toggles `showFlaggedOnly`; switching tabs resets it to false
- Style the clickable text with `text-xero-warning cursor-pointer hover:underline` and highlight it when active
