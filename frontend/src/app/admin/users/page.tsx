"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { 
  Users, Search, Shield, Ban, CheckCircle, CheckCircle2,
  ExternalLink, Mail, ArrowUpRight, UserCheck, UserX,
  Filter, MoreVertical, PlusCircle, Download, RefreshCw,
  X, Check, Sparkles, Key, FileText, CreditCard, Lock, ShieldCheck
} from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Client" | "Freelancer" | "Admin" | "Dispute Arbiter";
  contracts: number;
  spentOrEarned: string;
  trustScore: number;
  status: "ACTIVE" | "UNDER_REVIEW" | "SUSPENDED";
  joined: string;
  paypalEmail: string;
  kycVerified: boolean;
  panVerified: boolean;
  bio?: string;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: "USR-001",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Client",
      contracts: 3,
      spentOrEarned: "₹35,000 spent",
      trustScore: 98,
      status: "ACTIVE",
      joined: "Oct 2026",
      paypalEmail: "sarah.client@paypal.sandbox",
      kycVerified: true,
      panVerified: true,
      bio: "Tech entrepreneur hiring full-stack engineers and AI specialists."
    },
    {
      id: "USR-002",
      name: "Rahul Kumar",
      email: "rahul@freelance.demo",
      role: "Freelancer",
      contracts: 5,
      spentOrEarned: "₹28,500 earned",
      trustScore: 99,
      status: "ACTIVE",
      joined: "Sep 2026",
      paypalEmail: "rahul.developer@paypal.sandbox",
      kycVerified: true,
      panVerified: true,
      bio: "Frontend architect specializing in Next.js, TypeScript & Tailwind CSS."
    },
    {
      id: "USR-003",
      name: "Arjun Menon",
      email: "arjun@freelance.demo",
      role: "Freelancer",
      contracts: 4,
      spentOrEarned: "₹32,000 earned",
      trustScore: 96,
      status: "ACTIVE",
      joined: "Sep 2026",
      paypalEmail: "arjun.energy@paypal.sandbox",
      kycVerified: true,
      panVerified: true,
      bio: "Renewable energy consultant & technical documentation specialist."
    },
    {
      id: "USR-004",
      name: "Ananya Iyer",
      email: "ananya@freelance.demo",
      role: "Freelancer",
      contracts: 2,
      spentOrEarned: "₹9,500 held",
      trustScore: 84,
      status: "UNDER_REVIEW",
      joined: "Nov 2026",
      paypalEmail: "ananya.ai@paypal.sandbox",
      kycVerified: false,
      panVerified: true,
      bio: "Machine learning researcher focusing on multi-modal vision models."
    },
    {
      id: "USR-005",
      name: "PayPilot Admin",
      email: "admin@paypilot.demo",
      role: "Admin",
      contracts: 0,
      spentOrEarned: "Superuser",
      trustScore: 100,
      status: "ACTIVE",
      joined: "Aug 2026",
      paypalEmail: "treasury@paypilot.demo",
      kycVerified: true,
      panVerified: true,
      bio: "Protocol Governance Supervisor & Dual-Sign Escrow Keyholder."
    }
  ]);

  // Feature 3: Register Sandbox User
  const handleAddSandboxUser = () => {
    const mockId = `USR-${Math.floor(100 + Math.random() * 899)}`;
    const mockNames = ["Vikram Rathore", "Kavita Sen", "Deepak Nair", "Pooja Sharma", "Rohit Verma"];
    const pickedName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const isFreelancer = Math.random() > 0.4;
    const mockRole: UserAccount["role"] = isFreelancer ? "Freelancer" : "Client";
    const amountVal = Math.floor(15000 + Math.random() * 35000);

    const newUser: UserAccount = {
      id: mockId,
      name: pickedName,
      email: `${pickedName.toLowerCase().replace(" ", ".")}@sandbox.demo`,
      role: mockRole,
      contracts: Math.floor(1 + Math.random() * 5),
      spentOrEarned: isFreelancer ? `₹${amountVal.toLocaleString()} earned` : `₹${amountVal.toLocaleString()} spent`,
      trustScore: Math.floor(88 + Math.random() * 11),
      status: "ACTIVE",
      joined: "Just now",
      paypalEmail: `${pickedName.toLowerCase().replace(" ", "")}@paypal.sandbox`,
      kycVerified: true,
      panVerified: true,
      bio: isFreelancer ? "Full-stack cloud developer verified via GitHub." : "Startup founder funding developer contracts."
    };

    setUsers(prev => [newUser, ...prev]);
    setActionSuccess(`Sandbox user ${pickedName} (${mockRole}) registered with verified KYC.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Feature 2: Role & Permission Editor
  const handleUpdateRole = (userId: string, newRole: UserAccount["role"]) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    setActionSuccess(`Role updated to ${newRole} for user ${userId}.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Feature 4: Trust Score Recalibration
  const handleRecalibrateScore = (userId: string) => {
    const newScore = Math.min(100, Math.floor(92 + Math.random() * 8));
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, trustScore: newScore } : u));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, trustScore: newScore } : null);
    }
    setActionSuccess(`Gemini AI reputation index recalibrated: New score ${newScore}/100.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Feature 5: CSV Export
  const handleExportCSV = () => {
    const headers = ["User ID", "Name", "Email", "Role", "Contracts", "Volume", "AI Trust Score", "Status", "PayPal Account", "KYC Status", "Joined"];
    const rows = users.map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      u.contracts,
      `"${u.spentOrEarned}"`,
      `${u.trustScore}/100`,
      u.status,
      u.paypalEmail,
      u.kycVerified ? "VERIFIED" : "PENDING",
      `"${u.joined}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `paypilot_user_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccess("User directory exported as CSV spreadsheet.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser(prev => prev ? { ...prev, status: prev.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" } : null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <AdminSidebar activeTab="users" />

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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Directory & Access Control
              </span>
              <span className="text-xs font-semibold text-slate-500">RBAC Security Policies</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">User & Talent Governance</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Feature 3: Add Sandbox User */}
            <button
              onClick={handleAddSandboxUser}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Sandbox User</span>
            </button>

            {/* Feature 5: Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>

            <span className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              {users.length} Registered Accounts
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

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Total Clients</span>
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">1,248</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">+14.2% this month</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Verified Freelancers</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">4,812</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">98.5% completion rate</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Flagged / In Review</span>
                <UserX className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">
                {users.filter(u => u.status === "UNDER_REVIEW").length}
              </p>
              <p className="text-xs text-amber-600 font-semibold mt-1">Pending verification</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Avg Trust Score</span>
                <CheckCircle className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">96.4/100</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">AI reputation index</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by name, email, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button 
                onClick={() => setRoleFilter("all")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${roleFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"}`}
              >
                All Roles
              </button>
              <button 
                onClick={() => setRoleFilter("client")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${roleFilter === "client" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                Clients
              </button>
              <button 
                onClick={() => setRoleFilter("freelancer")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${roleFilter === "freelancer" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                Freelancers
              </button>
              <button 
                onClick={() => setRoleFilter("admin")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${roleFilter === "admin" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                Admins
              </button>
            </div>
          </div>

          {/* User Table with Clean Single-Line Spacing */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[900px]">
                <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-4 px-6 min-w-[220px]">User Details</th>
                    <th className="py-4 px-5 min-w-[120px]">Role</th>
                    <th className="py-4 px-5 min-w-[170px]">Volume / Metrics</th>
                    <th className="py-4 px-5 min-w-[130px]">AI Trust Score</th>
                    <th className="py-4 px-5 min-w-[130px]">Account Status</th>
                    <th className="py-4 px-6 text-right min-w-[200px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p 
                              onClick={() => setSelectedUser(user)}
                              className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{user.name}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </p>
                            <p className="text-slate-400 text-[11px] font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          user.role === "Admin" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                          user.role === "Client" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                          "bg-cyan-50 text-cyan-700 border border-cyan-200"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-800 block">{user.spentOrEarned}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{user.contracts} active escrows</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                          {user.trustScore}/100
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {user.status === "ACTIVE" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        )}
                        {user.status === "UNDER_REVIEW" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200">
                            Under Review
                          </span>
                        )}
                        {user.status === "SUSPENDED" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            Inspect
                          </button>

                          {user.role !== "Admin" ? (
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                user.status === "ACTIVE" 
                                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              }`}
                            >
                              {user.status === "ACTIVE" ? "Suspend Access" : "Reinstate User"}
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400 pr-2">Protected Superuser</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feature 1 & 2: User Deep-Dive & KYC Inspection Drawer Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 text-lg font-black flex items-center justify-center">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{selectedUser.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedUser.email} • {selectedUser.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bio & Details */}
              {selectedUser.bio && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  {selectedUser.bio}
                </div>
              )}

              {/* KYC & Identity Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Identity & Payment Verification
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Government KYC Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    selectedUser.kycVerified 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {selectedUser.kycVerified ? "VERIFIED (Aadhaar / ID)" : "PENDING DOCUMENTS"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">PAN Tax Compliance:</span>
                  <span className="text-emerald-700 font-bold">GST Compliant ✓</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">PayPal Payout Account:</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedUser.paypalEmail}</span>
                </div>
              </div>

              {/* Feature 2: RBAC Role & Permission Switcher */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  RBAC Role & Privilege Tier
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["Client", "Freelancer", "Dispute Arbiter"] as UserAccount["role"][]).map(r => (
                    <button
                      key={r}
                      onClick={() => handleUpdateRole(selectedUser.id, r)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedUser.role === r
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature 4: AI Trust Score Recalibration */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">AI Reputation Trust Score</span>
                  <span className="text-xs text-blue-700">Calculated from 5 deliverable audits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-blue-900">{selectedUser.trustScore}/100</span>
                  <button
                    onClick={() => handleRecalibrateScore(selectedUser.id)}
                    title="Recalibrate Reputation Score"
                    className="p-1.5 rounded-lg bg-white text-blue-600 hover:bg-blue-50 shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex gap-3">
                {selectedUser.role !== "Admin" && (
                  <button
                    onClick={() => toggleUserStatus(selectedUser.id)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      selectedUser.status === "ACTIVE"
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                    }`}
                  >
                    {selectedUser.status === "ACTIVE" ? "Suspend Account" : "Reinstate Account"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
