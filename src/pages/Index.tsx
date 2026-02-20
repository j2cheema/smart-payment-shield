import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
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
          <div className="bg-card rounded-lg border p-5 border-xero-warning/30">
            <p className="text-sm text-xero-warning flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> AI Flagged
            </p>
            <p className="text-2xl font-semibold mt-1">{flagged.length}</p>
          </div>
        </div>

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
                          <Badge className="bg-xero-warning/15 text-xero-warning border-xero-warning/30 gap-1">
                            <AlertTriangle className="h-3 w-3" /> AI Flagged
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
