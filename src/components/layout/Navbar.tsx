import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  ShieldCheck,
  Building2,
  UserCheck,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  LogIn,
  LogOut,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab, activeTab }) => {
  const {
    currentUser,
    isAuthenticated,
    logout,
    switchRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    setSelectedAppId,
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 text-left group transition-all cursor-pointer"
            >
              <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-[#29B6F6] to-[#0284C7] flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#183153] text-base tracking-tight">AICTE</span>
                  <span className="font-bold text-[#0284C7] text-base tracking-tight">SmartVerify</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-sky-100 text-[#0369A1]">AI</span>
                </div>
                <div className="text-[11px] font-medium text-slate-500 leading-none">
                  National Technical Education Regulatory Verification
                </div>
              </div>
            </button>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search applications, institutions, certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#F4F9FF] border border-sky-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 focus:border-[#29B6F6] text-slate-800 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="hidden lg:flex items-center bg-[#F4F9FF] p-1 rounded-xl border border-sky-100">
            <span className="text-[11px] font-semibold text-slate-500 px-2 uppercase tracking-wider">Demo Mode:</span>
            <button
              onClick={() => switchRole('institution')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                currentUser.role === 'institution' && isAuthenticated
                  ? 'bg-white text-[#0284C7] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View as College / Technical Institution"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>College</span>
            </button>
            <button
              onClick={() => switchRole('officer')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                currentUser.role === 'officer' && isAuthenticated
                  ? 'bg-white text-[#0284C7] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View as AICTE Scrutiny Officer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>AICTE Officer</span>
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                currentUser.role === 'admin' && isAuthenticated
                  ? 'bg-white text-[#0284C7] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View as Systems Administrator"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                  <div className="p-3.5 bg-linear-to-r from-sky-50/80 to-blue-50/50 border-b border-sky-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#183153]">System Alerts & Verification Activity</h4>
                      <p className="text-[11px] text-slate-500">{unreadCount} unread regulatory updates</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-[#0284C7] font-semibold hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">No active notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.applicationId) {
                              setSelectedAppId(notif.applicationId);
                              setActiveTab('application-detail');
                            }
                            setShowNotifDropdown(false);
                          }}
                          className={`p-3.5 hover:bg-sky-50/60 transition-colors cursor-pointer flex gap-3 ${
                            !notif.isRead ? 'bg-sky-50/30' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {notif.severity === 'Success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            {notif.severity === 'Warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                            {notif.severity === 'Error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                            {notif.severity === 'Info' && <ExternalLink className="w-4 h-4 text-sky-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 line-clamp-1">{notif.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                          {!notif.isRead && (
                            <span className="h-2 w-2 rounded-full bg-[#0284C7] shrink-0 mt-1" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setShowNotifDropdown(false);
                        setActiveTab('notifications');
                      }}
                      className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
                    >
                      View All in Notification Center →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login / Profile Button */}
            {!isAuthenticated ? (
              <button
                onClick={() => setActiveTab('login')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-sky-50 text-[#0284C7] hover:bg-sky-100'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-sky-50 transition-colors border border-transparent hover:border-sky-100 cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-sky-200"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-none capitalize">
                      {currentUser.role === 'institution' ? 'Institution User' : currentUser.role === 'officer' ? 'AICTE Officer' : 'Admin'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-sky-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                    <div className="p-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                      <div className="mt-2">
                        <Badge variant={currentUser.role === 'admin' ? 'purple' : currentUser.role === 'officer' ? 'teal' : 'info'} size="sm">
                          {currentUser.designation}
                        </Badge>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Security & System Settings
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('audit-trail');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Audit Trail & Transparency
                      </button>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActiveTab('login');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs rounded-lg text-slate-700 hover:bg-sky-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Switch User / Login Page</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setActiveTab('login');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs rounded-lg text-rose-600 hover:bg-rose-50 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
