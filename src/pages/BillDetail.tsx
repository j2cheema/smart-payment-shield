import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle2, Send } from "lucide-react";
import XeroHeader from "@/components/XeroHeader";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody, TableFooter } from "@/components/ui/table";
import { getBillById, getAverageBillAmount } from "@/data/bills";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(n);

const BillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const bill = getBillById(id || "");
  const avgAmount = getAverageBillAmount();
  const { toast } = useToast();
  const [actionTaken, setActionTaken] = useState<"approved" | "review" | null>(null);

  if (!bill) {
    return (
      <div className="min-h-screen bg-secondary">
        <XeroHeader />
        <main className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-muted-foreground">Bill not found.</p>
          <Link to="/" className="text-xero-blue hover:underline mt-2 inline-block">Back to bills</Link>
        </main>
      </div>
    );
  }

  const percentHigher = Math.round(((bill.amount - avgAmount) / avgAmount) * 100);

  const handleApprove = () => {
    setActionTaken("approved");
    toast({ title: "Bill approved", description: `${bill.billNumber} has been approved for payment.` });
  };

  const handleReview = () => {
    setActionTaken("review");
    toast({ title: "Review requested", description: `A review request has been sent for ${bill.billNumber}.` });
  };

  return (
    <div className="min-h-screen bg-secondary">
      <XeroHeader />
      <main className="max-w-4xl mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to bills
        </Link>

        {/* AI Alert */}
        {bill.aiFlagged && !actionTaken && (
          <Alert className="mb-6 border-xero-warning/40 bg-xero-warning/5">
            <AlertTriangle className="h-5 w-5 text-xero-warning" />
            <AlertTitle className="text-base font-semibold flex items-center gap-2">
              AI Anomaly Detected
              <Badge className={`text-xs border-0 ${bill.riskLevel === "high" ? "bg-red-100 text-red-700" : bill.riskLevel === "medium" ? "bg-amber-100 text-amber-700" : "bg-yellow-50 text-yellow-700"}`}>
                {bill.riskLevel} risk
              </Badge>
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p className="text-sm">{bill.aiReason}</p>
              <div className="flex gap-6 text-sm">
                <div className="bg-card rounded-md border px-4 py-3">
                  <p className="text-muted-foreground text-xs">Your average bill</p>
                  <p className="text-lg font-semibold">{formatCurrency(avgAmount)}</p>
                </div>
                <div className="bg-card rounded-md border px-4 py-3">
                  <p className="text-muted-foreground text-xs">This bill</p>
                  <p className="text-lg font-semibold">{formatCurrency(bill.amount)}</p>
                </div>
                <div className="bg-card rounded-md border px-4 py-3">
                  <p className="text-muted-foreground text-xs">Difference</p>
                  <p className="text-lg font-semibold text-red-600">+{percentHigher}%</p>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button onClick={handleApprove} className="bg-xero-blue hover:bg-xero-blue/90">
                  <CheckCircle2 className="h-4 w-4" /> Approve Anyway
                </Button>
                <Button onClick={handleReview} variant="outline">
                  <Send className="h-4 w-4" /> Request Review
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {actionTaken && (
          <Alert className="mb-6 border-xero-success/40 bg-xero-success/5">
            <CheckCircle2 className="h-5 w-5 text-xero-success" />
            <AlertTitle>
              {actionTaken === "approved" ? "Bill Approved" : "Review Requested"}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {actionTaken === "approved"
                ? "This bill has been approved for payment despite the AI flag."
                : "A review request has been sent to the approving manager."}
            </AlertDescription>
          </Alert>
        )}

        {/* Bill header */}
        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-semibold">{bill.billNumber}</h1>
                <p className="text-muted-foreground mt-0.5">{bill.supplier}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatCurrency(bill.total)}</p>
                <p className="text-xs text-muted-foreground">incl. {formatCurrency(bill.tax)} GST</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 mt-6 text-sm">
              <div>
                <p className="text-muted-foreground">Issue Date</p>
                <p className="font-medium">{bill.issueDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="font-medium">{bill.dueDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Supplier Bill History</p>
                <p className="font-medium">{bill.supplierBillCount === 0 ? "No prior bills" : `${bill.supplierBillCount} previous bills`}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{bill.status.replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>

          {/* Line items */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bill.lineItems.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.account}</TableCell>
                  <TableCell className="text-right">{item.taxRate}%</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-medium">Subtotal</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(bill.amount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-medium">GST (10%)</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(bill.tax)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right text-base font-bold">Total</TableCell>
                <TableCell className="text-right text-base font-bold">{formatCurrency(bill.total)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default BillDetail;
