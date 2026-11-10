"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Users, Search, Shield, Ban, CheckCircle, 
  ExternalLink, Mail, ArrowUpRight, UserCheck, UserX,
  Filter, MoreVertical
} from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [users, setUsers] = useState([
    {
      id: "USR-001",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Client",
      contracts: 3,
      spentOrEarned: "₹35,000 spent",
      trustScore: "98/100",
      status: "ACTIVE",
      joined: "Oct 2026"
    },
    {
      id: "USR-002",
      name: "Rahul Kumar",
      email: "rahul@freelance.demo",
      role: "Freelancer",
      contracts: 5,
      spentOrEarned: "₹28,500 earned",
      trustScore: "99/100",
      status: "ACTIVE",
      joined: "Sep 2026"
    },
    {
      id: "USR-003",
      name: "Arjun Menon",
      email: "arjun@freelance.demo",
      role: "Freelancer",
      contracts: 4,
      spentOrEarned: "₹32,000 earned",
      trustScore: "96/100",
      status: "ACTIVE",
      joined: "Sep 2026"
    },
    {
      id: "USR-004",
      name: "Ananya Iyer",
      email: "ananya@freelance.demo",
      role: "Freelancer",
      contracts: 2,
      spentOrEarned: "₹9,500 held",
      trustScore: "84/100",
      status: "UNDER_REVIEW",
      joined: "Nov 2026"
    },
    {
      id: "USR-005",
      name: "PayPilot Admin",
      email: "admin@paypilot.demo",
      role: "Admin",
      contracts: 0,
      spentOrEarned: "Superuser",
      trustScore: "100/100",
      status: "ACTIVE",
      joined: "Aug 2026"
    }
  ]);

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
        };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <AdminSidebar activeTab="users" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Directory & Access Control
              </span>
              <span className="text-xs font-semibold text-slate-500">RBAC Security Policies</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">User & Talent Governance</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              {users.length} Registered Accounts
            </span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
              <p className="text-3xl font-black text-slate-900">1</p>
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

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button 
                onClick={() => setRoleFilter("all")} 
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${roleFilter === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                All Roles
              </button>
              <button 
                onClick={() => setRoleFilter("client")} 
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${roleFilter === "client" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Clients
              </button>
              <button 
                onClick={() => setRoleFilter("freelancer")} 
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${roleFilter === "freelancer" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Freelancers
              </button>
              <button 
                onClick={() => setRoleFilter("admin")} 
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${roleFilter === "admin" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Admins
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-5">Role</th>
                    <th className="py-3.5 px-5">Volume / Metrics</th>
                    <th className="py-3.5 px-5">AI Trust Score</th>
                    <th className="py-3.5 px-5">Account Status</th>
                    <th className="py-3.5 px-5 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{user.name}</p>
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
                        <span className="font-bold text-slate-800">{user.spentOrEarned}</span>
                        <span className="block text-[10px] text-slate-400">{user.contracts} active escrows</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {user.trustScore}
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
                      <td className="py-4 px-5 text-right">
                        {user.role !== "Admin" ? (
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              user.status === "ACTIVE" 
                                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            }`}
                          >
                            {user.status === "ACTIVE" ? "Suspend Access" : "Reinstate User"}
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400">Protected Superuser</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
