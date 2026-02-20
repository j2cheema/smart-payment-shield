import { Link, useLocation } from "react-router-dom";
import { FileText, Brain } from "lucide-react";

const XeroHeader = () => {
  const location = useLocation();

  return (
    <header className="bg-xero-navy text-xero-navy-foreground">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Xero <span className="text-xero-blue text-xs font-normal ml-1 bg-xero-blue/20 px-2 py-0.5 rounded-full">AI Prototype</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                location.pathname === "/" || location.pathname.startsWith("/bill/")
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="h-4 w-4" />
              Bills
            </Link>
            <Link
              to="/insights"
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                location.pathname === "/insights"
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Brain className="h-4 w-4" />
              AI Insights
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">Demo Organisation</span>
        </div>
      </div>
      {(location.pathname === "/" || location.pathname.startsWith("/bill/")) && (
        <div className="bg-white/5 px-6 py-2 text-sm text-white/70">
          Business &rsaquo; <span className="text-white">Bills</span>
        </div>
      )}
      {location.pathname === "/insights" && (
        <div className="bg-white/5 px-6 py-2 text-sm text-white/70">
          Business &rsaquo; <span className="text-white">AI Insights</span>
        </div>
      )}
    </header>
  );
};

export default XeroHeader;
