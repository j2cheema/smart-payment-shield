

# Upgrade AI Flagged Bills Display

## What Changes

### 1. AI Flagged Section on Dashboard
Instead of mixing flagged bills into the main table with just a small badge, add a dedicated **"AI Flagged Bills"** section above the main bills table. This section will:
- Have a distinct header with an AI-themed icon (sparkles/brain) and title like "AI Anomaly Detection"
- Show flagged bills as prominent cards with risk level indicators, supplier name, amount, and the AI reason
- Each card is clickable and navigates to the bill detail
- Cards have a colored left border based on risk level (red for high, amber for medium, yellow for low)

### 2. Upgraded AI Icons
Replace the generic `AlertTriangle` warning icon with more AI-themed icons from Lucide:
- **`BrainCircuit`** for the main AI detection feature branding
- **`Sparkles`** for the AI flagged badge on individual bills
- **`ShieldAlert`** for high-risk indicators
- **`ScanSearch`** for the detection concept

These will be used across:
- The summary card (replacing AlertTriangle)
- The flagged section header
- Individual flagged bill badges in the table
- The Bill Detail page alert banner
- The AI Insights page

### 3. Visual Polish
- The AI Flagged summary card gets a subtle gradient or glow effect to stand out
- Flagged bill badges in the table use `Sparkles` icon with a slight animated pulse
- The dedicated flagged section uses a subtle background tint to differentiate it

---

## Technical Details

### Files Modified

**`src/pages/Index.tsx`**
- Import `BrainCircuit`, `Sparkles`, `ShieldAlert` from lucide-react
- Add a new "AI Flagged Bills" card section between the summary cards and the tabs/table
- This section only renders when there are flagged bills
- Each flagged bill renders as a horizontal card showing: risk badge, supplier, bill number, amount, and AI reason snippet
- Replace `AlertTriangle` with `Sparkles` in the table badge
- Add a subtle pulse animation class to the AI badge

**`src/pages/BillDetail.tsx`**
- Replace `AlertTriangle` with `BrainCircuit` in the AI alert banner
- Update the alert title icon to feel more AI-branded

**`src/pages/AIInsights.tsx`**
- Already uses `ShieldAlert` -- will also add `BrainCircuit` and `Sparkles` where appropriate

**`src/index.css`**
- Add a `pulse-subtle` keyframe animation for the AI badge glow effect

