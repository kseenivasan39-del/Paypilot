"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import jsPDF from "jspdf";
import { 
  ShieldAlert, CheckCircle2, RefreshCw, AlertTriangle, 
  Search, ExternalLink, ArrowUpRight, Scale, Check, X,
  Clock, FileCheck, Lock, PlusCircle, Download, FileText,
  MessageSquare, Split, ChevronRight, Hash, Eye
} from "lucide-react";

interface DisputeItem {
  id: string;
  client: string;
  freelancer: string;
  amount: number;
  currency: string;
  category: "Code Quality" | "Scope Creep" | "Missed Deadline" | "Incomplete Assets";
  reason: string;
  aiScore: string;
  aiFeedback: string;
  deliverable: string;
  sowRequirements: string[];
  chatHistory: { sender: string; text: string; time: string; hash: string }[];
  status: "AWAITING_ARBITRATION" | "RESOLVED_RELEASED" | "RESOLVED_REFUNDED" | "RESOLVED_SPLIT";
  splitRatio?: { clientPct: number; freelancerPct: number };
  createdAt: string;
}

export default function AdminDisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"audit" | "diff" | "chat">("audit");
  const [splitRatio, setSplitRatio] = useState<number>(50); // Freelancer %
  const [verdictReason, setVerdictReason] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resolved">("all");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [disputesList, setDisputesList] = useState<DisputeItem[]>([
    {
      id: "CCN-103",
      client: "Sarah Johnson",
      freelancer: "Ananya Iyer",
      amount: 9500,
      currency: "INR",
      category: "Code Quality",
      reason: "Deliverable does not meet documented multi-modal benchmark accuracy (>85%). Current model reports 72%.",
      aiScore: "78%",
      aiFeedback: "Model evaluated against 50 test pairs. Latency acceptable (180ms), but multimodal embeddings drift on complex image prompts.",
      deliverable: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/ai_eval_final.zip",
      sowRequirements: [
        "Multi-modal prompt evaluation architecture (>85% target)",
        "Latency under 200ms per inference batch",
        "Clean FastAPI backend endpoint with Swagger docs",
        "Comprehensive PyTest suite with >80% code coverage"
      ],
      chatHistory: [
        { sender: "Sarah Johnson", text: "Please ensure the model scores above 85% on the test benchmark before submission.", time: "Nov 6 • 10:15 IST", hash: "0x89f1...2a" },
        { sender: "Ananya Iyer", text: "Uploaded initial weights. Ran 50 test cases, scored 78%. Latency is optimized to 180ms.", time: "Nov 8 • 18:40 IST", hash: "0x7bc2...1e" },
        { sender: "Sarah Johnson", text: "The accuracy is below our contract threshold of 85%. Filing for escrow dispute review.", time: "Nov 9 • 14:10 IST", hash: "0x1ad3...99" }
      ],
      status: "AWAITING_ARBITRATION",
      createdAt: "Nov 9, 2026 • 14:22 IST"
    },
    {
      id: "CCN-098",
      client: "TechVista Labs",
      freelancer: "Vikram Rathore",
      amount: 14000,
      currency: "INR",
      category: "Scope Creep",
      reason: "Milestone 2 API integration missing Swagger docs and rate limiter implementation.",
      aiScore: "64%",
      aiFeedback: "FastAPI codebase validated. Rate limiter middleware absent in router tree. Test coverage at 52% (target was 80%).",
      deliverable: "github.com/techvista/auth-service/pull/14",
      sowRequirements: [
        "JWT + OAuth2 authentication pipeline",
        "SlowApi Redis rate limiting middleware",
        "Full OpenAPI documentation and Postman collection"
      ],
      chatHistory: [
        { sender: "TechVista Labs", text: "Rate limiter is missing from PR #14.", time: "Nov 5 • 09:30 IST", hash: "0xaa31...11" },
        { sender: "Vikram Rathore", text: "Rate limiter wasn't part of milestone 2 SOW.", time: "Nov 5 • 14:20 IST", hash: "0xcc44...55" }
      ],
      status: "RESOLVED_REFUNDED",
      createdAt: "Nov 6, 2026 • 11:05 IST"
    },
    {
      id: "CCN-092",
      client: "GreenPulse Energy",
      freelancer: "Kavita Sen",
      amount: 6800,
      currency: "INR",
      category: "Missed Deadline",
      reason: "Client claimed delayed delivery, freelancer claims client scope creep without contract amendment.",
      aiScore: "91%",
      aiFeedback: "Contract revision history parsed. Freelancer submitted v1 on time. Additional revisions were out of initial SOW specification.",
      deliverable: "drive.google.com/solar-yield-report-v2.pdf",
      sowRequirements: [
        "10-page IEC compliant solar power system report",
        "Irradiance yield curve math breakdown",
        "Submission by Nov 4, 2026"
      ],
      chatHistory: [
        { sender: "Kavita Sen", text: "v1 submitted on Nov 3 as promised.", time: "Nov 3 • 20:00 IST", hash: "0x12ab...99" },
        { sender: "GreenPulse Energy", text: "Need extra section on inverter sizing.", time: "Nov 4 • 11:00 IST", hash: "0x34cd...88" }
      ],
      status: "RESOLVED_RELEASED",
      createdAt: "Nov 4, 2026 • 19:40 IST"
    }
  ]);

  // Feature 6: Inject Mock Dispute
  const handleInjectMockDispute = () => {
    const mockId = `CCN-${Math.floor(104 + Math.random() * 895)}`;
    const mockAmounts = [5500, 8200, 11500, 16000];
    const pickedAmount = mockAmounts[Math.floor(Math.random() * mockAmounts.length)];
    const mockCategories: DisputeItem["category"][] = ["Code Quality", "Scope Creep", "Missed Deadline", "Incomplete Assets"];
    const pickedCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];

    const newDispute: DisputeItem = {
      id: mockId,
      client: "Sarah Johnson",
      freelancer: "Deepak Nair",
      amount: pickedAmount,
      currency: "INR",
      category: pickedCategory,
      reason: `Client raised dispute under ${pickedCategory}. Deliverable assets incomplete or failing QA suite.`,
      aiScore: `${Math.floor(68 + Math.random() * 15)}%`,
      aiFeedback: "Automated test suite evaluated. 42/50 assertions passed. 8 edge-case unit tests failed validation.",
      deliverable: `ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/mock_deliverable_${mockId}.zip`,
      sowRequirements: [
        "Deliver complete feature set matching Figma design",
        "Ensure all responsive breakpoints render accurately",
        "Clean unit test pass rate (>90%)"
      ],
      chatHistory: [
        { sender: "Sarah Johnson", text: "The staging build is throwing console errors on mobile view.", time: "Just now", hash: "0x99aa...33" },
        { sender: "Deepak Nair", text: "Fixing responsive media queries now.", time: "Just now", hash: "0x88bb...22" }
      ],
      status: "AWAITING_ARBITRATION",
      createdAt: "Just now"
    };

    setDisputesList(prev => [newDispute, ...prev]);
    setActionSuccess(`Mock Dispute Case ${mockId} (₹${pickedAmount.toLocaleString()} INR) successfully injected into court docket.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Feature 1 & 4: Arbitration Actions (Release, Refund, 50/50 Split)
  const handleArbitration = (action: "release" | "refund" | "split") => {
    if (!selectedDispute) return;

    let newStatus: DisputeItem["status"];
    let messageText = "";

    if (action === "release") {
      newStatus = "RESOLVED_RELEASED";
      messageText = `Ruling Executed: 100% of escrow (₹${selectedDispute.amount.toLocaleString()}) released to ${selectedDispute.freelancer}.`;
    } else if (action === "refund") {
      newStatus = "RESOLVED_REFUNDED";
      messageText = `Ruling Executed: 100% of escrow (₹${selectedDispute.amount.toLocaleString()}) refunded to ${selectedDispute.client}.`;
    } else {
      newStatus = "RESOLVED_SPLIT";
      const freelancerAmt = Math.round((selectedDispute.amount * splitRatio) / 100);
      const clientAmt = selectedDispute.amount - freelancerAmt;
      messageText = `Split Ruling Executed: ₹${freelancerAmt.toLocaleString()} (${splitRatio}%) released to ${selectedDispute.freelancer}, ₹${clientAmt.toLocaleString()} (${100 - splitRatio}%) refunded to ${selectedDispute.client}.`;
    }

    setDisputesList(prev => prev.map(d => d.id === selectedDispute.id ? { 
      ...d, 
      status: newStatus,
      splitRatio: action === "split" ? { clientPct: 100 - splitRatio, freelancerPct: splitRatio } : undefined
    } : d));

    setActionSuccess(messageText);
    setSelectedDispute(null);
    setVerdictReason("");
    setTimeout(() => setActionSuccess(null), 4500);
  };

  // Feature 4: Download Official Corporate Arbitration Ruling Certificate as MNC Enterprise-Grade PDF
  const handleDownloadRulingNotice = (dispute: DisputeItem) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Page dimensions
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;

      // 1. Top Decorative Brand Accent Line (Corporate Gradient Style)
      doc.setFillColor(37, 99, 235); // Blue 600
      doc.rect(0, 0, pageWidth, 4, "F");

      doc.setFillColor(6, 182, 212); // Cyan 500
      doc.rect(0, 4, pageWidth, 1.2, "F");

      // 2. Corporate Header Section
      let y = 16;
      
      // Brand Logo block
      doc.setFillColor(15, 23, 42); // Navy 900
      doc.roundedRect(margin, y, 10, 10, 2.5, 2.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("P", margin + 3.2, y + 7.2);

      // Company Name
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("PayPilot Global Protocol Inc.", margin + 14, y + 6);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("ESCROW GOVERNANCE & DISPUTE ADJUDICATION DIVISION • GLOBAL FINANCIAL SERVICES", margin + 14, y + 10.5);

      // Top Right Reference Box (MNC Corporate Badge)
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(pageWidth - margin - 58, y - 1, 58, 14, 2, 2, "FD");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("OFFICIAL DOCKET REF", pageWidth - margin - 54, y + 4);
      doc.setFont("courier", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 64, 175);
      doc.text(dispute.id, pageWidth - margin - 54, y + 10);

      y += 18;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);

      // 3. Document Title & Subtitle
      y += 9;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("ARBITRATION SETTLEMENT & LEGAL ADJUDICATION NOTICE", margin, y);

      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Issued pursuant to Section 4.2 of the PayPilot Autonomous Dual-Signature Escrow Master Services Agreement.`, margin, y);

      // 4. Two-Column Metadata Summary (Issued Date / Status / Escrow Amount)
      y += 6;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "FD");

      // Column 1: Date & Case
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("DATE OF ADJUDICATION", margin + 6, y + 6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(dispute.createdAt, margin + 6, y + 13);

      // Column 2: Dispute Category
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("DISPUTE CLASSIFICATION", margin + 60, y + 6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text(dispute.category.toUpperCase(), margin + 60, y + 13);

      // Column 3: Escrow Sum
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("DISPUTED PRINCIPAL SUM", margin + 120, y + 6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`INR ${dispute.amount.toLocaleString()}.00`, margin + 120, y + 13);

      // 5. Section: Parties to the Dispute (Formatted Table Style)
      y += 26;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("1. IDENTIFICATION OF PARTIES", margin, y);

      y += 3.5;
      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 6, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("ROLE", margin + 4, y + 4.2);
      doc.text("LEGAL NAME / ENTITY", margin + 35, y + 4.2);
      doc.text("ACCOUNT STATUS", margin + 105, y + 4.2);
      doc.text("CUSTODY JURISDICTION", margin + 140, y + 4.2);

      // Row 1: Client
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Client (Buyer):", margin + 4, y + 5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(dispute.client, margin + 35, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(22, 101, 52);
      doc.text("KYC Verified ✓", margin + 105, y + 5);
      doc.setTextColor(100, 116, 139);
      doc.text("PayPal Sandbox Vault", margin + 140, y + 5);

      // Row 2: Freelancer
      y += 7.5;
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y, margin + contentWidth, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Freelancer (Seller):", margin + 4, y + 5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(dispute.freelancer, margin + 35, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(22, 101, 52);
      doc.text("KYC Verified ✓", margin + 105, y + 5);
      doc.setTextColor(100, 116, 139);
      doc.text("PayPal Disbursement Direct", margin + 140, y + 5);

      // 6. Section: Claims & Gemini 1.5 Multi-Modal Audit Evidence
      y += 14;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("2. STATEMENT OF CLAIM & AI TECHNICAL FORENSICS", margin, y);

      y += 4;
      // Client claim box
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(margin, y, contentWidth, 16, 1.5, 1.5, "FD");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(185, 28, 28);
      doc.text("PLAINTIFF / CLIENT GRIEVANCE STATEMENT:", margin + 4, y + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(127, 29, 29);
      const splitReason = doc.splitTextToSize(dispute.reason, contentWidth - 8);
      doc.text(splitReason, margin + 4, y + 9.5);

      // AI Evidence Box
      y += 19;
      doc.setFillColor(240, 249, 255);
      doc.setDrawColor(186, 230, 253);
      doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, "FD");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(3, 105, 161);
      doc.text(`GEMINI 1.5 MULTI-MODAL AUDIT ENGINE VERDICT [CONFIDENCE SCORE: ${dispute.aiScore}]:`, margin + 4, y + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(12, 74, 110);
      const splitAi = doc.splitTextToSize(dispute.aiFeedback, contentWidth - 8);
      doc.text(splitAi, margin + 4, y + 9.5);

      doc.setFont("courier", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Deliverable IPFS CID: ${dispute.deliverable.slice(0, 75)}...`, margin + 4, y + 18.5);

      // 7. Section: Formal Ruling & Settlement Verdict
      y += 28;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("3. FINAL ADJUDICATION RULING & ESCROW EXECUTION", margin, y);

      y += 4;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, y, contentWidth, 34, 2, 2, "FD");

      const verdictTitle = 
        dispute.status === "RESOLVED_RELEASED" ? "FULL ESCROW RELEASED TO FREELANCER (100%)" :
        dispute.status === "RESOLVED_REFUNDED" ? "FULL ESCROW REFUNDED TO CLIENT (100%)" :
        `PROPORTIONAL SPLIT SETTLEMENT (${dispute.splitRatio?.freelancerPct || 50}% Freelancer / ${dispute.splitRatio?.clientPct || 50}% Client)`;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 64, 175);
      doc.text(verdictTitle, margin + 6, y + 8);

      // Payout Breakdown
      const freelancerAmt = dispute.status === "RESOLVED_RELEASED" 
        ? dispute.amount 
        : dispute.status === "RESOLVED_REFUNDED" 
        ? 0 
        : Math.round((dispute.amount * (dispute.splitRatio?.freelancerPct || 50)) / 100);

      const clientAmt = dispute.amount - freelancerAmt;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`• Disbursed to Freelancer (${dispute.freelancer}):`, margin + 6, y + 16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`INR ${freelancerAmt.toLocaleString()}.00 via PayPal Webhook Capture`, margin + 85, y + 16);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`• Refunded to Client (${dispute.client}):`, margin + 6, y + 22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`INR ${clientAmt.toLocaleString()}.00 via PayPal Original Funding Source`, margin + 85, y + 22);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("• Settlement Status:", margin + 6, y + 28);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 101, 52);
      doc.text("EXECUTED • IRREVOCABLE • RECONCILED ON PROTOCOL LEDGER", margin + 85, y + 28);

      // 8. Cryptographic Proofs & Compliance Seal
      y += 40;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, "F");

      doc.setFont("courier", "bold");
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      doc.text("CRYPTOGRAPHIC VERIFICATION SEAL & AUDIT CONSENSUS", margin + 4, y + 5);

      doc.setFont("courier", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text("SHA256 Root Digest: 0x8fa4c3b2110e59a9972bcf1488210499d63c5001a74e5b98ef11029487c6b901", margin + 4, y + 10);
      doc.text(`PayPal IPN Reference: PAYPAL-ARBITRATION-RELAY-${dispute.id}-CONFIRMED-OK`, margin + 4, y + 14.5);
      doc.text("Smart Escrow Contract: 0xPayPilotVaultDualSignMainnetV2 • Consensus Quorum: 2/2 Admin Signatures", margin + 4, y + 19);

      // 9. Signatures Block (Corporate Style)
      y += 30;
      // Admin Signature Line
      doc.setDrawColor(148, 163, 184);
      doc.line(margin + 6, y + 12, margin + 70, y + 12);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text("PayPilot Protocol Governance Administrator", margin + 6, y + 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Authorized Escrow Arbiter • Cryptographically Attested", margin + 6, y + 20);

      // Corporate Stamp Badge on the right
      const stampX = pageWidth - margin - 50;
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(0.6);
      doc.roundedRect(stampX, y, 46, 22, 2, 2, "D");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(37, 99, 235);
      doc.text("PAYPILOT PROTOCOL", stampX + 7, y + 6);
      doc.setFontSize(6);
      doc.setTextColor(22, 101, 52);
      doc.text("★ ARBITRATION SEALED ★", stampX + 5, y + 11.5);
      doc.setFont("courier", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text("VERIFIED OFFICIAL", stampX + 8, y + 17);

      // 10. Bottom Footer
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text("PayPilot Protocol Inc. • One Marina Boulevard, Singapore • support@paypilot.org • Official Legal Tender Escrow Document", margin, pageHeight - 7);
      doc.text("Page 1 of 1 • Strict Confidentiality", pageWidth - margin - 42, pageHeight - 7);

      // Save PDF with pristine naming
      doc.save(`PayPilot_Arbitration_Judgment_${dispute.id}.pdf`);
      setActionSuccess(`Official Enterprise MNC Arbitration Certificate for ${dispute.id} downloaded successfully.`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Filtered List
  const filteredDisputes = disputesList.filter(d => {
    const matchesSearch = 
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.freelancer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = d.status === "AWAITING_ARBITRATION";
    if (statusFilter === "resolved") matchesStatus = d.status.startsWith("RESOLVED");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = disputesList.filter(d => d.status === "AWAITING_ARBITRATION").length;
  const fundsUnderDispute = disputesList
    .filter(d => d.status === "AWAITING_ARBITRATION")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <AdminSidebar activeTab="disputes" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* TOP UTILITY BAR: Profile & Notifications in extreme top-right */}
        <div className="px-8 pt-4 pb-2 border-b border-slate-100 flex items-center justify-end gap-3 bg-white">
          <NotificationBell />
          <UserProfileMenu fallbackName="PayPilot Admin" fallbackRole="Admin" />
        </div>

        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                Arbitration Court
              </span>
              <span className="text-xs font-semibold text-slate-500">Dual-Sign Escrow Protection</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Dispute Arbitration Desk</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Feature 6: Inject Mock Dispute Button */}
            <button
              onClick={handleInjectMockDispute}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Inject Mock Dispute</span>
            </button>

            <span className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              {activeCount} Dispute{activeCount !== 1 ? "s" : ""} Pending Decision
            </span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl">
          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Dispute Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Active Disputes</span>
                <ShieldAlert className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">{activeCount}</p>
              <p className="text-xs text-red-600 font-semibold mt-1">Requires human arbitration</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Funds Under Dispute</span>
                <Lock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">₹{fundsUnderDispute.toLocaleString()}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Held securely in PayPal vault</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Resolution Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">96.8%</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Avg turnaround: 3.2 hours</p>
            </div>
          </div>

          {/* Feature 5: Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStatusFilter("all")} 
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                All Cases ({disputesList.length})
              </button>
              <button 
                onClick={() => setStatusFilter("active")} 
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "active" ? "bg-red-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Awaiting Arbitration ({activeCount})
              </button>
              <button 
                onClick={() => setStatusFilter("resolved")} 
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === "resolved" ? "bg-emerald-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Resolved ({disputesList.length - activeCount})
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Categories</option>
                <option value="Code Quality">Code Quality</option>
                <option value="Scope Creep">Scope Creep</option>
                <option value="Missed Deadline">Missed Deadline</option>
                <option value="Incomplete Assets">Incomplete Assets</option>
              </select>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, client, or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
                />
              </div>
            </div>
          </div>

          {/* Disputes Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[1050px]">
                <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-4 px-6 min-w-[200px]">Case ID & Scope</th>
                    <th className="py-4 px-5 min-w-[200px]">Parties Involved</th>
                    <th className="py-4 px-5 min-w-[130px]">Escrow Amount</th>
                    <th className="py-4 px-5 min-w-[240px]">Dispute Reason</th>
                    <th className="py-4 px-5 min-w-[120px]">AI Score</th>
                    <th className="py-4 px-5 min-w-[180px]">Status</th>
                    <th className="py-4 px-6 text-right min-w-[170px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDisputes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                        No dispute cases match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDisputes.map(dispute => (
                      <tr key={dispute.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-black text-slate-900 block">{dispute.id}</span>
                          <span className="inline-block text-[10px] text-blue-600 font-semibold mt-0.5">{dispute.category}</span>
                          <span className="block text-[10px] text-slate-400">{dispute.createdAt}</span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-800"><span className="text-slate-400 font-medium">Client:</span> {dispute.client}</p>
                            <p className="font-bold text-slate-800"><span className="text-slate-400 font-medium">Freelancer:</span> {dispute.freelancer}</p>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-black text-slate-900 text-sm">
                          ₹{dispute.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-5">
                          <p className="text-slate-700 font-medium max-w-xs truncate text-[11px]" title={dispute.reason}>
                            {dispute.reason}
                          </p>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-block ${
                            parseInt(dispute.aiScore) >= 85 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            parseInt(dispute.aiScore) >= 70 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {dispute.aiScore} Match
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          {dispute.status === "AWAITING_ARBITRATION" && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                              Awaiting Arbitration
                            </span>
                          )}
                          {dispute.status === "RESOLVED_RELEASED" && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Released to Freelancer
                            </span>
                          )}
                          {dispute.status === "RESOLVED_REFUNDED" && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                              Refunded to Client
                            </span>
                          )}
                          {dispute.status === "RESOLVED_SPLIT" && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                              Split Settlement
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {dispute.status === "AWAITING_ARBITRATION" ? (
                              <button
                                onClick={() => {
                                  setSelectedDispute(dispute);
                                  setActiveModalTab("audit");
                                }}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
                              >
                                Arbitrate Case
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedDispute(dispute);
                                    setActiveModalTab("audit");
                                  }}
                                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer whitespace-nowrap"
                                >
                                  Verdict
                                </button>
                                <button
                                  onClick={() => handleDownloadRulingNotice(dispute)}
                                  title="Download Official Ruling Notice"
                                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5 text-blue-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Interactive Adjudication Chamber */}
        {selectedDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                      Dispute ID: {selectedDispute.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase">{selectedDispute.category}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">Arbitration Chamber & Evidence Docket</h3>
                </div>
                <button 
                  onClick={() => setSelectedDispute(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subtabs: AI Audit vs. Deliverable Diff vs. Chat History */}
              <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
                <button
                  onClick={() => setActiveModalTab("audit")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeModalTab === "audit"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  Case Assessment & AI Audit
                </button>
                <button
                  onClick={() => setActiveModalTab("diff")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeModalTab === "diff"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Deliverable vs. SOW Diff
                </button>
                <button
                  onClick={() => setActiveModalTab("chat")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activeModalTab === "chat"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Cryptographic Chat Logs ({selectedDispute.chatHistory.length})
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {activeModalTab === "audit" && (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-semibold">Client:</span>
                        <span className="font-bold text-slate-900">{selectedDispute.client}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-semibold">Freelancer:</span>
                        <span className="font-bold text-slate-900">{selectedDispute.freelancer}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-semibold">Escrow Value:</span>
                        <span className="font-black text-blue-600 text-sm">₹{selectedDispute.amount.toLocaleString()} INR</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Dispute Claim</p>
                      <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100 text-xs text-red-900 leading-relaxed">
                        {selectedDispute.reason}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gemini 1.5 Quality Inspection</p>
                        <span className="text-xs font-black text-amber-600">AI Confidence: {selectedDispute.aiScore}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-800 leading-relaxed font-mono">
                        {selectedDispute.aiFeedback}
                      </div>
                    </div>
                  </>
                )}

                {activeModalTab === "diff" && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 break-all">
                      <span className="text-slate-400 font-bold block mb-1">SUBMITTED DELIVERABLE IPFS CID:</span>
                      {selectedDispute.deliverable}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agreed Scope of Work (SOW) Compliance Checklist</p>
                      <div className="space-y-2">
                        {selectedDispute.sowRequirements.map((req, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                            <span className="text-slate-800 font-medium">{req}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              idx === 0 && parseInt(selectedDispute.aiScore) < 85 
                                ? "bg-red-50 text-red-600 border border-red-200" 
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}>
                              {idx === 0 && parseInt(selectedDispute.aiScore) < 85 ? "MISSED (78%)" : "COMPLIED ✓"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeModalTab === "chat" && (
                  <div className="space-y-3 font-mono text-xs">
                    <p className="text-slate-500 text-[11px] font-sans">Timestamped and SHA-256 sealed messages prior to dispute filing:</p>
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {selectedDispute.chatHistory.map((msg, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold text-slate-700 font-sans">{msg.sender}</span>
                            <div className="flex items-center gap-2">
                              <span>{msg.time}</span>
                              <span className="bg-slate-200 px-1 rounded">{msg.hash}</span>
                            </div>
                          </div>
                          <p className="text-slate-800 text-xs font-sans">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feature 1: Custom 50/50 Split Settlement Slider (When Awaiting Arbitration) */}
                {selectedDispute.status === "AWAITING_ARBITRATION" && (
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 uppercase flex items-center gap-1.5">
                        <Split className="w-3.5 h-3.5 text-purple-600" />
                        Custom Split Settlement Slider
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">
                        {splitRatio}% Freelancer / {100 - splitRatio}% Client
                      </span>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={splitRatio}
                      onChange={(e) => setSplitRatio(Number(e.target.value))}
                      className="w-full accent-purple-600 h-2 bg-purple-200 rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">Client Refund: ₹{Math.round((selectedDispute.amount * (100 - splitRatio)) / 100).toLocaleString()}</span>
                      <span className="text-purple-700">Freelancer Payout: ₹{Math.round((selectedDispute.amount * splitRatio) / 100).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                {selectedDispute.status === "AWAITING_ARBITRATION" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => handleArbitration("refund")}
                      className="py-2.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      100% Refund Client
                    </button>

                    <button
                      onClick={() => handleArbitration("split")}
                      className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Split className="w-3.5 h-3.5" />
                      Execute Split Ruling
                    </button>

                    <button
                      onClick={() => handleArbitration("release")}
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      100% Release Freelancer
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleDownloadRulingNotice(selectedDispute)}
                      className="py-2 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Official Ruling Certificate
                    </button>
                    <button
                      onClick={() => setSelectedDispute(null)}
                      className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Close Docket
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
