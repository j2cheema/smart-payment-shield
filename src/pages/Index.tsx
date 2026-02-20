import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Search, Filter, Columns3 } from "lucide-react";
import XeroHeader from "@/components/XeroHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const navigate = useNavigate();

  const flaggedCount = getFlaggedBills().length;
  const baseBills = tab === "all" ? mockBills : getBillsByStatus(tab as BillStatus);
  const bills = showFlaggedOnly ? baseBills.filter((b) => b.aiFlagged) : baseBills;
  const totalAmount = baseBills.reduce((s, b) => s + b.total, 0);

  const handleTabChange = (value: string) => {
    setTab(value);
    setShowFlaggedOnly(false);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <XeroHeader />
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Search & Filter Bar */}
        <div className="bg-card rounded-lg border p-4 mb-4">
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter a contact, amount, or reference"
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <div className="w-[140px]">
              <label className="text-xs text-muted-foreground mb-1 block">Start date</label>
              <Input type="date" className="h-9 text-sm" />
            </div>
            <div className="w-[140px]">
              <label className="text-xs text-muted-foreground mb-1 block">End date</label>
              <Input type="date" className="h-9 text-sm" />
            </div>
            <div className="w-[150px]">
              <label className="text-xs text-muted-foreground mb-1 block">Date type</label>
              <Select defaultValue="any">
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any date</SelectItem>
                  <SelectItem value="due">Due date</SelectItem>
                  <SelectItem value="planned">Planned date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Columns3 className="h-3.5 w-3.5" /> Columns
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {baseBills.length} items | {formatCurrency(totalAmount)} NZD
            {flaggedCount > 0 && (
              <>
                {" | "}
                <span
                  onClick={() => setShowFlaggedOnly((v) => !v)}
                  className={`inline-flex items-center gap-1 cursor-pointer hover:underline ${
                    showFlaggedOnly ? "text-xero-warning font-semibold" : "text-xero-warning"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  {flaggedCount} AI flagged
                </span>
              </>
            )}
            {showFlaggedOnly && (
              <span className="ml-2 text-muted-foreground">
                (showing {bills.length} flagged)
              </span>
            )}
          </p>
        </div>

        {/* Tabs + Table */}
        <div className="bg-card rounded-lg border">
          <Tabs value={tab} onValueChange={handleTabChange}>
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
