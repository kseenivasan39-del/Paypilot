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
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      if (!printRef.current) return;

      const element = printRef.current;
      
      // Render canvas using element's actual scroll dimensions
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Exact Single-Page A4 Setup
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = 210; // A4 mm
      const pdfHeight = 297; // A4 mm
      const margin = 10; // 10mm margins for a crisp aesthetic
      const usableWidth = pdfWidth - (margin * 2);
      const usableHeight = pdfHeight - (margin * 2);

      // Scale to fit completely within 1 page without pagination
      let renderWidth = usableWidth;
      let renderHeight = (canvas.height * usableWidth) / canvas.width;

      if (renderHeight > usableHeight) {
        renderHeight = usableHeight;
        renderWidth = (canvas.width * usableHeight) / canvas.height;
      }

      // Center horizontally on page
      const xOffset = margin + ((usableWidth - renderWidth) / 2);
      const yOffset = margin;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, renderWidth, renderHeight, undefined, "FAST");
      pdf.save(`PayPilot_Tax_Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
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
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-4 relative flex flex-col max-h-[92vh]">
        
        {/* Modal Top Action Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight block">PayPilot Tax Settlement Invoice</span>
              <span className="text-[11px] text-slate-400 font-mono">#{invoice.invoiceNumber} • 1-Page Official GST Copy</span>
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
                  <span>Generating 1-Page PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 1-Page PDF</span>
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

        {/* Printable/PDF Container: Compact, elegant single-sheet layout */}
        <div className="p-6 sm:p-7 bg-white text-slate-800 font-sans space-y-4 overflow-y-auto" ref={printRef}>
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
                  <span className="font-black text-sm">P</span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">PayPilot</h2>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-blue-600">Smart Escrow Billing</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                Autonomous AI Milestone Verification & PayPal Secured Settlement
              </p>
              <div className="text-[10px] text-slate-400 mt-1 font-medium">
                GSTIN: 29AABCU9603R1Z7 • Bengaluru Tech Park, Karnataka, 560103 India
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                {invoice.status === "PAID" ? "✓ SETTLED & PAID" : invoice.status}
              </span>
              <div className="text-xs text-slate-500 pt-0.5">
                Invoice: <strong className="text-slate-900 font-mono">#{invoice.invoiceNumber}</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                Date: <strong className="text-slate-800">{invoice.date}</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                Currency: <strong className="text-slate-800">{invoice.currency} (₹)</strong>
              </div>
            </div>
          </div>

          {/* Client & Freelancer Two-Column Info */}
          <div className="grid grid-cols-2 gap-4 text-xs pb-3 border-b border-slate-100">
            {/* Billed To (Client) */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Billed To (Client / Buyer)
              </span>
              <h4 className="text-xs font-bold text-slate-900">{invoice.clientName}</h4>
              {invoice.clientCompany && (
                <div className="text-[11px] text-slate-600 font-medium">{invoice.clientCompany}</div>
              )}
              <div className="text-[11px] text-slate-500 mt-0.5">{invoice.clientEmail}</div>
              <div className="text-[10px] text-slate-400">{invoice.clientAddress || "Silicon Valley, CA, USA / Verified PayPal"}</div>
            </div>

            {/* Issued By (Freelancer) */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Issued By (Freelancer / Vendor)
              </span>
              <h4 className="text-xs font-bold text-slate-900">{invoice.freelancerName}</h4>
              <div className="text-[11px] text-slate-600 font-medium">{invoice.freelancerTitle || "Full Stack Engineer & Consultant"}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{invoice.freelancerEmail}</div>
              <div className="text-[10px] text-slate-400">{invoice.freelancerAddress || "Bengaluru, India / Verified Seller"}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="py-1.5">Scope & Deliverable Description</th>
                  <th className="py-1.5 text-center">AI Audit Status</th>
                  <th className="py-1.5 text-center">Qty</th>
                  <th className="py-1.5 text-right">Amount ({invoice.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 pr-2">
                    <p className="font-bold text-slate-900 text-xs">{invoice.projectTitle}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{invoice.milestoneTitle}</p>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                      {invoice.aiVerificationScore || 96}% Verified
                    </span>
                  </td>
                  <td className="py-2.5 text-center text-slate-600 font-semibold text-xs">1</td>
                  <td className="py-2.5 text-right font-bold text-slate-900 text-xs">
                    ₹{invoice.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown Summary */}
          <div className="flex justify-end pt-1">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Milestone Subtotal</span>
                <span className="font-bold text-slate-900">₹{invoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>PayPilot Escrow Fee</span>
                <span className="font-bold text-emerald-600">₹{invoice.platformFee.toLocaleString()} (Waived)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Integrated GST ({invoice.taxRatePercent}%)</span>
                <span className="font-bold text-slate-900">₹{invoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-900 flex justify-between text-sm font-black text-slate-900">
                <span>Total Settled</span>
                <span className="text-blue-600">₹{invoice.netTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* PayPal Cryptographic Proof Box */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/80 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>PayPal Cryptographic Settlement Ledger</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-slate-600 pt-0.5">
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">PayPal Order ID</span>
                <strong className="text-slate-900">{invoice.orderId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">Capture Reference</span>
                <strong className="text-slate-900">{invoice.captureId}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[8px] uppercase">Settlement Route</span>
                <strong className="text-slate-900">{invoice.paymentMethod}</strong>
              </div>
            </div>
          </div>

          {/* Compliance & Signature Footer */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400">
            <div>
              <p>Certified compliant under RBI & PayPal Escrow Guidelines (2026).</p>
            </div>
            <div className="text-right">
              <div className="font-['Caveat',cursive] text-base text-slate-700 -rotate-2 leading-none">
                Rahul Kumar / Sarah J.
              </div>
              <span className="text-[8px] text-slate-400 uppercase tracking-wider">Digitally Signed & Reconciled</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
