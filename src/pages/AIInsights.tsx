import { Link } from "react-router-dom";
import { AlertTriangle, TrendingUp, ShieldAlert, Info } from "lucide-react";
import XeroHeader from "@/components/XeroHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getFlaggedBills, getAverageBillAmount, mockBills } from "@/data/bills";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(n);

const riskColor = (level: string) => {
  if (level === "high") return "bg-red-100 text-red-700";
  if (level === "medium") return "bg-amber-100 text-amber-700";
  return "bg-yellow-50 text-yellow-700";
};

const riskProgress = (level: string) => {
  if (level === "high") return 90;
  if (level === "medium") return 55;
  return 25;
};

const AIInsights = () => {
  const flagged = getFlaggedBills();
  const avg = getAverageBillAmount();
  const totalBills = mockBills.length;
  const newSuppliers = mockBills.filter((b) => b.supplierBillCount === 0).length;

  return (
    <div className="min-h-screen bg-secondary">
      <XeroHeader />
      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-xero-blue" /> AI Anomaly Detection
          </h1>
          <p className="text-muted-foreground mt-1">
            Automatically flags first-time supplier bills with unusually high amounts
          </p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">Average Bill</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(avg)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">Total Bills</p>
              <p className="text-2xl font-bold mt-1">{totalBills}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">New Suppliers</p>
              <p className="text-2xl font-bold mt-1">{newSuppliers}</p>
            </CardContent>
          </Card>
          <Card className="border-xero-warning/30">
            <CardContent className="pt-5">
              <p className="text-sm text-xero-warning flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Flagged</p>
              <p className="text-2xl font-bold mt-1">{flagged.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Info className="h-4 w-4 text-xero-blue" /> How Detection Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>We calculate your historical average bill amount from existing supplier transactions.</li>
              <li>When a bill arrives from a supplier you've <strong>never transacted with before</strong>, we compare its amount to your average.</li>
              <li>If the amount significantly exceeds the average, the bill is flagged with a risk level based on the deviation.</li>
              <li>Flagged bills require explicit approval or can be sent for additional review before payment.</li>
            </ol>
          </CardContent>
        </Card>

        {/* Flagged bills detail */}
        <h2 className="text-lg font-semibold mb-4">Flagged Bills</h2>
        <div className="space-y-4">
          {flagged.map((bill) => {
            const pct = Math.round(((bill.amount - avg) / avg) * 100);
            return (
              <Card key={bill.id} className="border-l-4 border-l-xero-warning">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link to={`/bill/${bill.id}`} className="font-semibold text-xero-blue hover:underline">{bill.billNumber}</Link>
                        <span className="text-foreground font-medium">{bill.supplier}</span>
                        <Badge className={`${riskColor(bill.riskLevel || "low")} border-0 text-xs`}>
                          {bill.riskLevel} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{bill.aiReason}</p>
                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Bill amount: </span>
                          <span className="font-semibold">{formatCurrency(bill.amount)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">vs Average: </span>
                          <span className="font-semibold">{formatCurrency(avg)}</span>
                        </div>
                        <div className="text-sm flex items-center gap-1 text-red-600">
                          <TrendingUp className="h-3.5 w-3.5" /> +{pct}%
                        </div>
                      </div>
                    </div>
                    <div className="w-32 ml-6">
                      <p className="text-xs text-muted-foreground mb-1.5 text-right">Risk Level</p>
                      <Progress
                        value={riskProgress(bill.riskLevel || "low")}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AIInsights;
