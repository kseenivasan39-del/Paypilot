"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminSettingsNav from "@/components/AdminSettingsNav";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { 
  CreditCard, Landmark, ArrowUpRight, DollarSign, 
  ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, 
  Building2, Wallet, Plus, Download, Sparkles
} from "lucide-react";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  status: "Primary Escrow" | "Operational" | "Secondary";
  balance: string;
}

export default function AdminTreasuryPage() {
  const [platformFeeRate, setPlatformFeeRate] = useState("3.0");
  const [autoSweepEnabled, setAutoSweepEnabled] = useState(true);
  const [sweepThreshold, setSweepThreshold] = useState("100000");
  const [taxWithholdingRate, setTaxWithholdingRate] = useState("1.0");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [bankAccounts] = useState<BankAccount[]>([
    {
      id: "bank_01",
      bankName: "HDFC Bank Corporate Custody",
      accountNumber: "•••• •••• •••• 8812",
      accountType: "Nodal Escrow Pool",
      currency: "INR (₹)",
      status: "Primary Escrow",
      balance: "₹1,428,500.00",
    },
    {
      id: "bank_02",
      bankName: "DBS Bank Singapore",
      accountNumber: "•••• •••• •••• 3319",
      accountType: "Cross-Border FX Liquidity",
      currency: "SGD / USD ($)",
      status: "Operational",
      balance: "$45,200.00",
    },
    {
      id: "bank_03",
      bankName: "Silicon Valley Bridge Bank",
      accountNumber: "•••• •••• •••• 0921",
      accountType: "PayPal Partner Clearing Account",
      currency: "USD ($)",
      status: "Secondary",
      balance: "$12,850.00",
    },
  ]);

  const handleSweepNow = () => {
    setActionSuccess("Initiated autonomous PayPal balance sweep to HDFC Nodal Escrow Account.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleSaveTreasury = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess("Treasury commission splits & sweep parameters updated successfully.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <AdminSidebar activeTab="treasury" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Utility Bar */}
        <div className="px-8 pt-4 pb-2 border-b border-slate-100 flex items-center justify-end gap-3 bg-white">
          <NotificationBell />
          <UserProfileMenu fallbackName="PayPilot Admin" fallbackRole="Admin" />
        </div>

        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Treasury & Liquidity
              </span>
              <span className="text-xs font-semibold text-slate-500">Corporate Bank Accounts & Settlement Pools</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Platform Payment Methods & Treasury</h1>
          </div>
          <button
            onClick={handleSweepNow}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Execute Balance Sweep</span>
          </button>
        </header>

        {/* Quick Horizontal Tab Bar for Easy Access */}
        <AdminSettingsNav />

        <div className="p-8 space-y-6 max-w-5xl">
          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Treasury Balances Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Custody Escrow</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">₹1,428,500</p>
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> 100% Reserve Backed
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fee Earnings (Net MTD)</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">₹42,855</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">3.0% protocol commission</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PayPal Sandbox Vault</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">₹42,500</p>
                <p className="text-[11px] text-amber-700 font-bold mt-0.5">Pending auto-sweep</p>
              </div>
            </div>
          </div>

          {/* Registered Corporate Accounts */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Corporate Settlement & Nodal Accounts</h2>
                <p className="text-xs text-slate-500 mt-0.5">Regulated banking nodes for handling escrow capture, payouts, and platform margin sweeps.</p>
              </div>
              <button
                type="button"
                onClick={() => alert("Corporate bank account addition requires dual-sign board resolution.")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link Corporate Bank</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {bankAccounts.map((acc) => (
                <div key={acc.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{acc.bankName}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                          acc.status === "Primary Escrow" ? "bg-emerald-100 text-emerald-800" :
                          acc.status === "Operational" ? "bg-blue-100 text-blue-800" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {acc.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 font-mono">{acc.accountNumber} • {acc.accountType}</p>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">Ledger Currency: {acc.currency}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{acc.balance}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Reconciled 10 mins ago</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Viewing audit statement for ${acc.bankName}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Treasury Sweep & Fee Preferences */}
          <form onSubmit={handleSaveTreasury} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Platform Treasury & Fee Settlement Policies</h2>
              <p className="text-xs text-slate-500 mt-0.5">Automate liquidity sweeps and configure protocol fee deductions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Platform Commission Fee (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={platformFeeRate}
                    onChange={(e) => setPlatformFeeRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Deducted automatically from principal amount on escrow release.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Statutory Tax Withholding / TDS (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={taxWithholdingRate}
                    onChange={(e) => setTaxWithholdingRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Section 194O compliance rate withheld for Indian freelancer disbursements.</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200/70 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">Automated Daily Liquidity Sweep</p>
                  <p className="text-xs text-slate-500 mt-0.5">Automatically transfer settled platform fee balances from PayPal merchant pool to Primary HDFC account at 23:59 UTC.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSweepEnabled}
                  onChange={(e) => setAutoSweepEnabled(e.target.checked)}
                  className="w-5 h-5 mt-1 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-xs flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Save Treasury Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
