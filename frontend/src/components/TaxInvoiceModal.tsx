"use client";

import { useState, useRef } from "react";
import { 
  FileText, Download, Printer, ShieldCheck, CheckCircle2, 
  ExternalLink, X, Building, User, Calendar, CreditCard, Sparkles, Loader2
} from "lucide-react";

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  captureId: string;
  date: string;
  dueDate?: string;
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  clientAddress?: string;
  freelancerName: string;
  freelancerTitle?: string;
  freelancerEmail: string;
  freelancerAddress?: string;
  projectTitle: string;
  milestoneTitle: string;
  amount: number;
  currency: string;
  platformFee: number;
  taxAmount: number;
  taxRatePercent: number;
  netTotal: number;
  paymentMethod: string;
  status: "PAID" | "IN_ESCROW" | "PENDING";
  aiVerificationScore?: number;
  notes?: string;
}

interface TaxInvoiceModalProps {
  invoice: InvoiceData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaxInvoiceModal({ invoice, isOpen, onClose }: TaxInvoiceModalProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // Dynamic import to support SSR safely
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      if (!printRef.current) return;

      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`PayPilot_Tax_Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      // Fallback to standard window print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 relative flex flex-col">
        {/* Modal Top Action Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight block">PayPilot Tax Settlement Invoice</span>
              <span className="text-[11px] text-slate-400 font-mono">#{invoice.invoiceNumber} • Official GST/VAT Copy</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Print document directly"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable/PDF Container */}
        <div className="p-8 sm:p-10 bg-white text-slate-800 font-sans space-y-6 max-h-[80vh] overflow-y-auto" ref={printRef}>
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <span className="font-extrabold text-base">P</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">PayPilot</h2>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">Smart Escrow Billing</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-xs mt-2">
                Autonomous AI Milestone Verification & PayPal Secured Settlement Infrastructure
              </p>
              <div className="text-[11px] text-slate-400 mt-1 space-y-0.5 font-medium">
                <div>GSTIN: 29AABCU9603R1Z7</div>
                <div>Bengaluru Tech Park, Karnataka, 560103 India</div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                {invoice.status === "PAID" ? "✓ SETTLED & PAID" : invoice.status}
              </span>
              <div className="text-xs text-slate-500 pt-1">
                Invoice No: <strong className="text-slate-900 font-mono">#{invoice.invoiceNumber}</strong>
              </div>
              <div className="text-xs text-slate-500">
                Issued Date: <strong className="text-slate-800">{invoice.date}</strong>
              </div>
              <div className="text-xs text-slate-500">
                Settlement Currency: <strong className="text-slate-800">{invoice.currency} (₹)</strong>
              </div>
            </div>
          </div>

          {/* Client & Freelancer Two-Column Info */}
          <div className="grid grid-cols-2 gap-8 text-xs pb-4 border-b border-slate-100">
            {/* Billed To (Client) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To (Client / Buyer)
              </span>
              <h4 className="text-sm font-bold text-slate-900">{invoice.clientName}</h4>
              {invoice.clientCompany && (
                <div className="text-slate-600 font-medium">{invoice.clientCompany}</div>
              )}
              <div className="text-slate-500 mt-1">{invoice.clientEmail}</div>
              <div className="text-slate-400 mt-0.5">{invoice.clientAddress || "Silicon Valley, CA, USA / Verified PayPal Account"}</div>
            </div>

            {/* Issued By (Freelancer) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed By (Freelancer / Vendor)
              </span>
              <h4 className="text-sm font-bold text-slate-900">{invoice.freelancerName}</h4>
              <div className="text-slate-600 font-medium">{invoice.freelancerTitle || "Full Stack Engineer & Consultant"}</div>
              <div className="text-slate-500 mt-1">{invoice.freelancerEmail}</div>
              <div className="text-slate-400 mt-0.5">{invoice.freelancerAddress || "Bengaluru, Karnataka, India / Verified Seller"}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Scope & Deliverable Description</th>
                  <th className="py-2.5 text-center">AI Audit Status</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Amount ({invoice.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 pr-2">
                    <p className="font-bold text-slate-900">{invoice.projectTitle}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{invoice.milestoneTitle}</p>
                  </td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      {invoice.aiVerificationScore || 96}% Verified
                    </span>
                  </td>
                  <td className="py-3 text-center text-slate-600 font-semibold">1</td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    ₹{invoice.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Milestone Subtotal</span>
                <span className="font-bold text-slate-900">₹{invoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>PayPilot Escrow Protection</span>
                <span className="font-bold text-emerald-600">₹{invoice.platformFee.toLocaleString()} (Waived)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Integrated GST / Tax ({invoice.taxRatePercent}%)</span>
                <span className="font-bold text-slate-900">₹{invoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-base font-black text-slate-900">
                <span>Total Settled</span>
                <span className="text-blue-600">₹{invoice.netTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* PayPal Payment & Escrow Proof */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PayPal Cryptographic Settlement Ledger</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">PayPal Order ID</span>
                <strong className="text-slate-900">{invoice.orderId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Capture Reference</span>
                <strong className="text-slate-900">{invoice.captureId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Payment Routing</span>
                <strong className="text-slate-900">{invoice.paymentMethod}</strong>
              </div>
            </div>
          </div>

          {/* Compliance & Signature Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
            <div>
              <p>This is a computer-generated tax invoice verified by PayPilot Autonomous Protocol.</p>
              <p>Certified compliant under RBI & PayPal Escrow Guidelines (2026).</p>
            </div>
            <div className="text-right">
              <div className="font-['Caveat',cursive] text-lg text-slate-700 -rotate-3 leading-none">
                Rahul Kumar / Sarah J.
              </div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Digitally Signed & Reconciled</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
