export type BillStatus = "draft" | "awaiting_approval" | "awaiting_payment" | "overdue" | "paid";

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  account: string;
  taxRate: number;
  amount: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  supplier: string;
  supplierBillCount: number; // how many bills from this supplier historically
  issueDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: BillStatus;
  lineItems: LineItem[];
  aiFlagged: boolean;
  aiReason?: string;
  riskLevel?: "low" | "medium" | "high";
}

// Helper
const bill = (
  id: string,
  billNumber: string,
  supplier: string,
  supplierBillCount: number,
  issueDate: string,
  dueDate: string,
  amount: number,
  status: BillStatus,
  lineItems: LineItem[],
  aiFlagged = false,
  aiReason?: string,
  riskLevel?: "low" | "medium" | "high"
): Bill => {
  const tax = Math.round(amount * 0.1 * 100) / 100;
  return {
    id,
    billNumber,
    supplier,
    supplierBillCount,
    issueDate,
    dueDate,
    amount,
    tax,
    total: Math.round((amount + tax) * 100) / 100,
    status,
    lineItems,
    aiFlagged,
    aiReason,
    riskLevel,
  };
};

const li = (description: string, quantity: number, unitPrice: number, account: string): LineItem => ({
  description,
  quantity,
  unitPrice,
  account,
  taxRate: 10,
  amount: Math.round(quantity * unitPrice * 100) / 100,
});

export const mockBills: Bill[] = [
  bill("1", "BILL-001", "Paper Plus Ltd", 12, "2026-01-15", "2026-02-15", 245.00, "paid", [li("A4 Copy Paper x20", 20, 12.25, "Office Supplies")]),
  bill("2", "BILL-002", "City Power Co", 24, "2026-01-20", "2026-02-20", 892.50, "paid", [li("Electricity - January", 1, 892.50, "Utilities")]),
  bill("3", "BILL-003", "Fresh Foods NZ", 8, "2026-01-22", "2026-02-22", 1340.00, "awaiting_payment", [li("Catering supplies", 1, 1340.00, "Food & Beverage")]),
  bill("4", "BILL-004", "WebHost Pro", 6, "2026-01-25", "2026-02-25", 199.00, "paid", [li("Monthly hosting", 1, 199.00, "IT & Software")]),
  bill("5", "BILL-005", "CleanRight Services", 15, "2026-02-01", "2026-03-01", 450.00, "awaiting_payment", [li("Office cleaning - Feb", 1, 450.00, "Facilities")]),
  bill("6", "BILL-006", "Paper Plus Ltd", 12, "2026-02-05", "2026-03-05", 310.00, "awaiting_approval", [li("Printer toner x5", 5, 62.00, "Office Supplies")]),
  bill("7", "BILL-007", "Metro Couriers", 10, "2026-02-07", "2026-03-07", 185.00, "awaiting_approval", [li("Courier deliveries", 5, 37.00, "Shipping")]),
  bill("8", "BILL-008", "City Power Co", 24, "2026-02-10", "2026-02-28", 945.00, "overdue", [li("Electricity - February", 1, 945.00, "Utilities")]),
  bill("9", "BILL-009", "Fresh Foods NZ", 8, "2026-02-12", "2026-03-12", 1120.00, "awaiting_approval", [li("Weekly catering order", 4, 280.00, "Food & Beverage")]),
  bill("10", "BILL-010", "TechSupply Direct", 3, "2026-02-14", "2026-03-14", 2850.00, "awaiting_approval", [li("Monitors x3", 3, 650.00, "Equipment"), li("Keyboard & mice x3", 3, 300.00, "Equipment")]),
  bill("11", "BILL-011", "CleanRight Services", 15, "2026-02-15", "2026-03-15", 450.00, "draft", [li("Office cleaning - Mar", 1, 450.00, "Facilities")]),
  bill("12", "BILL-012", "Metro Couriers", 10, "2026-02-16", "2026-03-16", 222.00, "draft", [li("Express deliveries", 6, 37.00, "Shipping")]),

  // AI-FLAGGED: First bill from new supplier, unusually high
  bill(
    "13", "BILL-013", "Quantum Consulting Group", 0, "2026-02-17", "2026-03-17", 18500.00, "awaiting_approval",
    [li("Strategic advisory services", 1, 12000.00, "Professional Services"), li("Market analysis report", 1, 6500.00, "Professional Services")],
    true,
    "First bill from this supplier. Amount is 2,478% higher than your average bill ($718). No prior transaction history to verify.",
    "high"
  ),
  bill(
    "14", "BILL-014", "Apex Security Solutions", 0, "2026-02-18", "2026-03-18", 7200.00, "awaiting_approval",
    [li("Security system installation", 1, 5500.00, "Equipment"), li("12-month monitoring", 1, 1700.00, "Services")],
    true,
    "First bill from this supplier. Amount is 903% higher than your average bill ($718). No prior transaction history to verify.",
    "high"
  ),
  bill(
    "15", "BILL-015", "GreenLeaf Office Plants", 0, "2026-02-19", "2026-03-19", 890.00, "awaiting_approval",
    [li("Indoor plant hire - quarterly", 1, 690.00, "Office Supplies"), li("Plant maintenance", 1, 200.00, "Facilities")],
    true,
    "First bill from this supplier. Amount is 24% higher than your average bill ($718). Low risk but flagged as first-time supplier.",
    "low"
  ),
];

export const getAverageBillAmount = (): number => {
  const nonFlaggedBills = mockBills.filter((b) => !b.aiFlagged);
  return Math.round(nonFlaggedBills.reduce((sum, b) => sum + b.amount, 0) / nonFlaggedBills.length);
};

export const getBillsByStatus = (status: BillStatus): Bill[] =>
  mockBills.filter((b) => b.status === status);

export const getFlaggedBills = (): Bill[] =>
  mockBills.filter((b) => b.aiFlagged);

export const getBillById = (id: string): Bill | undefined =>
  mockBills.find((b) => b.id === id);
