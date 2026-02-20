import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Sparkles, ShieldAlert } from "lucide-react";
import XeroHeader from "@/components/XeroHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { mockBills, getBillsByStatus, getFlaggedBills, type BillStatus } from "@/data/bills";

const statusTabs: { value: BillStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "awaiting_approval", label: "Awaiting Approval" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "overdue", label: "Overdue" },
  { value: "paid", label: "Paid" },
];

const statusBadge = (status: BillStatus) => {
  const map: Record<BillStatus, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
    awaiting_approval: { label: "Awaiting Approval", className: "bg-xero-blue/10 text-xero-blue" },
    awaiting_payment: { label: "Awaiting Payment", className: "bg-amber-100 text-amber-800" },
    overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
    paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
  };
  const s = map[status];
  return <Badge className={`${s.className} border-0 font-medium`}>{s.label}</Badge>;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(n);

const Index = () => {
  const [tab, setTab] = useState<string>("all");
  const navigate = useNavigate();

  const bills = tab === "all" ? mockBills : getBillsByStatus(tab as BillStatus);
  const flagged = getFlaggedBills();
  const totalAmount = mockBills.reduce((s, b) => s + b.total, 0);

  return (
    <div className="min-h-screen bg-secondary">
      <XeroHeader />
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border p-5">
            <p className="text-sm text-muted-foreground">Total Bills</p>
            <p className="text-2xl font-semibold mt-1">{mockBills.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-5">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-semibold mt-1">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-card rounded-lg border p-5 border-xero-warning/30 bg-gradient-to-br from-xero-warning/5 to-transparent">
            <p className="text-sm text-xero-warning flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4" /> AI Flagged
            </p>
            <p className="text-2xl font-semibold mt-1">{flagged.length}</p>
          </div>
        </div>

        {/* AI Flagged Bills Section */}
        {flagged.length > 0 && (
          <div className="mb-6 bg-card rounded-lg border">
            <div className="px-5 py-4 border-b flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-xero-blue" />
              <h2 className="font-semibold text-base">AI Anomaly Detection</h2>
              <Badge className="bg-xero-warning/15 text-xero-warning border-xero-warning/30 ml-auto text-xs">
                {flagged.length} flagged
              </Badge>
            </div>
            <div className="p-4 grid gap-3">
              {flagged.map((bill) => (
                <div
                  key={bill.id}
                  onClick={() => navigate(`/bill/${bill.id}`)}
                  className={`cursor-pointer rounded-lg border p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors border-l-4 ${
                    bill.riskLevel === "high"
                      ? "border-l-destructive"
                      : bill.riskLevel === "medium"
                      ? "border-l-xero-warning"
                      : "border-l-yellow-400"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {bill.riskLevel === "high" ? (
                      <ShieldAlert className="h-5 w-5 text-destructive animate-pulse-subtle" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-xero-warning animate-pulse-subtle" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-xero-blue">{bill.billNumber}</span>
                      <span className="text-sm text-foreground">{bill.supplier}</span>
                      <Badge className={`border-0 text-xs ${
                        bill.riskLevel === "high" ? "bg-red-100 text-red-700" : bill.riskLevel === "medium" ? "bg-amber-100 text-amber-700" : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {bill.riskLevel} risk
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{bill.aiReason}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold">{formatCurrency(bill.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs + Table */}
        <div className="bg-card rounded-lg border">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="border-b px-4 pt-3">
              <TabsList className="bg-transparent gap-0 h-auto p-0">
                {statusTabs.map((t) => {
                  const count = t.value === "all" ? mockBills.length : getBillsByStatus(t.value).length;
                  return (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-xero-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 text-sm"
                    >
                      {t.label} <span className="ml-1.5 text-muted-foreground text-xs">({count})</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <TabsContent value={tab} className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px]">Due Date</TableHead>
                    <TableHead>Bill #</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow
                      key={bill.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/bill/${bill.id}`)}
                    >
                      <TableCell className="text-sm">{bill.dueDate}</TableCell>
                      <TableCell className="font-medium text-xero-blue">{bill.billNumber}</TableCell>
                      <TableCell>{bill.supplier}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(bill.total)}</TableCell>
                      <TableCell>{statusBadge(bill.status)}</TableCell>
                      <TableCell>
                        {bill.aiFlagged && (
                          <Badge className="bg-xero-warning/15 text-xero-warning border-xero-warning/30 gap-1 animate-pulse-subtle">
                            <Sparkles className="h-3 w-3" /> AI Flagged
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {bills.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No bills found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
