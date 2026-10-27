import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  Search,
  AlertCircle,
  LogOut,
  Sparkles,
  Mail,
} from 'lucide-react';

export const SimpleNavbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    logout,
    searchQuery,
    setSearchQuery,
    documents,
    setIsUploadModalOpen,
    unreadEmailCount,
    setIsMailboxOpen,
  } = useApp();

  // Count expiring soon (< 7 days)
  const expiringCount = documents.filter(
    (d) => d.daysRemaining <= 7 && d.status !== 'Approved'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-[#0284C7] to-[#29B6F6] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#183153] text-base tracking-tight">AICTE</span>
                <span className="font-bold text-[#0284C7] text-base tracking-tight">SmartVerify</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-sky-100 text-[#0369A1]">
                  AI Agent
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Automated Document Verification & Prioritization System
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents, scholarship, grant, rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#F4F9FF] border border-sky-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Simple 1-Click Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-[#F4F9FF] p-1 rounded-xl border border-sky-200">
              <button
                onClick={() => switchRole('college')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                  currentUser.role === 'college'
                    ? 'bg-white text-[#0284C7] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to College / Institute Portal"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>College View</span>
              </button>
              <button
                onClick={() => switchRole('aicte')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                  currentUser.role === 'aicte'
                    ? 'bg-white text-[#0284C7] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to AICTE Scrutiny Desk"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>AICTE Side</span>
                {expiringCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {expiringCount}
                  </span>
                )}
              </button>
            </div>

            {/* Expiring Alert Chip */}
            {expiringCount > 0 && (
              <div
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold cursor-pointer"
                onClick={() => switchRole('aicte')}
                title="Urgent documents requiring processing before deadline"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{expiringCount} Expiring Soon!</span>
              </div>
            )}

            {/* Quick Upload Button for College */}
            {currentUser.role === 'college' && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-sm shadow-sky-500/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Document</span>
              </button>
            )}

            {/* Institutional Mailbox Button with Unread Badge */}
            <button
              onClick={() => setIsMailboxOpen(true)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer flex items-center gap-1.5"
              title={`Institutional Regulatory Mailbox (${currentUser.email})`}
            >
              <Mail className="w-4 h-4 text-[#0284C7]" />
              <span className="hidden xl:inline text-xs font-bold text-slate-700">Inbox</span>
              {unreadEmailCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white animate-pulse">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            {/* User profile & logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-sky-200"
              />
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Sign Out to OTP Login Page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
